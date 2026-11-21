"""Time a one-feature regression on the same CSV, including a warm NumPy baseline.

Usage: python tools/bench_linearfit.py --linearfit /path/to/linearfit
Requires NumPy. The measured Blyx program is the released native executable.
"""
import sys


def csv_fit(path):
    import csv
    n = 0
    mx = my = sxx = sxy = 0.0
    with open(path, encoding="utf8", newline="") as stream:
        reader = csv.reader(stream)
        if next(reader) != ["x", "y"]:
            raise ValueError("unexpected header")
        for x, y in reader:
            x, y = float(x), float(y)
            n += 1
            dx = x - mx
            mx += dx / n
            my += (y - my) / n
            sxx += dx * (x - mx)
            sxy += dx * (y - my)
    slope = sxy / (sxx + 5)
    return {"rows": n, "center_x": mx, "center_y": my, "slope": slope, "ridge": 5,
            "prediction": my + slope * (7.5 - mx)}


def numpy_fit(data, np):
    x, y = data[:, 0], data[:, 1]
    mx, my = x.mean(), y.mean()
    dx = x - mx
    slope = np.dot(dx, y - my) / (np.dot(dx, dx) + 5.0)
    return {"rows": len(x), "center_x": float(mx), "center_y": float(my),
            "slope": float(slope), "ridge": 5, "prediction": float(my + slope * (7.5 - mx))}


def main():
    import argparse
    from datetime import datetime, timezone
    from fractions import Fraction
    import hashlib
    import json
    import math
    import os
    from pathlib import Path
    import platform
    import random
    import statistics
    import subprocess
    import tempfile
    import time

    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--linearfit", required=True, type=Path)
    parser.add_argument("--previous-linearfit", type=Path, help="Time an earlier released binary on the same observations")
    parser.add_argument("--rows", type=int, default=100_000)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    if args.rows < 2:
        parser.error("--rows must be at least two")
    for var in ("OPENBLAS_NUM_THREADS", "MKL_NUM_THREADS", "OMP_NUM_THREADS", "BLIS_NUM_THREADS"):
        os.environ[var] = "1"
    import numpy as np
    exe = args.linearfit.resolve(strict=True)
    tool_version = subprocess.check_output([exe, "--version"], text=True).strip()
    binaries = {tool_version: exe}
    if args.previous_linearfit:
        previous = args.previous_linearfit.resolve(strict=True)
        previous_version = subprocess.check_output([previous, "--version"], text=True).strip()
        if previous_version == tool_version:
            parser.error("Choose two different releases")
        binaries[previous_version] = previous
    seed, warmups, samples = 7621, 3, 9
    with tempfile.TemporaryDirectory() as tmp:
        csv_path = Path(tmp) / "train.csv"
        rng = random.Random(seed)
        sx = sy = xx = xy = 0
        with csv_path.open("w", newline="\n", encoding="ascii") as stream:
            stream.write("x,y\n")
            for _ in range(args.rows):
                x = rng.randrange(-1000, 1001)
                y = 3*x + 7 + rng.randrange(-10, 11)
                stream.write(f"{x},{y}\n")
                sx += x
                sy += y
                xx += x*x
                xy += x*y
        n = args.rows
        slope = Fraction(n*xy-sx*sy, n*xx-sx*sx+5*n)
        mx, my = Fraction(sx, n), Fraction(sy, n)
        expected = {"rows": n, "center_x": float(mx), "center_y": float(my),
                    "slope": float(slope), "ridge": 5, "prediction": float(my+slope*(Fraction(15,2)-mx))}
        fingerprint = hashlib.sha256(csv_path.read_bytes()).hexdigest()
        def load_csv():
            return np.loadtxt(csv_path, dtype=np.float64, delimiter=",", skiprows=1, ndmin=2)
        loaded = load_csv()
        methods = {version + " CLI, fresh process":
                   (lambda binary=binary: subprocess.check_output([binary, csv_path, "--ridge", "5", "--predict", "7.5"]))
                   for version, binary in binaries.items()}
        methods.update({
            "CPython csv, fresh process": lambda: subprocess.check_output([sys.executable, __file__, "--csv-reference", csv_path]),
            "NumPy, warm CSV to JSON": lambda: json.dumps(numpy_fit(load_csv(), np)),
            "NumPy, arrays already in memory": lambda: json.dumps(numpy_fit(loaded, np)),
        })
        timings = {name: [] for name in methods}
        names = list(methods)
        for turn in range(warmups + samples):
            offset = turn % len(names)
            for name in names[offset:] + names[:offset]:
                start = time.perf_counter_ns()
                payload = methods[name]()
                ms = (time.perf_counter_ns()-start)/1e6
                report = json.loads(payload)
                if report.keys() != expected.keys() or not all(
                    math.isclose(report[k], v, abs_tol=1e-9, rel_tol=1e-11)
                    for k, v in expected.items()
                ):
                    raise ValueError(f"incorrect fit from {name}: {report}")
                if turn >= warmups:
                    timings[name].append(round(ms, 3))
    result = {"workload": "Fit one feature with ridge 5 and predict at 7.5 on a valid integer CSV",
              "measured_utc": datetime.now(timezone.utc).date().isoformat(), "rows": n,
              "seed": seed, "input_sha256": fingerprint, "linearfit": tool_version,
              "binary_sha256": hashlib.sha256(exe.read_bytes()).hexdigest(),
              "binary_bytes": exe.stat().st_size, "python": platform.python_version(),
              "release_binaries": {version: hashlib.sha256(path.read_bytes()).hexdigest()
                                   for version, path in binaries.items()},
              "numpy": np.__version__, "blas_threads": 1, "os": platform.platform(),
              "cpu": platform.processor(), "warmups": warmups, "samples": samples,
              "reference": expected, "results": [
                  {"name": name, "median_ms": statistics.median(t), "min_ms": min(t),
                   "max_ms": max(t), "samples_ms": t} for name, t in timings.items()
              ]}
    output = json.dumps(result, indent=2) + "\n"
    if args.output:
        args.output.write_text(output, encoding="utf8")
    else:
        print(output, end="")


if __name__ == "__main__":
    if len(sys.argv) == 3 and sys.argv[1] == "--csv-reference":
        import json
        print(json.dumps(csv_fit(sys.argv[2])))
    else:
        main()
