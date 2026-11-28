"""Collect published software downloads without fetching any software artifacts."""
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
import json
import os
from pathlib import Path
import sys
import tomllib
from urllib.parse import quote, urlencode

from adoption import fetch, GALLERY

OWNER = "Rahulchaube1"
PUBLISHER = "RahulChaube"
GITHUB = "https://api.github.com"
SOFTWARE = (".vsix", ".zip", ".tar.gz", ".tgz", ".exe", ".mjs")


def chunks(values, size):
    for index in range(0, len(values), size):
        yield values[index:index + size]


def count(value):
    if type(value) not in (int, float) or value < 0 or (isinstance(value, float) and not value.is_integer()):
        raise ValueError("Invalid download counter")
    return int(value)


def github(path, query=None):
    headers = {"Authorization": "Bearer " + os.environ["GITHUB_TOKEN"], "Accept": "application/vnd.github+json"}
    return fetch(GITHUB + path, query, extra_headers=headers)


def pages(path):
    page = 1
    while True:
        rows = github(path + "?" + urlencode({"per_page": 100, "page": page}))
        yield from rows
        if len(rows) < 100:
            return
        page += 1


def release_files(name):
    base = f"/repos/{OWNER}/{name}/releases"
    for release in pages(base):
        if not release["draft"]:
            for asset in pages(f"{base}/{release['id']}/assets"):
                yield release["tag_name"], asset["name"], asset["download_count"]


def github_downloads():
    names = sorted(r["name"] for r in pages(f"/users/{OWNER}/repos")
                   if "blyx" in r["name"].lower() and not r["private"])
    if "blyxxxx" not in names:
        raise ValueError("Compiler repository missing from GitHub inventory")
    total = 0
    manifest = Path(__file__).resolve().parents[1] / "compiler/blyxc/Cargo.toml"
    cli_tag = "v" + tomllib.loads(manifest.read_text(encoding="utf-8"))["package"]["version"]
    cli_count = 0
    def include(repo, tag, filename, downloads):
        nonlocal total, cli_count
        if filename.lower().endswith(SOFTWARE):
            downloads = count(downloads)
            total += downloads
            if repo == "blyxxxx" and tag == cli_tag:
                cli_count += downloads
    for batch in chunks(names, 16):
        fields = "name releases(first:12){totalCount nodes{tagName isDraft databaseId releaseAssets(first:35){totalCount nodes{name downloadCount}}}}"
        queries = [f'p{i}:repository(owner:"{OWNER}",name:{json.dumps(n)}){{{fields}}}' for i, n in enumerate(batch)]
        result = github("/graphql", {"query": "{" + " ".join(queries) + "}"})
        if result.get("errors"):
            raise ValueError("GitHub returned an incomplete release query: " + str(result["errors"])[:300])
        for i, name in enumerate(batch):
            releases = result["data"][f"p{i}"]["releases"]
            if releases["totalCount"] > len(releases["nodes"]):
                for tag, filename, downloads in release_files(name):
                    include(name, tag, filename, downloads)
                continue
            for release in releases["nodes"]:
                if release["isDraft"]:
                    continue
                assets = release["releaseAssets"]
                if assets["totalCount"] > len(assets["nodes"]):
                    rows = pages(f"/repos/{OWNER}/{name}/releases/{release['databaseId']}/assets")
                    for asset in rows:
                        include(name, release["tagName"], asset["name"], asset["download_count"])
                else:
                    for asset in assets["nodes"]:
                        include(name, release["tagName"], asset["name"], asset["downloadCount"])
    return total, {"tag": cli_tag, "downloads": cli_count}


def official(slug):
    return "blyx" in slug.lower()


def editor_downloads():
    namespace = "https://open-vsx.org/api/" + PUBLISHER
    names = {name for name in fetch(namespace)["extensions"] if official(name)}
    if "blyx-language" not in names:
        raise ValueError("Language extension missing from Open VSX inventory")
    counts = {}
    offset = 0
    while True:
        page = fetch("https://open-vsx.org/api/-/search?" + urlencode({"query": PUBLISHER, "offset": offset, "size": 100}))
        for row in page["extensions"]:
            if row["namespace"].lower() == PUBLISHER.lower() and row["name"] in names:
                counts[row["name"]] = count(row["downloadCount"])
        offset += len(page["extensions"])
        if offset >= page["totalSize"] or not page["extensions"]:
            break
    for name in sorted(names - counts.keys()):
        counts[name] = count(fetch(namespace + "/" + quote(name, safe=""))["downloadCount"])

    installs = {}
    def gallery(criteria, page=1):
        payload = {"filters": [{"criteria": criteria, "pageSize": 100, "pageNumber": page}], "flags": 256}
        result = fetch(GALLERY, payload)["results"][0]
        for row in result["extensions"]:
            name = row["extensionName"]
            if row["publisher"]["publisherName"].lower() == PUBLISHER.lower() and official(name):
                for stat in row.get("statistics", []):
                    if stat["statisticName"] == "install":
                        installs[name] = count(stat["value"])
        return result

    criteria = [{"filterType": 8, "value": "Microsoft.VisualStudio.Code"}, {"filterType": 10, "value": "Blyx"}]
    first = gallery(criteria)
    matches = next(item["count"] for meta in first["resultMetadata"] if meta["metadataType"] == "ResultCount"
                   for item in meta["metadataItems"] if item["name"] == "TotalCount")
    for page in range(2, (matches + 99) // 100 + 1):
        gallery(criteria, page)
    for batch in chunks(sorted(names), 45):
        gallery([{"filterType": 7, "value": PUBLISHER + "." + name} for name in batch])
    if "blyx-language" not in installs:
        raise ValueError("Marketplace did not return the language installation counter")
    return {"openVsx": sum(counts.values()), "marketplace": sum(installs.values())}


def crate_downloads():
    crates = {}
    page = 1
    while True:
        result = fetch(f"https://crates.io/api/v1/crates?q=blyx&per_page=100&page={page}")
        for row in result["crates"]:
            if (row.get("repository") or "").lower().rstrip("/") == f"https://github.com/{OWNER.lower()}/blyxxxx":
                crates[row["id"]] = count(row["downloads"])
        if page * 100 >= result["meta"]["total"]:
            break
        page += 1
    if not {"blyxc", "blyx_lexer", "blyx_ast", "blyx_parser"}.issubset(crates):
        raise ValueError("Official compiler crates missing from results")
    return sum(crates.values())


def main(path):
    with ThreadPoolExecutor(max_workers=3) as pool:
        github_result = pool.submit(github_downloads)
        cargo_result = pool.submit(crate_downloads)
        channels = editor_downloads()
        github_total, cli_release = github_result.result()
        channels.update(github=github_total, cargo=cargo_result.result())
    snapshot = {"observed": datetime.now(timezone.utc).isoformat(timespec="seconds"),
                "channels": channels, "total": sum(channels.values()), "cliRelease": cli_release}
    # Publish a new observation only after every source has completed.
    path.write_text(json.dumps(snapshot, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(snapshot), flush=True)


if __name__ == "__main__":
    main(Path(sys.argv[1]))
