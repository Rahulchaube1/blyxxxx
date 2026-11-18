import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { Worker } from "node:worker_threads";
import { evaluate } from "../website/public/runtime/engine.mjs";

const wasm = await WebAssembly.compile(await readFile(new URL("../website/public/runtime/blyx.wasm", import.meta.url)));
const examples = JSON.parse(await readFile(new URL("../website/src/lib/samples.json", import.meta.url), "utf8"));
for (const [i, output] of ["2\n10\n", "Fibonacci(10):\n55\n", "Factorial(6):\n720\n10\n", "Hello, World from Blyx!\n"].entries()) {
  const result = await evaluate(wasm, examples[i].code, true);
  assert.deepEqual(result, { status: 0, output, diagnostics: [] });
}
for (const [expr, status] of [["1e-2", 0], ["0b2", 1], ["1 / 0", 4], ["loop {}", 4]]) {
  assert.equal((await evaluate(wasm, "fn main() { println!(" + expr + "); }", true)).status, status);
}
assert.equal((await evaluate(wasm, "fn main() { loop {} }", false)).status, 0);
const worker = new Worker(new URL("../editors/code/src/worker.mjs", import.meta.url), { workerData: { source: examples[0].code, run: true } });
const result = await new Promise((resolve, reject) => { worker.once("message", resolve); worker.once("error", reject); });
assert.deepEqual(result, { status: 0, output: "2\n10\n", diagnostics: [] });
console.log("Passed CLI example fixtures, WebAssembly checks, and editor worker execution.");
