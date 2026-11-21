import data from "../../../public/data/benchmarks.json";
import modelgate from "../../../public/data/modelgate-benchmark.json";
import linearfit from "../../../public/data/linearfit-benchmark.json";
import blyxtorch from "../../../public/data/blyxtorch-benchmark.json";
import workflows from "../../../public/data/workflow-benchmarks.json";
import { repository } from "@/lib/site";
export const metadata = { title: "Performance measurements" };
export default function Benchmarks() {
    return (
        <main className="wrap">
            <header className="page-head">
                <h1>Performance measurements</h1>
                <p>
                    Timings, inputs and reproduction instructions for Blyx training, evaluation and numerical workloads.
                </p>
            </header>
            <section id="workflows" className="prose block">
                <h2>Audio metering and calendar operations</h2>
                <p>Warbler measured peak, energy and clipping on a 64-sample frame with a varying threshold. Its CPython reference used one loop. Robin calculated the day number, weekday, day of year and month length. Its reference used Python’s datetime and calendar modules.</p>
                <div className="table-box"><table>
                    <caption>Median elapsed milliseconds for {workflows.iterations.toLocaleString("en-US")} calls per process</caption>
                    <thead><tr><th scope="col">Workflow</th><th scope="col">Native Blyx</th><th scope="col">CPython reference</th></tr></thead>
                    <tbody>{workflows.workloads.map((w) => <tr key={w.slug}>
                        <th scope="row"><a href={"/packages/" + w.slug}>{w.slug === "warbler" ? "Warbler" : "Robin"}</a></th>
                        <td>{w.medianMs.blyx} ms</td><td>{w.medianMs.python} ms</td>
                    </tr>)}</tbody>
                </table></div>
                <p>{workflows.system}, {workflows.blyxc}, CPython {workflows.python}. After {workflows.warmupPairs} warm-up pairs, the harness alternated launch order for {workflows.measuredRuns} measured pairs and checked each output checksum. Timings include process startup and the batch. Both references receive valid inputs. Installation and compilation finish before timing begins.</p>
                <div className="actions"><a href={repository + "/blob/blyx-main/tools/bench-ecosystem.py"}>Reproduce both workloads</a><a href="/data/workflow-benchmarks.json">All timings and environment</a></div>
            </section>
            <section id="blyxtorch" className="prose">
                <h2>Score a small neural network on {blyxtorch.rows.toLocaleString("en-US")} rows</h2>
                <p>BlyxTorch and CPU PyTorch loaded the same 17 weights, read a numerical CSV and returned the mean binary cross-entropy for a two-input, four-hidden-unit classifier. The harness checked every result. All implementations used one CPU thread on the same Windows x64 machine.</p>
                <div className="card table-box"><table>
                    <caption>Milliseconds across {blyxtorch.measured_runs} measured runs after {blyxtorch.warmups} warm-ups</caption>
                    <thead><tr><th scope="col">Implementation and timing boundary</th><th scope="col">Median</th><th scope="col">Range</th></tr></thead>
                    <tbody>{blyxtorch.timings.map((r) => (
                        <tr key={r.name}><th scope="row">{r.name}</th><td>{r.median_ms}</td><td>{Math.min(...r.samples_ms)}–{Math.max(...r.samples_ms)}</td></tr>
                    ))}</tbody>
                </table></div>
                <p>Fresh runs include process startup and, for Python, library imports. The warm PyTorch run uses an existing interpreter and a vectorized batch. All three include reading the checkpoint and CSV. Training, GPU execution and larger networks need separate measurements.</p>
                <p>{blyxtorch.framework} · CPU PyTorch {blyxtorch.torch} · CPython {blyxtorch.python} · NumPy {blyxtorch.numpy}</p>
                <div className="actions">
                    <a href="/packages/blyxtorch">Get BlyxTorch</a>
                    <a href="https://github.com/Rahulchaube1/blyxtorch/blob/v0.1.0/verification/bench_score.py">Benchmark source</a>
                    <a href="/data/blyxtorch-benchmark.json">Raw measurements and input hash</a>
                    <a href="https://github.com/Rahulchaube1/blyxtorch/blob/v0.1.0/verification/parity.json">PyTorch gradient checks</a>
                </div>
            </section>
            <section id="linearfit" className="prose">
                <h2>Fit a one-feature regression on {linearfit.rows.toLocaleString("en-US")} rows</h2>
                <p>Each implementation fits the same ridge model and predicts at x = 7.5. The harness checks every reported value against an exact rational calculation. It runs on one Windows x64 host and rotates the order of the implementations.</p>
                <div className="card table-box"><table>
                    <caption>Wall time in milliseconds, median of {linearfit.samples} measured runs</caption>
                    <thead><tr><th scope="col">Implementation and timing boundary</th><th scope="col">Median</th><th scope="col">Range</th></tr></thead>
                    <tbody>{linearfit.results.map((r) => (
                        <tr key={r.name}><th scope="row">{r.name}</th><td>{r.median_ms}</td><td>{r.min_ms}–{r.max_ms}</td></tr>
                    ))}</tbody>
                </table></div>
                <p>The Blyx and standard-library Python commands include process startup, CSV parsing, fitting, prediction and JSON output. LinearFit 0.1.1 accumulates the training statistics in scalar variables for the whole file. The warm NumPy CSV run includes reading and fitting in an existing interpreter. The in-memory row times only fitting, prediction and JSON serialization after the arrays are loaded.</p>
                <p>{linearfit.linearfit} · CPython {linearfit.python} · NumPy {linearfit.numpy} · One BLAS thread. The input contains one integer feature and one target per row. File generation, imports for the warm NumPy runs and result checks happen outside the timers.</p>
                <pre>python tools/bench_linearfit.py --linearfit ./linearfit --previous-linearfit ./linearfit-v0.1.0</pre>
                <div className="actions">
                    <a href="/packages/linearfit">Get LinearFit</a>
                    <a href={repository + "/blob/blyx-main/tools/bench_linearfit.py"}>Benchmark source</a>
                    <a href="/data/linearfit-benchmark.json">Samples and file hashes</a>
                </div>
            </section>
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
                    <a href="/packages/modelgate">Get ModelGate →</a>
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
