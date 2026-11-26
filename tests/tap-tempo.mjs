import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { evaluate } from "../website/public/runtime/engine.mjs";

const assets = new URL("../website/public/", import.meta.url);
const sample = await readFile(new URL("demos/tap-tempo.blyx", assets), "utf8");
const module = await WebAssembly.compile(await readFile(new URL("runtime/blyx.wasm", assets)));
const logic = sample.slice(0, sample.lastIndexOf("fn main()"));

const recordings = [
    [null, [5, 500, 120, 500, 490, 510, 1000, 500]],
    [[], [0, 0, 0]],
    [[100], [0, 0, 0]],
    [[5, 2005], [1, 2000, 30, 2000]],
    [[5, 2006], [0, 0, 0]],
    [[0, 450, 1000], [2, 500, 120, 450, 550]],
    [[0, 500, 3000, 3750], [1, 750, 80, 750]],
    [[0, 400, 400, 1150], [1, 750, 80, 750]],
    [[0, 500, 400, 1400], [1, 1000, 60, 1000]],
    [[0, 500, 1000, 1500, 2000, 2250, 2500, 2750], [5, 250, 240, 500, 500, 250, 250, 250]],
];
for (const [taps, expected] of recordings) {
    const source = taps ? logic + "fn main() { report([" + taps.join(", ") + "]); }" : sample;
    const result = await evaluate(module, source, true);
    assert.equal(result.status, 0, JSON.stringify(result.diagnostics));
    assert.deepEqual(result.output.trim().split(/\s+/).map(Number), expected, JSON.stringify(taps));
}
console.log(recordings.length + " tempo recordings passed in the browser runtime.");
