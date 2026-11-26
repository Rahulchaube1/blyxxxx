// Run with the path to a released Blyx Direct compiler for the host OS.
const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const { buildNative } = require("../editors/code/src/direct");

async function main() {
  assert.ok(process.argv[2], "Pass the path to the Blyx Direct compiler.");
  const compiler = path.resolve(process.argv[2]);
  const folder = await fs.mkdtemp(path.join(os.tmpdir(), "Blyx editor "));
  try {
    const sample = path.join(__dirname, "../website/public/articles/blyx-direct/batches.blyx");
    const source = path.join(folder, "observations α.blyx");
    const output = path.join(folder, process.platform === "win32" ? "batch count.exe" : "batch count");
    await fs.copyFile(sample, source);
    await buildNative(compiler, source, output);
    assert.deepEqual(execFileSync(output, { encoding: "utf8" }).trim().split(/\r?\n/),
      ["0", "1", "2", "4611686018427387904", "-1"]);
    const bytes = await fs.readFile(output);
    await assert.rejects(buildNative(compiler, source, output));
    assert.deepEqual(await fs.readFile(output), bytes);
    await assert.rejects(buildNative(process.execPath, source, output), /Blyx Direct release/);
    await fs.writeFile(source, "fn main() { missing(); }");
    const invalid = path.join(folder, "invalid.exe");
    await assert.rejects(buildNative(compiler, source, invalid));
    await assert.rejects(fs.access(invalid), { code: "ENOENT" });
    console.log("Passed editor native build, output, Unicode paths, wrong compiler, existing file and invalid program checks.");
  } finally {
    await fs.rm(folder, { recursive: true, force: true });
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
