"""Run a two-worker sparse training fixture using the tagged BlyxTorch and Chaffinch sources."""
import argparse
import json
from pathlib import Path
import shutil
import subprocess
import tempfile

pins = {
    "blyxtorch": ("blyxtorch", "v0.5.0", "04c2e047c14315e52573ff054770fe5adaa7c1ba"),
    "chaffinch": ("blyx-chaffinch", "v0.2.0", "fb83b7dbd6be1c180d4a335c3c1d319cf9162103"),
}
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--compiler", default="blyxc", help="Blyx compiler with std::buffer")
parser.add_argument("--out", type=Path, default=Path("sparse-measurements.json"))
args = parser.parse_args()
compiler = str(Path(args.compiler).resolve()) if Path(args.compiler).is_file() else args.compiler
with tempfile.TemporaryDirectory() as tmp:
    root = Path(tmp)
    shutil.copyfile(Path(__file__).with_name("sparse-training.blyx"), root / "main.blyx")
    for slug, (repository, tag, commit) in pins.items():
        target = root / "vendor" / slug
        subprocess.run(["git","clone","--quiet","--depth","1","--branch",tag,
                        "https://github.com/Rahulchaube1/"+repository+".git",str(target)],check=True)
        actual = subprocess.check_output(["git","-C",str(target),"rev-parse","HEAD"],text=True).strip()
        assert actual == commit
    output = subprocess.check_output([compiler,"native-run","main.blyx"],cwd=root,text=True)
    measured = json.loads(output)
    x = [.5, -.5, .25, 1.]
    true_targets = [sum(x[c] * (1+(17*k+7*c)%31)/31 for c in range(4)) for k in range(64)]
    before = sum(y*y for y in true_targets)/64
    assert measured["addressable_parameters"] == 2**41 and measured["changed_weights"] == 256
    assert abs(measured["heldout_mse_before"] - before) < 1e-14
    assert abs(measured["heldout_mse_after"] - before/4**12) < 1e-16
    assert measured["unseen_row_zero"]
    args.out.write_text(json.dumps(measured,indent=2)+"\n",encoding="utf-8")
    print(output)
