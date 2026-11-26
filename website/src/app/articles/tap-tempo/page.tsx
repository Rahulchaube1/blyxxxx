import { pageMetadata } from "@/lib/metadata";
import { repository, website } from "@/lib/site";
import styles from "../articles.module.css";

export const metadata = pageMetadata("Building a tap-tempo instrument in Blyx", "Walk through a real rhythm measurement, reproduce the 120 BPM result and see exactly when a rolling median loses the beat.", website + "/articles/tap-tempo");

export default function Article() {
    return <main className="wrap"><article className={styles.body}>
        <header><p className={styles.byline}><a href="/articles">Engineering articles</a> · 26 November 2026</p>
            <h1>What happens when you miss a beat?</h1>
            <p className={styles.dek}>Try tapping along to a song, skip one beat, then carry on. The skipped beat leaves a mark in the timing chart. Whether it changes the tempo depends on how you measure it.</p>
            <a className="button" href="/demos/tap-tempo">Try the instrument</a>
        </header>
        <h2>Six taps at the workbench</h2>
        <p>Choose <strong>Try a missed beat</strong> in the demo. The built-in recording has six taps, with the first at zero milliseconds. Taking the difference between each pair of neighbors gives five intervals.</p>
        <table><thead><tr><th>Tap</th><th>Time (ms)</th><th>Gap (ms)</th></tr></thead><tbody>
            {[[1,0,"—"],[2,500,500],[3,990,490],[4,1500,510],[5,2500,1000],[6,3000,500]].map(([n,t,g]) => <tr key={n}><th scope="row">{n}</th><td>{t}</td><td>{g}</td></tr>)}
        </tbody></table>
        <p>The fifth tap arrives a full second after the fourth. Average all five gaps and you get 600 ms, or 100 beats per minute. Sort those same gaps and the middle value is 500 ms. That gives 120 BPM, which agrees with the four shorter intervals. The chart keeps the full one-second gap visible.</p>
        <h2>From a button press to a Blyx vector</h2>
        <p>The browser takes a timestamp from its monotonic clock when you activate the pad. It keeps the latest six timestamps, rounded to milliseconds, and passes them as a numeric vector to a Blyx worker. Pointer taps and keyboard activations use the same input. The microphone is never needed.</p>
        <pre><code>{`fn gap(taps: vector, i: i64) -> f64 {
    at(taps, i + 1) - at(taps, i)
}`}</code></pre>
        <p>Only differences matter. Adding ten seconds to every timestamp still produces the same intervals. A non-increasing timestamp starts a fresh phrase, as does a gap longer than 2,000 ms. A gap of exactly 2,000 ms still counts. This makes the instrument suitable for tapping beats down to 30 BPM. To follow slower music, tap subdivisions or change the cutoff in the source.</p>
        <h2>Finding the middle without sorting</h2>
        <p>For each candidate interval, the Blyx function <code>middle</code> counts how many values fall below it and how many equal it. In the sample, one gap is shorter than 500 ms and two are exactly 500 ms. With positions numbered from zero, 500 therefore occupies positions one and two. Position two is the middle of five.</p>
        <p>When the window contains an even number of intervals, Blyx averages its two middle values. A 450 ms gap followed by a 550 ms gap gives a 500 ms period. The final division converts the period to beats per minute.</p>
        <pre><code>{`let low = middle(taps, start, end, (count - 1) / 2);
let high = middle(taps, start, end, count / 2);
let period = (low + high) / 2.0;
println!(period);
println!(60000.0 / period);`}</code></pre>
        <p>Here the window is deliberately small. A scan compares at most five candidates against five intervals for each middle position. The web worker runs the same Blyx program as the downloaded example. The web interface supplies timestamps and draws the numbers that program prints.</p>
        <h2>Hear where the estimate changes</h2>
        <p>Tap six times at a steady pace. Double your tapping speed and watch the shorter bars appear. With a full window of five, three shorter intervals move the median into the faster group. The delay is the price of ignoring a single unusual gap. If you consistently tap every other beat, the instrument gives half the song’s tempo. It measures the pulse you supply.</p>
        <h2>Reproduce the reading locally</h2>
        <p>Install the <a href="/download">Blyx CLI</a>, download the example and run it in a terminal. The first three lines are the interval count, the median in milliseconds and the tempo in BPM. The remaining lines are the intervals in arrival order.</p>
        <pre><code>{`blyxc run tap-tempo.blyx

5
500
120
500
490
510
1000
500`}</code></pre>
        <p>For a second experiment, change the input in <code>main</code> to <code>[0, 500, 3000, 3750]</code>. The 2,500 ms pause clears the first phrase. The final two taps give one interval of 750 ms, or 80 BPM.</p>
        <div className="actions"><a href="/demos/tap-tempo.blyx" download>Download tap-tempo.blyx</a><a href={repository + "/blob/blyx-main/website/public/demos/tap-tempo.blyx"}>View source on GitHub</a></div>
    </article></main>;
}
