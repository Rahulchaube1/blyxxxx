const encoder = new TextEncoder();
const decoder = new TextDecoder();

export async function evaluate(module, source, run) {
  const bytes = encoder.encode(source);
  if (bytes.length > 256 * 1024) throw new Error("Source exceeds the 256 KiB editor limit.");
  const diagnostics = [];
  const chunks = [];
  let written = 0;
  const read = (ptr, len) => decoder.decode(new Uint8Array(instance.exports.memory.buffer, ptr, len));
  const instance = await WebAssembly.instantiate(module, { blyx: {
    output(ptr, len) {
      written += len;
      if (written > 64 * 1024) throw new Error("Program output exceeds 64 KiB.");
      chunks.push(read(ptr, len));
    },
    diagnostic(line, column, ptr, len) { diagnostics.push({ line, column, message: read(ptr, len) }); }
  }});
  const ptr = instance.exports.prepare(bytes.length);
  new Uint8Array(instance.exports.memory.buffer, ptr, bytes.length).set(bytes);
  let status;
  try {
    status = instance.exports.evaluate(run ? 1 : 0);
  } catch (error) {
    status = 4;
    diagnostics.push({ line: 0, column: 0, message: error.message });
  }
  return { status, output: chunks.join(""), diagnostics };
}
