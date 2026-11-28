import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { performance } from "node:perf_hooks";
import { cpus } from "node:os";
import { evaluate } from "../website/public/runtime/engine.mjs";

const [oldPath, newPath] = process.argv.slice(2);
if (!newPath) throw new Error("Pass the baseline and candidate blyx.wasm paths.");
const binaries = await Promise.all([oldPath, newPath].map(path => readFile(path)));
const modules = await Promise.all(binaries.map(bytes => WebAssembly.compile(bytes)));
const length = 256, repeats = 64;
const a = Array.from({length}, (_, i) => (i % 13) - 6);
const b = Array.from({length}, (_, i) => (i % 7) - 3);
const expected = a.reduce((n, x, i) => n + (x - b[i]) ** 2, 0) * repeats;
const scalar = `fn distance(a: vector, b: vector) -> f64 {
    let mut total = 0.0; let mut i = 0;
    while i < len(a) {
        let d = at(a, i) - at(b, i);
        total += d * d; i += 1;
    }
    total
}`;
function program(builtin) {
    return `${builtin ? "" : scalar}
fn main() {
    let a = [${a}]; let b = [${b}];
    let mut total = 0.0; let mut i = 0;
    while i < ${repeats} {
        total += ${builtin ? "squared_distance" : "distance"}(a, b); i += 1;
    }
    println!(total);
}`;
}
const cases = [
    {name: "previousLoop", module: modules[0], source: program(false)},
    {name: "currentLoop", module: modules[1], source: program(false)},
    {name: "currentBuiltin", module: modules[1], source: program(true)},
];
const times = Object.fromEntries(cases.map(c => [c.name, []]));
for (let round = 0; round < 18; round++) {
    for (let i = 0; i < cases.length; i++) {
        const c = cases[(i + round) % cases.length];
        const start = performance.now();
        const result = await evaluate(c.module, c.source, true);
        const elapsed = performance.now() - start;
        assert.deepEqual(result, {status: 0, diagnostics: [], output: String(expected) + "\n"});
        if (round >= 3) times[c.name].push(elapsed);
    }
}
const mediansMs = Object.fromEntries(Object.entries(times).map(([name, values]) => [name, [...values].sort((a,b) => a-b)[7]]));
console.log(JSON.stringify({node: process.version, cpu: cpus()[0].model, platform: process.platform, arch: process.arch,
    length, repeats, checkedOutput: expected, bytes: binaries.map(b => b.length), mediansMs, samplesMs: times}, null, 2));
