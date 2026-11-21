"""Publish versioned Blyx framework editor packages from the release named in the catalog."""

import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys
import time
from urllib.parse import urlsplit
from urllib.request import Request, urlopen
from zipfile import ZipFile


ROOT = Path(__file__).resolve().parents[1]
CATALOG = ROOT / "website/src/lib/packages.json"
PUBLISHER = "RahulChaube"
RELEASE_PREFIX = "https://github.com/Rahulchaube1/blyxxxx/releases/download/"


def frameworks():
    packages = json.loads(CATALOG.read_text(encoding="utf-8"))["packages"]
    editors = [item["editor"] for item in packages if item["category"] == "framework"]
    identifiers = {editor["id"] for editor in editors}
    if not editors or len(identifiers) != len(editors):
        raise ValueError("Expected a separate editor for each framework")
    return sorted(editors, key=lambda editor: editor["id"])


def destination(editor, folder):
    publisher, name = editor["id"].split(".", 1)
    filename = name + "-" + editor["version"] + ".vsix"
    url = editor["vsix"]
    if publisher != PUBLISHER or not url.startswith(RELEASE_PREFIX) or Path(urlsplit(url).path).name != filename:
        raise ValueError("Unexpected publisher or release URL for " + editor["id"])
    return folder / filename


def validate(editor, path):
    if hashlib.sha256(path.read_bytes()).hexdigest() != editor["sha256"]:
        raise ValueError("Checksum mismatch for " + path.name)
    with ZipFile(path) as package:
        manifest = json.loads(package.read("extension/package.json"))
        actual_id = manifest["publisher"] + "." + manifest["name"]
        if actual_id != editor["id"] or manifest["version"] != editor["version"]:
            raise ValueError("Unexpected extension identity for " + path.name)


def download(editor, path):
    for attempt in range(3):
        try:
            request = Request(editor["vsix"], headers={"User-Agent": "Blyx-Framework-Editors"})
            with urlopen(request, timeout=60) as response:
                path.write_bytes(response.read())
            validate(editor, path)
            return
        except OSError:
            if attempt == 2:
                raise
            time.sleep(3 * (attempt + 1))


def marketplace_version(extension_id):
    criteria = {"filterType": 7, "value": extension_id}
    body = {"filters": [{"criteria": [criteria], "pageNumber": 1, "pageSize": 1}], "flags": 513}
    request = Request(
        "https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery",
        data=json.dumps(body).encode(),
        headers={"Content-Type": "application/json", "Accept": "application/json;api-version=7.1-preview.1"},
    )
    with urlopen(request, timeout=40) as response:
        matches = json.load(response)["results"][0]["extensions"]
    if not matches:
        return None
    extension = matches[0]
    identity = extension["publisher"]["publisherName"] + "." + extension["extensionName"]
    if identity.lower() != extension_id.lower():
        raise ValueError("Unexpected public listing returned for " + extension_id)
    return extension["versions"][0]["version"]


def main():
    temp = Path(os.environ["RUNNER_TEMP"])
    folder = temp / "framework-vsix"
    folder.mkdir(exist_ok=True)
    mode = sys.argv[1]
    if mode not in ("download", "publish"):
        raise ValueError("Expected download or publish")
    editors = frameworks()
    if mode == "download":
        for editor in editors:
            download(editor, destination(editor, folder))
        print(f"Verified {len(editors)} catalogued editor packages")
        return
    scope = os.environ.get("BLYX_PUBLISH_SCOPE", "all")
    if scope not in {"existing", "all"}:
        raise ValueError("Unknown publication scope")
    cli = temp / "blyx-publisher/node_modules/.bin/vsce"
    updates = []
    additions = []
    for editor in editors:
        current = marketplace_version(editor["id"])
        if current is None:
            if scope == "all":
                additions.append(editor)
        elif current != editor["version"]:
            current_version = tuple(map(int, current.split(".")))
            release_version = tuple(map(int, editor["version"].split(".")))
            if current_version < release_version:
                updates.append(editor)
    for editor in updates + additions:
        path = destination(editor, folder)
        validate(editor, path)
        print(f"Publishing {editor['id']} {editor['version']}", flush=True)
        subprocess.run([str(cli), "publish", "--oidc", "--skip-duplicate", "--packagePath", str(path)], check=True)
        time.sleep(3)


if __name__ == "__main__":
    main()
