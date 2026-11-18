const { copyFileSync, mkdirSync } = require("node:fs");
const path = require("node:path");
const dest = path.join(__dirname, "../runtime");
mkdirSync(dest, { recursive: true });
for (const file of ["engine.mjs", "blyx.wasm"]) {
  copyFileSync(path.join(__dirname, "../../../website/public/runtime", file), path.join(dest, file));
}
