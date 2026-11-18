import data from "../../../public/data/benchmarks.json";
import { repository } from "@/lib/site";
export const metadata = { title: "Performance measurements" };
export default function Benchmarks() {
    return (
        <main className="wrap">
            <header className="page-head">
                <h1>Performance measurements</h1>
                <p>
                    Recursive Fibonacci(22) on one Windows machine. Each run
                    starts a new process and checks for the result 17711.
                </p>
            </header>
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
