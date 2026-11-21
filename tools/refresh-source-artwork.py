"""Build the website's source collection with the current catalog artwork."""
import argparse
from hashlib import sha256
from html import escape
from io import BytesIO
import json
from pathlib import Path
import re
from zipfile import ZipFile

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "website/public"
DOWNLOADS = PUBLIC / "downloads"
RELEASE = DOWNLOADS / "blyx-ecosystem-0.1.0-source.zip"
CURRENT = DOWNLOADS / "blyx-ecosystem-source.zip"


def build():
    catalog = json.loads((ROOT / "website/src/lib/packages.json").read_bytes())
    entries = {p["slug"]: p for p in catalog["packages"]}
    output = BytesIO()
    with ZipFile(RELEASE) as archive, ZipFile(output, "w") as updated:
        manifest = json.loads(archive.read("manifest.json"))
        replacements = {}
        for package in manifest["packages"]:
            slug = package["slug"]
            item = entries[slug]
            folder = f"vendor/{slug}/"
            module = archive.read(folder + item["module"] + ".blyx")
            if sha256(module).hexdigest() != package["moduleSha256"]:
                raise ValueError("Source checksum mismatch for " + slug)
            art = (PUBLIC / "packages" / (slug + ".png")).read_bytes()
            package["logoSha256"] = sha256(art).hexdigest()
            if item["logo"].partition("?v=")[2] != package["logoSha256"][:12]:
                raise ValueError("Artwork differs from the catalog for " + slug)
            replacements[folder + "assets/logo.png"] = art
            notice = folder + "assets/NOTICE.txt"
            header, gap, licenses = archive.read(notice).partition(b"\n\n")
            if b"Lucide" not in header or not gap:
                raise ValueError("Unrecognized artwork notice for " + slug)
            replacements[notice] = (
                "The current illustration is part of the Blyx artwork collection. "
                "Earlier editions used Lucide pictograms. Their license texts follow."
            ).encode() + gap + licenses
            readme = folder + "README.md"
            original = archive.read(readme).decode()
            pattern = r'(<img src="assets/logo\.png"[^>]*?\balt=")[^"]*"'
            revised, count = re.subn(pattern, lambda match: match[1] + escape(item["logoAlt"], quote=True) + '"', original, count=1)
            if count != 1:
                raise ValueError("Missing package image in " + readme)
            replacements[readme] = revised.encode()
        replacements["manifest.json"] = (json.dumps(manifest, ensure_ascii=False, indent=2) + "\n").encode()
        for member in archive.infolist():
            data = replacements.get(member.filename)
            updated.writestr(member, archive.read(member) if data is None else data)
    return output.getvalue()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Verify the checked-in website download")
    args = parser.parse_args()
    payload = build()
    if args.check:
        # Recompression bytes may vary across zlib releases. Verify each published member.
        with ZipFile(BytesIO(payload)) as expected, ZipFile(CURRENT) as actual:
            if expected.namelist() != actual.namelist() or any(expected.read(f) != actual.read(f) for f in expected.namelist()):
                raise SystemExit("The source collection artwork needs refreshing")
    else:
        CURRENT.write_bytes(payload)
