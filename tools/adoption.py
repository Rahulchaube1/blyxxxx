"""Read public registry metadata without downloading artifacts or inflating counts."""
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
import json
from pathlib import Path
import re
import sys
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen
import time

ROOT = Path(__file__).resolve().parents[1]
GALLERY = "https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery"
RELEASES = "https://api.github.com/repos/Rahulchaube1/blyxxxx/releases"

def fetch(url, payload=None):
    headers = {"User-Agent": "Blyx-Adoption/1.0 (+https://www.blyx-lang.space/adoption)"}
    if payload is not None:
        headers.update({"Content-Type": "application/json", "Accept": "application/json;api-version=7.2-preview.1"})
    req = Request(url, data=json.dumps(payload).encode() if payload is not None else None, headers=headers)
    for attempt in range(4):
        try:
            with urlopen(req, timeout=30) as r:
                return json.load(r)
        except HTTPError as e:
            if e.code not in {429, 502, 503, 504} or attempt == 3:
                raise
        except (URLError, TimeoutError):
            if attempt == 3:
                raise
        time.sleep(2 ** (attempt + 1))

def listing(item):
    slug, title, ident = item
    criteria = [{"filterType": 7, "value": ident}]
    ms = fetch(GALLERY, {"filters": [{"criteria": criteria, "pageNumber": 1, "pageSize": 1}], "flags": 256})
    rows = ms["results"][0]["extensions"]
    installs = None
    if rows:
        row = rows[0]
        assert (row["publisher"]["publisherName"] + "." + row["extensionName"]).lower() == ident.lower()
        installs = next((int(s["value"]) for s in row.get("statistics", []) if s["statisticName"] == "install"), None)
    ov = fetch("https://open-vsx.org/api/" + ident.replace(".", "/", 1))
    assert (ov["namespace"] + "." + ov["name"]).lower() == ident.lower()
    return {"slug": slug, "title": title, "marketplace": installs, "openVsx": int(ov["downloadCount"])}

def archives():
    totals = {"cli": 0, "direct": 0}
    for page in range(1, 1000):
        rows = fetch(f"{RELEASES}?page={page}&per_page=100")
        for release in rows:
            tag = release["tag_name"]
            if release["draft"] or not re.fullmatch(r"(direct-)?v\d+\.\d+\.\d+", tag):
                continue
            direct = tag.startswith("direct-")
            prefix = "blyxc-direct-" if direct else "blyx-" + tag + "-"
            totals["direct" if direct else "cli"] += sum(a["download_count"] for a in release["assets"]
                if a["name"].startswith(prefix) and a["name"].endswith((".tar.gz", ".zip")))
        if len(rows) < 100:
            return totals
    raise RuntimeError("GitHub release pagination exceeded")

def main(path):
    catalog = json.loads((ROOT/"website/src/lib/packages.json").read_bytes())
    frameworks = [(p["slug"], p["title"], p["editor"]["id"]) for p in catalog["packages"] if p["category"] == "framework"]
    with ThreadPoolExecutor(max_workers=4) as pool:
        packages = list(pool.map(listing, frameworks))
    language = listing(("blyx-language", "Blyx Language", "RahulChaube.blyx-language"))
    counters = {"marketplace": language["marketplace"], "openVsx": language["openVsx"],
        "cargo": fetch("https://crates.io/api/v1/crates/blyxc")["crate"]["downloads"], **archives(),
        "frameworkMs": sum(p["marketplace"] or 0 for p in packages),
        "frameworkOv": sum(p["openVsx"] for p in packages)}
    assert all(isinstance(v, int) and v >= 0 for v in counters.values())
    stamp = datetime.now(timezone.utc).isoformat(timespec="seconds")
    history = json.loads(path.read_bytes())["history"] if path.exists() else {}
    history[stamp[:10]] = counters
    output = {"updated": stamp, "history": dict(sorted(history.items())[-400:]),
              "frameworks": sorted(packages, key=lambda p: p["title"].casefold())}
    tmp = path.with_suffix(".tmp")
    tmp.write_bytes((json.dumps(output, separators=(",", ":"), ensure_ascii=False)+"\n").encode())
    tmp.replace(path)
    print(stamp, counters, flush=True)

if __name__ == "__main__":
    main(Path(sys.argv[1]))
