import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { handbookText } from "../website/src/lib/handbook-text.mjs";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");
const guides = JSON.parse(await read("website/src/lib/guides.json"));
const samples = JSON.parse(await read("website/src/lib/samples.json"));
for (const [name, full] of [
    ["llms.txt", false],
    ["llms-full.txt", true],
]) {
    const text = handbookText(guides, samples, full);
    if (process.argv.includes("--check")) {
        assert.equal(
            (await read(name)).replaceAll("\r\n", "\n"),
            text,
            name + " is stale. Run node tools/export-handbook.mjs.",
        );
    } else {
        await writeFile(new URL(name, root), text);
    }
}
