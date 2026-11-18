"""Compare one recursive workload, including process startup. Run from the repository root."""
import argparse
import json
import os
import platform
import statistics
import subprocess
import sys
import tempfile
import time
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument("--blyxc", required=True, type=Path)
args = parser.parse_args()
compiler = str(args.blyxc.resolve())
source = """fn fib(n: i64) -> i64 {
    if n < 2 { return n; }
    fib(n - 1) + fib(n - 2)
}
fn main() { println!(fib(22)); }
"""

with tempfile.TemporaryDirectory() as directory:
    work = Path(directory)
    blyx = work / "fib.blyx"
    blyx.write_text(source, encoding="utf8")
    rust = work / "baseline.rs"
    rust.write_text(source.replace("println!(fib(22))", 'println!("{}", fib(22))'), encoding="utf8")
    python = work / "baseline.py"
    python.write_text("def fib(n):\n    return n if n < 2 else fib(n-1) + fib(n-2)\nprint(fib(22))\n", encoding="utf8")
    suffix = ".exe" if os.name == "nt" else ""
    native = work / ("blyx-fib" + suffix)
    baseline = work / ("rust-fib" + suffix)
    subprocess.run([compiler, "build", blyx, "-o", native], check=True, stdout=subprocess.PIPE)
    subprocess.run(["rustc", "-C", "opt-level=3", "-C", "overflow-checks=on", "-C", "strip=symbols", rust, "-o", baseline], check=True)
    commands = {"Blyx native": [native], "Rust native": [baseline], "CPython": [sys.executable, python],
                "Blyx interpreter": [compiler, "run", blyx]}
    timings = {name: [] for name in commands}
    for round_index in range(11):
        # Rotate the order so each runtime takes a turn going first.
        names = list(commands)
        for offset in range(len(names)):
            name = names[(round_index + offset) % len(names)]
            start = time.perf_counter_ns()
            output = subprocess.check_output(commands[name], text=True).strip()
            elapsed = (time.perf_counter_ns() - start) / 1e6
            if output != "17711":
                raise RuntimeError(f"{name} produced {output!r}")
            if round_index >= 2:
                timings[name].append(round(elapsed, 3))
    print(json.dumps({"workload": "recursive Fibonacci(22), including process startup",
                      "warmups": 2, "samples": 9, "os": platform.platform(), "cpu": platform.processor(),
                      "python": platform.python_version(), "rustc": subprocess.check_output(["rustc", "--version"], text=True).strip(),
                      "blyxc": subprocess.check_output([compiler, "--version"], text=True).strip(),
                      "sizes_bytes": {"Blyx native": native.stat().st_size, "Rust native": baseline.stat().st_size},
                      "results": [{"name": n, "median_ms": statistics.median(t), "min_ms": min(t), "max_ms": max(t), "samples_ms": t} for n,t in timings.items()]}, indent=2))
