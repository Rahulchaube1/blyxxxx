import { pageMetadata } from "@/lib/metadata";
import { guideLink, website } from "@/lib/site";

export const metadata = pageMetadata("Blyx project demos", "Try interactive Blyx projects and download their source to run them locally.", website + "/demos");

export default function Demos() {
    return <main className="wrap">
        <header className="page-head"><h1>Blyx project demos</h1><p>Try a project, inspect its measurements and run the source yourself.</p></header>
        <div className="grid">
            <article className="card"><div className="file-label">Interactive · rhythm</div>
                <h2><a href="/demos/tap-tempo">Tap tempo</a></h2><p>Tap along to a song. See the last five beat intervals and find out why one missed beat can leave the tempo estimate steady.</p>
                <div className="actions"><a className="button" href="/demos/tap-tempo">Open instrument</a><a href="/articles/tap-tempo">Read the walkthrough</a></div>
            </article>
            <article className="card"><div className="file-label">Local project · forecasting</div>
                <h2>Forecast monitor</h2><p>Fit a regression, calibrate its prediction interval and check for a sustained change in errors. The download includes the Blyx source and its libraries.</p>
                <div className="actions"><a href="/examples/forecast-monitor.zip" download>Download project (.zip)</a><a href={guideLink("training-and-monitoring")}>Follow the handbook</a></div>
            </article>
        </div>
    </main>;
}
