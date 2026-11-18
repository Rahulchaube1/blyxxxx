const { copyFileSync, mkdirSync } = require("node:fs");
const path = require("node:path");
const dest = path.join(__dirname, "../runtime");
mkdirSync(dest, { recursive: true });
copyFileSync(path.join(__dirname, "../../../website/public/blyx.png"), path.join(__dirname, "../blyx.png"));
for (const file of ["engine.mjs", "blyx.wasm"]) {
  copyFileSync(path.join(__dirname, "../../../website/public/runtime", file), path.join(dest, file));
}
