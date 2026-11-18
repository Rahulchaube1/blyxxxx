const { copyFileSync, mkdirSync, readFileSync } = require("node:fs");
const path = require("node:path");
const dest = path.join(__dirname, "../runtime");
mkdirSync(dest, { recursive: true });
const icon = readFileSync(path.join(__dirname, "..", require("../package.json").icon));
if (icon.length > 1024 * 1024 || icon.readUInt32BE(16) > 1024 || icon.readUInt32BE(20) > 1024) {
  throw new Error("Marketplace PNG icons must fit within 1024 x 1024 pixels and 1024 KB.");
}
for (const file of ["engine.mjs", "blyx.wasm"]) {
  copyFileSync(path.join(__dirname, "../../../website/public/runtime", file), path.join(dest, file));
}
