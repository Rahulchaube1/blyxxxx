"""Compare two tagged Blyx workflows with CPU-only CPython reference programs."""
import argparse
import json
import math
import os
import platform
import statistics
import subprocess
import sys
import tempfile
import time
import zipfile
from pathlib import Path


FRAMES = [((i * 17) % 31 - 15) / 16 for i in range(64)]
NATIVE = {
    "warbler": """
    let samples = FRAME;
    let mut i = 0;
    let mut checksum = 0.0;
    while i < runs {
        let threshold = 0.25 + at([i % 97], 0) / 128.0;
        let result = warbler_meter(samples, threshold, 2.0);
        checksum += at(result, 0) + at(result, 1) + at(result, 2) + at(result, 3);
        i += 1;
    }
    println!(checksum);
""".replace("FRAME", str(FRAMES)),
    "robin": """
    let mut i = 0;
    let mut checksum = 0.0;
    while i < runs {
        let year = 1900.0 + at([i % 200], 0);
        let month = 1.0 + at([i % 12], 0);
        let day = 1.0 + at([i % 28], 0);
        let date = robin_date(year, month, day);
        checksum += at(date, 0) + at(date, 1) + at(date, 2) + at(date, 3);
        i += 1;
    }
    println!(checksum);
""",
}
PYTHON = {
    "warbler": """
import sys
samples = FRAME

def meter(values, threshold, allowed):
    peak = energy = run = longest = 0
    for value in values:
        amplitude = abs(value)
        peak = max(peak, amplitude)
        energy += value * value
        run = run + 1 if amplitude >= threshold else 0
        longest = max(longest, run)
    return peak, energy / len(values), longest, int(longest > allowed)

total = 0.0
for i in range(int(sys.argv[1])):
    total += sum(meter(samples, 0.25 + (i % 97) / 128, 2))
print(total)
""".replace("FRAME", str(FRAMES)),
    "robin": """
import calendar
import datetime
import sys
total = 0
for i in range(int(sys.argv[1])):
    year, month, day = 1900 + i % 200, 1 + i % 12, 1 + i % 28
    date = datetime.date(year, month, day)
    ordinal = date.toordinal()
    day_of_year = ordinal - datetime.date(year, 1, 1).toordinal() + 1
    total += ordinal + date.weekday() + day_of_year + calendar.monthrange(year, month)[1]
print(total)
""",
}


def measure(command):
    start = time.perf_counter_ns()
    output = subprocess.check_output(command, text=True)
    return (time.perf_counter_ns() - start) / 1e6, float(output.strip())


def benchmark(source, compiler, iterations, samples):
    result = {"iterations": iterations, "measuredRuns": samples, "warmupPairs": 2,
              "scope": "Process launch, batch computation and checksum output; compilation excluded.",
              "system": platform.system() + " " + platform.release() + " " + platform.machine(),
              "cpu": platform.processor(), "python": platform.python_version(),
              "blyxc": subprocess.check_output([compiler, "--version"], text=True).strip(),
              "rustc": subprocess.check_output(["rustc", "--version"], text=True).strip(),
              "workloads": []}
    with tempfile.TemporaryDirectory(prefix="blyx-bench-") as work, zipfile.ZipFile(source) as bundle:
        path = Path(work)
        for name in NATIVE:
            folder = path / name
            folder.mkdir()
            for info in bundle.infolist():
                if info.filename.startswith("vendor/" + name + "/") and info.filename.endswith(".blyx"):
                    (folder / Path(info.filename).name).write_bytes(bundle.read(info))
            (folder / "bench.blyx").write_text(
                "use std::cli;\nuse std::text;\nuse " + name + ";\nfn main() {\n"
                "    let runs = text_number(args_at(cli_args(), 0));\n" +
                NATIVE[name].replace("while i < runs", "while at([i], 0) < runs") + "}\n",
                encoding="utf-8",
            )
            (folder / "reference.py").write_text(PYTHON[name], encoding="utf-8")
            exe = folder / ("bench.exe" if os.name == "nt" else "bench")
            subprocess.run([compiler, "build", str(folder / "bench.blyx"), "-o", str(exe)], check=True)
            commands = {"blyx": [str(exe), str(iterations)],
                        "python": [sys.executable, str(folder / "reference.py"), str(iterations)]}
            timings = {label: [] for label in commands}
            checksum = None
            for i in range(samples + 2):
                labels = list(commands) if i % 2 == 0 else list(reversed(commands))
                for label in labels:
                    milliseconds, observed = measure(commands[label])
                    if checksum is None:
                        checksum = observed
                    if not math.isclose(checksum, observed, rel_tol=1e-12, abs_tol=1e-9):
                        raise ValueError(f"{name} output mismatch: {checksum} and {observed}")
                    if i >= 2:
                        timings[label].append(round(milliseconds, 3))
            result["workloads"].append({
                "slug": name, "checksum": checksum, "runsMs": timings,
                "medianMs": {label: round(statistics.median(times), 3) for label, times in timings.items()},
            })
    return result


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, default=Path(__file__).resolve().parents[1] / "website/public/downloads/blyx-ecosystem-0.1.0-source.zip")
    parser.add_argument("--compiler", default="blyxc")
    parser.add_argument("--iterations", type=int, default=20000)
    parser.add_argument("--samples", type=int, default=9)
    parser.add_argument("--output", type=Path)
    options = parser.parse_args()
    if options.iterations <= 0 or options.samples < 3:
        parser.error("Choose positive iterations and at least three measured pairs.")
    report = json.dumps(benchmark(options.source, options.compiler, options.iterations, options.samples), indent=2) + "\n"
    if options.output:
        options.output.write_text(report, encoding="utf-8")
    print(report)
