import data from "../../../public/data/benchmarks.json";
import modelgate from "../../../public/data/modelgate-benchmark.json";
import { repository } from "@/lib/site";
export const metadata = { title: "Performance measurements" };
export default function Benchmarks() {
    return (
        <main className="wrap">
            <header className="page-head">
                <h1>Performance measurements</h1>
                <p>
                    Timings, inputs and reproduction instructions for two Blyx workloads.
                </p>
            </header>
            <section id="modelgate" className="prose">
                <h2>Evaluate 100,000 paired predictions</h2>
                <p>ModelGate 0.1.1 and a Python standard-library CSV implementation read the same labelled rows, computed classification and probability metrics, and returned the same release decision. Every timed run started a fresh process and wrote a JSON report.</p>
                <div className="card table-box">
                    <table>
                        <caption>Wall time on one Windows x64 host, in milliseconds</caption>
                        <thead><tr><th>Implementation</th><th>Median</th><th>Range</th></tr></thead>
                        <tbody>
                            {modelgate.results.map((r) => (
                                <tr key={r.name}>
                                    <th scope="row">{r.name}</th>
                                    <td>{r.median_ms}</td>
                                    <td>{r.min_ms}–{r.max_ms}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p>The benchmark rotated the run order, discarded {modelgate.warmups} warm-ups per implementation and measured {modelgate.samples} runs each. Timing includes startup, file reads, calculation and JSON output. Data generation and report comparisons happen outside the timer. This measures CPU evaluation of an unquoted numeric CSV. Training, GPU execution and dataframe engines are separate workloads.</p>
                <p>To reproduce it, download the ModelGate release, extract it and run the harness from the Blyx repository. Use <code>--extra-python</code> to add another Python interpreter.</p>
                <pre>python tools/bench_modelgate.py --modelgate ./modelgate</pre>
                <div className="actions">
                    <a href={repository + "/blob/blyx-main/tools/bench_modelgate.py"}>Benchmark source</a>
                    <a href="/data/modelgate-benchmark.json">Samples and file hashes</a>
                    <a href="/packages">Get ModelGate →</a>
                </div>
            </section>
            <h2 className="block">Compute Fibonacci(22)</h2>
            <p>Each run starts a new process and checks for the result 17711.</p>
            <div className="card table-box">
                <table>
                    <caption>
                        Elapsed time across nine runs after two warm-ups
                    </caption>
                    <thead>
                        <tr>
                            <th>Runtime</th>
                            <th>Median</th>
                            <th>Range</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.results.map((r) => (
                            <tr key={r.name}>
                                <th>{r.name}</th>
                                <td>{r.median_ms} ms</td>
                                <td>
                                    {r.min_ms}–{r.max_ms} ms
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="prose block">
                <section>
                    <h2>Environment and method</h2>
                    <p>
                        {data.os} · {data.cpu}
                        <br />
                        {data.blyxc} · {data.rustc} · Python {data.python}
                    </p>
                    <p>
                        Compilation happens before measurement. Timing includes
                        process startup. This workload measures command-line
                        latency on one host.
                    </p>
                    <div className="actions">
                        <a
                            href={
                                repository +
                                "/blob/blyx-main/tools/bench_fibonacci.py"
                            }
                        >
                            Benchmark source
                        </a>
                        <a href="/data/benchmarks.json">Raw measurements</a>
                    </div>
                </section>
            </div>
        </main>
    );
}
