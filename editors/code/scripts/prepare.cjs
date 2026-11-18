const { copyFileSync, mkdirSync, statSync } = require("node:fs");
const path = require("node:path");
const dest = path.join(__dirname, "../runtime");
mkdirSync(dest, { recursive: true });
// Marketplace rejects extension icons larger than 1024 KB.
const icon = path.join(__dirname, "..", require("../package.json").icon);
if (statSync(icon).size > 1024 * 1024) {
  throw new Error("The packaged Marketplace icon must be 1024 KB or smaller.");
}
for (const file of ["engine.mjs", "blyx.wasm"]) {
  copyFileSync(path.join(__dirname, "../../../website/public/runtime", file), path.join(dest, file));
}
