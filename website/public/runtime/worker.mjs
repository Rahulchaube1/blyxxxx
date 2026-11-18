import { evaluate } from "./engine.mjs";

self.onmessage = async ({ data }) => {
    try {
        const response = await fetch(new URL("./blyx.wasm", import.meta.url));
        if (!response.ok)
            throw new Error(
                "Unable to load the Blyx runtime (HTTP " +
                    response.status +
                    ").",
            );
        const module = await WebAssembly.compile(await response.arrayBuffer());
        self.postMessage(
            await evaluate(module, data.source, data.run !== false),
        );
    } catch (error) {
        self.postMessage({
            status: 1,
            output: "",
            diagnostics: [{ message: error.message }],
        });
    }
};
