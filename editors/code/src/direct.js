const { execFile } = require("node:child_process");
const { promisify } = require("node:util");
const path = require("node:path");
const execute = promisify(execFile);

async function buildNative(compiler, source, output) {
  if (![compiler, source, output].every(file => typeof file === "string" && path.isAbsolute(file))) {
    throw new Error("Choose absolute paths for the compiler, source and output.");
  }
  const options = { shell: false, windowsHide: true, timeout: 30000, maxBuffer: 1024 * 1024 };
  const version = await execute(compiler, ["--version"], options);
  if (!/^blyxc direct \d+\.\d+\.\d+$/.test(version.stdout.trim())) {
    throw new Error("Select the blyxc executable from a Blyx Direct release.");
  }
  return execute(compiler, ["build", source, "-o", output], options);
}

module.exports = { buildNative };
