"""Train the first and last shards of a 2**41-weight lookup model in two CPU processes."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile

import numpy as np


TOTAL = 2**41
PINS = (
    ("blyxtorch", "blyxtorch", "v0.5.0", "04c2e047c14315e52573ff054770fe5adaa7c1ba"),
    ("kinglet", "blyx-kinglet", "v0.2.0", "01bcffbec33c84119f9664eb2d40351bda5e31e9"),
)


def build(root, compiler):
    for slug, repo, tag, sha in PINS:
        target = root / "vendor" / slug
        subprocess.run(["git", "clone", "--quiet", "--depth", "1", "--branch", tag,
                        "https://github.com/Rahulchaube1/" + repo + ".git", str(target)], check=True)
        head = subprocess.check_output(["git", "-C", str(target), "rev-parse", "HEAD"], text=True).strip()
        if head != sha:
            raise ValueError(f"Unexpected release revision for {slug}")
    source = Path(__file__).with_name("checkpoint-worker.blyx")
    shutil.copyfile(source, root / source.name)
    exe = root / ("worker.exe" if os.name == "nt" else "worker")
    subprocess.run([compiler, "build", source.name, "-o", str(exe)], cwd=root, check=True)
    return exe


def train(exe, root, count, targets, checkpoint, steps, label):
    """Launch both native workers before waiting. Publish a generation after both exit successfully."""
    pending = root / (label + ".partial")
    pending.mkdir()
    children = []
    records = []
    try:
        for side, first in (("low", 0), ("high", TOTAL - count)):
            out = pending / (side + ".txt")
            previous = "-"
            if checkpoint is not None:
                record = checkpoint["shards"][side]
                if (record["first"], record["count"]) != (first, count):
                    raise ValueError("Checkpoint coordinate mismatch")
                previous = root / checkpoint["directory"] / record["file"]
                if hashlib.sha256(previous.read_bytes()).hexdigest() != record["sha256"]:
                    raise ValueError("Checkpoint checksum mismatch")
            with out.open("wb") as stream:
                child = subprocess.Popen([str(exe), side, str(targets[side]), str(previous), str(steps)],
                                         stdout=stream)
            children.append(child)
            records.append((side, first, out))
        for child in children:
            if child.wait(timeout=600) != 0:
                raise RuntimeError("Native worker failed")
    finally:
        for child in children:
            if child.poll() is None:
                child.kill()
                child.wait()
    shards = {}
    for side, first, out in records:
        digest = hashlib.sha256(out.read_bytes()).hexdigest()
        shards[side] = {"first": first, "count": count, "file": out.name, "sha256": digest}
    manifest = {"directory": label, "shards": shards}
    (pending / "manifest.json").write_text(json.dumps(manifest), encoding="utf-8")
    pending.rename(root / label)
    return [child.pid for child in children]


def study(root, exe, count):
    sides = ("low", "high")
    targets, truth = {}, {}
    for seed, side in enumerate(sides, 4528):
        rng = np.random.default_rng(seed)
        # Odd numerators guarantee nonzero, exactly representable targets in (-1, 1).
        truth[side] = (2 * rng.integers(0, 2**20, count, dtype=np.int64) + 1 - 2**20) / 2**20
        targets[side] = root / ("target-" + side + ".txt")
        np.savetxt(targets[side], truth[side], fmt="%.17g")
    pids = train(exe, root, count, targets, None, 4, "step-4")
    checkpoint = json.loads((root / "step-4" / "manifest.json").read_text(encoding="utf-8"))
    pids += train(exe, root, count, targets, checkpoint, 4, "resumed-8")
    pids += train(exe, root, count, targets, None, 8, "continuous-8")
    before, after_four, after, trained = 0.0, 0.0, 0.0, 0
    for side in sides:
        resumed = root / "resumed-8" / (side + ".txt")
        direct = root / "continuous-8" / (side + ".txt")
        if resumed.read_bytes() != direct.read_bytes():
            raise ValueError(f"Restart changed the {side} checkpoint")
        saved = np.loadtxt(root / "step-4" / (side + ".txt"))
        if not np.array_equal(saved, truth[side] * (1 - 2.0**-4)):
            raise ValueError(f"Four-epoch checkpoint failed the reference on {side}")
        values = np.loadtxt(resumed)
        if not np.array_equal(values, truth[side] * (1 - 2.0**-8)):
            raise ValueError(f"Independent reference mismatch on {side}")
        trained += int(np.count_nonzero(values))
        before += np.sum(truth[side]**2, dtype=np.float64)
        after_four += np.sum((saved - truth[side])**2, dtype=np.float64)
        after += np.sum((values - truth[side])**2, dtype=np.float64)
    if trained != 2*count:
        raise ValueError("A coordinate failed to change")
    return {"addressable_parameters": TOTAL, "individually_updated_weights": trained,
            "coordinates_per_shard": count, "first_coordinate_of_shards": [0, TOTAL-count],
            "cpu_processes_per_phase": 2, "worker_launches": len(pids), "epochs": 8,
            "restart_after_epoch": 4, "checkpoint_payload": "one round-trip decimal per FP64 weight",
            "restart_byte_identical": True, "max_absolute_weight_error": 0.0,
            "training_mse_before": float(before/trained), "training_mse_at_checkpoint": float(after_four/trained),
            "training_mse_after": float(after/trained),
            "numpy_version": np.__version__}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--compiler", default="blyxc")
    parser.add_argument("--worker", type=Path, help="Reuse a previously compiled checkpoint-worker")
    parser.add_argument("--power", type=int, choices=range(5, 21), default=19,
                        metavar="5..20", help="Train 2**power weights in each of two shards")
    parser.add_argument("--out", type=Path, default=Path("worker-measurements.json"))
    args = parser.parse_args()
    compiler = str(Path(args.compiler).resolve()) if Path(args.compiler).is_file() else args.compiler
    with tempfile.TemporaryDirectory() as tmp:
        root = Path(tmp)
        worker = args.worker.resolve() if args.worker else build(root, compiler)
        report = study(root, worker, 2**args.power)
    text = json.dumps(report, indent=2) + "\n"
    args.out.write_text(text, encoding="utf-8")
    print(text, end="")


if __name__ == "__main__":
    main()
