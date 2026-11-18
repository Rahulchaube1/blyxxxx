import data from "../../../public/data/benchmarks.json";

export default function Benchmarks() {
  return <main style={{maxWidth: 900, margin: "0 auto", padding: "64px 24px", lineHeight: 1.7}}>
    <h1>Performance measurements</h1>
    <p>Each process computes Fibonacci(22) recursively and prints 17711. Timings include process startup. Compilation takes place before measurement.</p>
    <table style={{width:"100%", textAlign:"left", margin:"24px 0"}}>
      <caption style={{textAlign:"left"}}>Elapsed time across nine runs, after two warm-ups</caption>
      <thead><tr><th>Runtime</th><th>Median</th><th>Range</th></tr></thead>
      <tbody>{data.results.map(row => <tr key={row.name}><th>{row.name}</th><td>{row.median_ms} ms</td><td>{row.min_ms}–{row.max_ms} ms</td></tr>)}</tbody>
    </table>
    <p>{data.os} · {data.cpu}<br/>{data.blyxc} · {data.rustc} · Python {data.python}</p>
    <p>This small integer program measures command-line latency on one machine. Tensor throughput, memory use and GPU training need separate workloads.</p>
    <a href="https://github.com/Rahulchaube1/blyxxxx/blob/blyx-main/tools/bench_fibonacci.py">Benchmark source</a> · <a href="/data/benchmarks.json">Download all measurements</a>
  </main>;
}
