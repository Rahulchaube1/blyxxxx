import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { Worker } from "node:worker_threads";
import { evaluate } from "../website/public/runtime/engine.mjs";

const wasm = await WebAssembly.compile(await readFile(new URL("../website/public/runtime/blyx.wasm", import.meta.url)));
const examples = JSON.parse(await readFile(new URL("../website/src/lib/samples.json", import.meta.url), "utf8"));
for (const sample of examples) {
  const source = await readFile(new URL("../" + sample.file, import.meta.url), "utf8");
  assert.equal(sample.code, source.replaceAll("\r\n", "\n"), sample.id + " source");
  const result = await evaluate(wasm, sample.code, true);
  assert.deepEqual(result, { status: 0, output: sample.expected, diagnostics: [] }, sample.id);
}
const guides = JSON.parse(await readFile(new URL("../website/src/lib/guides.json", import.meta.url), "utf8"));
const catalog = JSON.parse(await readFile(new URL("../website/src/lib/packages.json", import.meta.url), "utf8"));
assert.equal(new Set(catalog.packages.map((p) => p.slug)).size, catalog.packages.length, "unique package slugs");
for (const p of catalog.packages) {
  assert.ok(["framework", "library"].includes(p.category), p.slug + " directory category");
  if (p.collection) {
    assert.equal(p.category, p.collection.family === p.slug ? "framework" : "library", p.slug + " collection role");
  }
  const demo = examples.find((e) => e.id === p.example);
  assert.equal(demo?.expected, p.output, p.slug + " documented output");
  assert.match(p.commit, /^[a-f0-9]{40}$/);
  assert.equal(p.release, p.repository + "/releases/tag/v" + p.version);
  assert.ok(p.program.startsWith("use vendor::" + p.slug + "::" + p.module + ";"), p.slug + " import");
  assert.ok(guides.some((g) => g.slug === p.guide), p.slug + " guide");
  const png = await readFile(new URL("../website/public" + p.logo, import.meta.url));
  assert.equal(png.subarray(0, 8).toString("hex"), "89504e470d0a1a0a", p.slug + " logo");
}
assert.equal(new Set(guides.map((guide) => guide.slug)).size, guides.length, "unique chapter URLs");
for (const guide of guides) {
  if (!guide.example) continue;
  const sample = examples.find((item) => item.id === guide.example);
  assert.ok(sample, guide.slug + " example");
  let solution = sample.code;
  for (const [from, to] of guide.exercise.edits) {
    assert.equal(solution.split(from).length, 2, guide.slug + " exercise must identify a unique edit");
    solution = solution.replace(from, () => to);
  }
  const result = await evaluate(wasm, solution, true);
  assert.deepEqual(result, { status: 0, output: guide.exercise.expected, diagnostics: [] }, guide.slug + " solution");
}
for (const [expr, status] of [["1e-2", 0], ["0b2", 1], ["1 / 0", 4], ["loop {}", 4]]) {
  assert.equal((await evaluate(wasm, "fn main() { println!(" + expr + "); }", true)).status, status);
}
assert.equal((await evaluate(wasm, "fn main() { loop {} }", false)).status, 0);
const worker = new Worker(new URL("../editors/code/src/worker.mjs", import.meta.url), { workerData: { source: examples[0].code, run: true } });
const result = await new Promise((resolve, reject) => { worker.once("message", resolve); worker.once("error", reject); });
assert.deepEqual(result, { status: 0, output: "2\n10\n", diagnostics: [] });
console.log(`Passed ${examples.length} example fixtures, ${guides.filter((g) => g.example).length} handbook solutions, WebAssembly checks, and editor worker execution.`);
