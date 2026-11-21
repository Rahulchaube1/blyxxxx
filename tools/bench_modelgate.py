"""Time the released ModelGate binary and a standard-library Python implementation.

Run from the repository root:
    python tools/bench_modelgate.py --modelgate /path/to/modelgate
"""
import sys


def reference(path):
    """Evaluate the benchmark's paired, numeric, unquoted CSV with the same policy."""
    import csv
    import json

    rows = positives = base_fp = base_fn = cand_fp = cand_fn = 0
    base_error = cand_error = 0.0
    with open(path, newline="", encoding="utf-8") as stream:
        reader = csv.reader(stream)
        if next(reader) != ["label", "baseline", "candidate"]:
            raise ValueError("Unexpected CSV header")
        for record in reader:
            label, baseline, candidate = map(float, record)
            if label not in (0, 1) or not (0 <= baseline <= 1 and 0 <= candidate <= 1):
                raise ValueError("Invalid label or probability")
            rows += 1
            positives += label
            if label:
                base_fn += baseline < 0.5
                cand_fn += candidate < 0.5
            else:
                base_fp += baseline >= 0.5
                cand_fp += candidate >= 0.5
            diff = baseline - label
            base_error += diff * diff
            diff = candidate - label
            cand_error += diff * diff
    if not rows:
        raise ValueError("No predictions")

    def metrics(fp, fn, total_squared_error):
        tp = positives - fn
        return {
            "false_positives": fp, "false_negatives": fn,
            "precision": tp / (tp + fp) if tp + fp else 0.0,
            "recall": tp / positives if positives else 0.0,
            "f1": 2 * tp / (2 * tp + fp + fn) if 2 * tp + fp + fn else 0.0,
            "accuracy": 1 - (fp + fn) / rows, "brier": total_squared_error / rows,
            "cost_per_row": (fp + 5 * fn) / rows,
        }

    baseline = metrics(base_fp, base_fn, base_error)
    candidate = metrics(cand_fp, cand_fn, cand_error)
    cost = baseline["cost_per_row"]
    passed = (candidate["brier"] - baseline["brier"] <= 1e-14
              and candidate["cost_per_row"] - cost <= cost * 1e-14)
    print(json.dumps({"rows": rows, "threshold": 0.5, "fp_cost": 1, "fn_cost": 5,
                      "brier_tolerance": 0, "baseline": baseline,
                      "candidate": candidate, "pass": passed}))
    return 0 if passed else 1


def benchmark():
    import argparse
    from datetime import datetime, timezone
    import hashlib
    import json
    import math
    from pathlib import Path
    import platform
    import random
    import statistics
    import subprocess
    import tempfile
    import time

    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--modelgate", required=True, type=Path)
    parser.add_argument("--rows", type=int, default=100_000)
    parser.add_argument("--extra-python", type=Path, help="Another CPython executable to time on the same input")
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    if args.rows < 1:
        parser.error("--rows must be positive")
    binary = args.modelgate.resolve(strict=True)
    seed = 710221
    interpreters = [Path(sys.executable)]
    if args.extra_python:
        interpreters.append(args.extra_python.resolve(strict=True))
    samples = 9
    with tempfile.TemporaryDirectory() as tmp:
        data = Path(tmp) / "paired.csv"
        rng = random.Random(seed)
        with data.open("w", encoding="ascii", newline="\n") as f:
            f.write("label,baseline,candidate\n")
            for _ in range(args.rows):
                f.write(f"{rng.getrandbits(1)},{rng.random():.6f},{rng.random():.6f}\n")
        input_sha = hashlib.sha256(data.read_bytes()).hexdigest()
        commands = {"Blyx ModelGate": [str(binary), str(data), "--fn-cost", "5"]}
        for executable in interpreters:
            version = subprocess.check_output([executable, "--version"], text=True).strip()
            name = version.replace("Python ", "CPython ") + " csv"
            if name in commands:
                parser.error("Choose distinct CPython versions")
            commands[name] = [str(executable), str(Path(__file__).resolve()), "--reference", str(data)]
        warmups = len(commands)
        timings = {name: [] for name in commands}
        for index in range(warmups + samples):
            order = list(commands)
            start_index = index % len(order)
            names = order[start_index:] + order[:start_index]
            reports = {}
            for name in names:
                start = time.perf_counter_ns()
                run = subprocess.run(commands[name], capture_output=True)
                elapsed = (time.perf_counter_ns() - start) / 1e6
                if run.returncode not in (0, 1):
                    raise RuntimeError(f"{name} exited with {run.returncode}: {run.stderr!r}")
                report = json.loads(run.stdout)
                if report["rows"] != args.rows or run.returncode != int(not report["pass"]):
                    raise ValueError(f"Inconsistent report from {name}")
                reports[name] = report
                if index >= warmups:
                    timings[name].append(round(elapsed, 3))
            actual = reports.pop("Blyx ModelGate")
            for name, expected in reports.items():
                if actual.keys() != expected.keys():
                    raise ValueError(f"Different report fields for {name}")
                for key, value in expected.items():
                    if isinstance(value, dict):
                        if value.keys() != actual[key].keys() or not all(
                            math.isclose(actual[key][metric], target, rel_tol=1e-12, abs_tol=1e-13)
                            for metric, target in value.items()
                        ):
                            raise ValueError(f"Different metrics for {name}: {key}")
                    elif actual[key] != value:
                        raise ValueError(f"Different results for {name}: {key}")
    report = {
        "workload": "Read a paired binary-classification CSV, compute both reports and a release decision",
        "measured_utc": datetime.now(timezone.utc).date().isoformat(),
        "rows": args.rows, "seed": seed, "input_sha256": input_sha,
        "modelgate_binary_sha256": hashlib.sha256(binary.read_bytes()).hexdigest(),
        "binary_bytes": binary.stat().st_size, "os": platform.platform(),
        "cpu": platform.processor(),
        "warmups": warmups, "samples": samples,
        "results": [{"name": name, "median_ms": statistics.median(times),
                     "min_ms": min(times), "max_ms": max(times), "samples_ms": times}
                    for name, times in timings.items()],
    }
    output = json.dumps(report, indent=2) + "\n"
    if args.output:
        args.output.write_text(output, encoding="utf8")
    else:
        print(output, end="")


if __name__ == "__main__":
    if len(sys.argv) == 3 and sys.argv[1] == "--reference":
        sys.exit(reference(sys.argv[2]))
    benchmark()
