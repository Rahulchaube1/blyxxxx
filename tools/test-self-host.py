"""Check a seed against two generations of Blyx machine code and run black-box cases."""
import argparse
import hashlib
import os
from pathlib import Path
import subprocess
import shutil
import tempfile

SOURCE = Path(__file__).resolve().parents[1] / "compiler/blyxc/bootstrap/compiler.blyx"

def run(binary, data, env):
    return subprocess.run([str(binary)], input=data, capture_output=True, env=env, timeout=120)

def compile_with(binary, data, path, env):
    result = run(binary, data, env)
    if result.returncode:
        raise RuntimeError(f"{binary.name}: {result.returncode}: {result.stderr.decode(errors='replace')}")
    path.write_bytes(result.stdout)
    path.chmod(0o755)
    return result.stdout

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("seed", type=Path, help="Stage-zero or self-hosted compiler executable")
    parser.add_argument("--package-dir", type=Path, help="Copy the verified second-generation binary here")
    opts = parser.parse_args()
    seed = opts.seed.resolve()
    env = {**os.environ, "PATH": ""}
    suffix = ".exe" if os.name == "nt" else ""
    with tempfile.TemporaryDirectory() as tmp:
        root = Path(tmp)
        one = root / ("stage1" + suffix)
        two = root / ("stage2" + suffix)
        exe = root / ("program" + suffix)
        src = SOURCE.read_bytes()
        first = compile_with(seed, src, one, env)
        second = compile_with(one, src, two, env)
        assert first == second, "self-compilation did not reach a fixed point"
        version = subprocess.run([two, "--version"], capture_output=True, env=env, check=True)
        assert version.stdout.splitlines() == [b"blyxc direct 0.1.0"]
        for example, expected in [("fibonacci", b"Fibonacci(10):\n55\n"), ("loops", b"Factorial(6):\n720\n10\n")]:
            source = SOURCE.parents[3] / "examples" / "basic" / (example+".blyx")
            target = root / ("space \u03c0 " + example + suffix)
            args = [two, "build", source, "-o", target]
            built = subprocess.run(args, env=env, capture_output=True, timeout=30)
            assert built.returncode == 0, built.stderr
            assert run(target, b"", env).stdout == expected
            before = target.read_bytes()
            assert subprocess.run(args, env=env, capture_output=True).returncode != 0
            assert target.read_bytes() == before, "existing output changed"
        cases = [
            (b'fn main(){println!("hello, Blyx");}', b"hello, Blyx\n"),
            (b'fn main(){println!(fib(10));} fn fib(n:i64)->i64 {if n<2{return n;} fib(n-1)+fib(n-2)}', b"55\n"),
            (b'fn main(){let mut i=0;while i<4{i+=1;if i==2{continue;} print!(i);}println!();}', b"134\n"),
            (b'fn main(){println!(false && 1/0==1);println!(-17%5);println!(true || 1/0==1);}', b"false\n-2\ntrue\n"),
            (b'fn main(){let n=8;if true{let n=5;println!(n);}println!(n);}', b"5\n8\n"),
            (b'fn main(){println!(-9223372036854775808);}', b"-9223372036854775808\n"),
            (b'fn main(){let x=loop {let unused=3+{break 8;};};println!(x);}', b"8\n"),
        ]
        for code, expected in cases:
            compile_with(two, code, exe, env)
            r = run(exe, b"", env)
            assert (r.returncode, r.stdout) == (0, expected), (code, r)
        compile_with(two,b'fn main(){println!(9223372036854775807+1);}',exe,env)
        assert run(exe,b"",env).returncode == 4
        for code in [b"fn main(){let x=1;x=2;}", b"fn main(){missing();}", b"fn main(){println!(true+1);}", b"fn missing(){}"]:
            r = run(two,code,env)
            assert r.returncode != 0 and not r.stdout and r.stderr, (code,r)
        print(f"PASS: fixed point ({len(first)} bytes), execution, overflow and diagnostic checks with empty PATH")
        if opts.package_dir:
            opts.package_dir.mkdir(parents=True, exist_ok=True)
            shutil.copy2(two, opts.package_dir / ("blyxc" + suffix))
            print("Compiler SHA-256", hashlib.sha256(second).hexdigest())

if __name__ == "__main__":
    main()
