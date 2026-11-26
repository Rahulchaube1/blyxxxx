import { evaluate } from "../runtime/engine.mjs";

let compiled;
async function loadRuntime() {
    const response = await fetch(new URL("../runtime/blyx.wasm", import.meta.url));
    if (!response.ok) throw new Error("Could not load the Blyx runtime.");
    return WebAssembly.compile(await response.arrayBuffer());
}

self.onmessage = async ({ data: { id, source } }) => {
    try {
        compiled ??= loadRuntime();
        const result = await evaluate(await compiled, source, true);
        if (result.status !== 0) throw new Error(result.diagnostics.map(d => d.message).join(" "));
        const [count, period, bpm, ...intervals] = result.output.trim().split(/\s+/).map(Number);
        if (count !== intervals.length || ![count, period, bpm, ...intervals].every(Number.isFinite)) {
            throw new Error("Unexpected output from the tempo program.");
        }
        self.postMessage({ id, period, bpm, intervals });
    } catch (error) {
        compiled = undefined;
        self.postMessage({ id, error: error.message || "The Blyx runtime could not finish." });
    }
};
