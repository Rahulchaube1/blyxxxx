import { pageMetadata } from "@/lib/metadata";
import { website } from "@/lib/site";
import tools from "@/lib/flightdeck.json";
import Browser from "./browser";

export const metadata = pageMetadata("Flightdeck training workflows", "Find 50 Blyx workflows for training objectives, optimizers, transformer gradients, compression and inference on CPU and Vulkan GPU.", website + "/frameworks/flightdeck");
const release = "https://github.com/Rahulchaube1/blyx-flightdeck/releases/tag/v0.1.0";
export default function Flightdeck() {
    return <main className="wrap"><header className="page-head">
        <a href="/frameworks">Blyx frameworks</a>
        <h1>Flightdeck training workflows</h1>
        <p>Choose a tensor operation, inspect its inputs and outputs, and export a graph for your batch shape. These 50 workflows ship together in Flightdeck 0.1.0.</p>
        <div className="actions"><a className="button" href={release}>Download Flightdeck</a><a href="/articles/flightdeck">Read the GPU study</a><a href="https://github.com/Rahulchaube1/blyx-flightdeck/releases/download/v0.1.0/blyx-flightdeck-0.1.0.vsix">Download the editor (.vsix)</a></div>
    </header><Browser tools={tools} /></main>;
}
