import { readFileSync } from "node:fs";
import { join } from "node:path";
import { pageMetadata } from "@/lib/metadata";
import { website } from "@/lib/site";
import Instrument from "./instrument";

export const metadata = pageMetadata("Tap tempo in Blyx", "Tap along to a song and measure its tempo in your browser with a running Blyx program.", website + "/demos/tap-tempo");

export default function TapTempo() {
    const program = readFileSync(join(process.cwd(), "public/demos/tap-tempo.blyx"), "utf8");
    return <main className="wrap">
        <header className="page-head">
            <a href="/demos">Project demos</a>
            <h1>Tap tempo</h1>
            <p>Tap the pad once per beat as you listen. You can also focus the pad and press Space. Blyx measures your timing on this device.</p>
        </header>
        <Instrument program={program} />
        <section className="prose block">
            <h2>What the bars mean</h2>
            <p>Read the bars from top to bottom, oldest first. A longer bar means more time passed between taps. Blyx takes the median of the latest five intervals. After a gap longer than two seconds, your next tap starts a fresh phrase.</p>
            <div className="actions"><a className="button" href="/articles/tap-tempo">How the instrument works</a><a href="/demos/tap-tempo.blyx" download>Download the Blyx program</a></div>
        </section>
    </main>;
}
