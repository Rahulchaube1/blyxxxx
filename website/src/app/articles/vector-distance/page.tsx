import { pageMetadata } from "@/lib/metadata";
import { website, repository } from "@/lib/site";
import styles from "../articles.module.css";

export const metadata = pageMetadata("Finding the nearest center in one pass", "Measure squared vector distance in Blyx 0.2.3 and reproduce the comparison.", website + "/articles/vector-distance");

export default function Article() {
    return <main className={styles.body}><article>
        <header><p className={styles.byline}>28 November 2026 · Blyx 0.2.3</p><h1>Finding the nearest center in one pass</h1>
        <p className={styles.dek}>Suppose a sensor reports a point at (2, 3). Which reference point is closer, (1, 1) or (5, 7)? In Blyx you can now answer that question without writing an indexing loop.</p></header>
        <pre><code>{'fn main() {\n    let point = [2.0, 3.0];\n    println!(squared_distance(point, [1.0, 1.0]));\n    println!(squared_distance(point, [5.0, 7.0]));\n}'}</code></pre>
        <p>The program prints 5 and 25. The first center is closer. Taking square roots would preserve the order, so a nearest-center classifier can compare the squared values directly.</p><a href="/play?example=nearest-centroid">Run it and change the inputs</a>
        <h2>Where the loop spent its time</h2><p>An equivalent loop reads two coordinates with at, subtracts them and accumulates their squared difference. The interpreter dispatches each of those expressions for every coordinate. In 0.2.3 the common one- and two-argument vector calls keep their arguments on the stack. Existing loops pick up that change when they run with the new interpreter.</p>
        <p>The new built-in moves the whole reduction into the runtime. It reads each vector once, uses a single accumulator and creates no intermediate difference vector. The CLI interpreter, native backend and WebAssembly runtime implement the same operation. Two empty vectors return zero. Different lengths raise an error. With large enough coordinates the squared result can exceed the range of a double.</p>
        <h2>What we measured</h2><p>On a Windows x64 laptop with an Intel Core i5-12450H, we compared a pair of 256-coordinate vectors 64 times per program in Node.js 24.17.0. Each run produced the same total of 298,368. We rotated execution order, discarded three warm-ups per case and took the median of 15 samples. Each sample included creating a WebAssembly instance, parsing the source and running it. Module compilation took place before timing.</p>
        <table><caption>Median elapsed time per program</caption><thead><tr><th>Runtime</th><th>Program</th><th>Time</th></tr></thead><tbody>
        <tr><td>0.2.2</td><td>Indexing loop</td><td>17.62 ms</td></tr><tr><td>0.2.3</td><td>Same indexing loop</td><td>16.18 ms</td></tr><tr><td>0.2.3</td><td>squared_distance</td><td>0.42 ms</td></tr></tbody></table>
        <p>The built-in took about one forty-second of the old loop’s time on this input. Native programs already compile loops to machine code, so these interpreter timings cannot predict their speed. Small vectors and programs that spend their time in input or output will have different results.</p>
        <h2>A smaller download</h2><p>Removing symbol information from the shipped WebAssembly binary reduced its size from 274,145 to 244,137 bytes. Browser and editor users receive the same runtime. These figures count the uncompressed module and exclude the rest of the extension.</p>
        <h2>Reproduce the comparison</h2><p>From a checkout of the release, save the previous interpreter using Git and run the benchmark with Node.js. Use a binary-safe shell for the redirection, such as Bash.</p>
        <pre><code>{'git show v0.2.2:website/public/runtime/blyx.wasm > previous.wasm\nnode tools/bench-vector-distance.mjs previous.wasm website/public/runtime/blyx.wasm'}</code></pre>
        <p><a href="/articles/vector-distance/measurements.json">Download all 45 timings</a> · <a href={repository + "/blob/v0.2.3/tools/bench-vector-distance.mjs"}>Benchmark source</a> · <a href="/download">Download the CLI</a> · <a href="/vscode">Install the editor release</a></p>
    </article></main>;
}
