import { readFile } from "node:fs/promises";
import { parentPort, workerData } from "node:worker_threads";
import { evaluate } from "../runtime/engine.mjs";

const bytes = await readFile(new URL("../runtime/blyx.wasm", import.meta.url));
const module = await WebAssembly.compile(bytes);
parentPort.postMessage(await evaluate(module, workerData.source, workerData.run));
