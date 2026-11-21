"""Build and verify the native CLIs in a tagged Blyx ecosystem source bundle."""
import argparse
import hashlib
import json
import os
import platform
import shutil
import subprocess
import tempfile
import zipfile
from pathlib import Path


def run(*args, cwd, expected=None):
    result = subprocess.run(args, cwd=cwd, text=True, encoding="utf-8", capture_output=True)
    if result.returncode:
        raise RuntimeError(f"{args[0]} failed in {cwd}\n{result.stderr}\n{result.stdout}")
    if expected is not None and result.stdout != expected:
        raise ValueError(f"Output mismatch in {cwd}\nExpected {expected!r}, received {result.stdout!r}")
    return result.stdout


def extract_source(source, destination):
    with zipfile.ZipFile(source) as archive:
        for member in archive.infolist():
            path = (destination / member.filename).resolve()
            if not path.is_relative_to(destination):
                raise ValueError(f"Invalid source archive member {member.filename}")
            archive.extract(member, destination)
    return json.loads((destination / "manifest.json").read_text(encoding="utf-8"))


def build(source, out, compiler):
    out.mkdir(parents=True, exist_ok=True)
    systems = {"Windows": "windows", "Linux": "linux", "Darwin": "macos"}
    machines = {"amd64": "x64", "x86_64": "x64", "aarch64": "arm64", "arm64": "arm64"}
    target = systems[platform.system()] + "-" + machines[platform.machine().lower()]
    suffix = ".exe" if os.name == "nt" else ""
    with tempfile.TemporaryDirectory(prefix="blyx-ecosystem-") as temp:
        root = Path(temp).resolve()
        manifest = extract_source(source, root)
        compiler_version = run(compiler, "--version", cwd=root).strip()
        if compiler_version != "blyxc " + manifest["compiler"]:
            raise ValueError(f"Bundle needs blyxc {manifest['compiler']}, found {compiler_version}")
        dist = root / "distribution"
        binary_dir = dist / "bin"
        binary_dir.mkdir(parents=True)
        packages = manifest["packages"]
        for package in packages:
            name = package["slug"]
            folder = root / "vendor" / name
            module = folder / (name + ".blyx")
            if hashlib.sha256(module.read_bytes()).hexdigest() != package["moduleSha256"]:
                raise ValueError(f"Unexpected module content for {name}")
            for dependency in package["libraries"]:
                vendored = folder / (dependency + ".blyx")
                upstream = root / "vendor" / dependency / (dependency + ".blyx")
                if vendored.read_bytes() != upstream.read_bytes():
                    raise ValueError(f"Dependency mismatch in {name}: {dependency}")
            run(compiler, "native-run", "tests.blyx", cwd=folder, expected="passed\n")
            expected = (folder / "expected/example.txt").read_text(encoding="utf-8")
            run(compiler, "native-run", "example.blyx", cwd=folder, expected=expected)
            if package["kind"] == "framework":
                binary = binary_dir / (name + suffix)
                run(compiler, "build", "project.blyx", "-o", str(binary), cwd=folder)
                run(str(binary), cwd=root, expected=expected)
                run(str(binary), "--help", cwd=root)
        for name in ("manifest.json", "LICENSE-MIT", "LICENSE-APACHE"):
            shutil.copyfile(root / name, dist / name)
        (dist / "README.md").write_text(
            "# Blyx workflow CLIs\n\n"
            "The bin directory contains the native framework commands for " + target + ". "
            "Run a command with no arguments for its sample, or with --help to list its inputs. "
            "For example, run bin/warbler --help (bin\\warbler.exe --help in PowerShell). "
            "Each emits its numeric result, one field per line. The package pages document the order.\n\n"
            "[Package directory](https://www.blyx-lang.space/packages) · "
            "[Blyx source bundle](https://www.blyx-lang.space/downloads/blyx-ecosystem-"
            + manifest["version"] + "-source.zip)\n",
            encoding="utf-8",
        )
        members = sorted(p for p in dist.rglob("*") if p.is_file())
        (dist / "SHA256SUMS").write_text(
            "".join(hashlib.sha256(f.read_bytes()).hexdigest() + "  " + f.relative_to(dist).as_posix() + "\n" for f in members),
            encoding="utf-8",
        )
        archive_path = out / f"blyx-ecosystem-{manifest['version']}-{target}.zip"
        with zipfile.ZipFile(archive_path, "w", compression=zipfile.ZIP_DEFLATED) as archive:
            for file in [*members, dist / "SHA256SUMS"]:
                archive.write(file, file.relative_to(dist).as_posix())
    print(f"Verified {len(packages)} packages and {sum(p['kind'] == 'framework' for p in packages)} native commands. Wrote {archive_path}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path)
    parser.add_argument("--out", required=True, type=Path)
    parser.add_argument("--compiler", default="blyxc")
    args = parser.parse_args()
    build(args.source.resolve(), args.out.resolve(), args.compiler)
