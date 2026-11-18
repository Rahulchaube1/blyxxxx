"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import samples from "@/lib/samples.json";
import "./play.css";

type Result = { status: number; output: string; diagnostics: { line?: number; column?: number; message: string }[] };

export default function Playground() {
  const [source, setSource] = useState(samples[0].code);
  const [example, setExample] = useState(samples[0].title);
  const [live, setLive] = useState(true);
  const [status, setStatus] = useState("Ready");
  const [output, setOutput] = useState("");
  const worker = useRef<Worker | null>(null);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stop = useCallback(() => {
    worker.current?.terminate();
    worker.current = null;
    if (timeout.current) clearTimeout(timeout.current);
  }, []);
  const run = useCallback(() => {
    stop();
    setStatus("Running");
    setOutput("");
    const task = new Worker("/runtime/worker.mjs", { type: "module" });
    worker.current = task;
    const finish = (label: string, text: string) => {
      if (worker.current !== task) return;
      stop();
      setStatus(label);
      setOutput(text);
    };
    task.onmessage = ({ data }: MessageEvent<Result>) => {
      const errors = data.diagnostics.map(d => (d.line ? d.line + ":" + d.column + "  " : "") + d.message);
      finish(data.status === 0 ? "Finished" : "Error", [data.output, ...errors].filter(Boolean).join("\n"));
    };
    task.onerror = event => finish("Error", event.message || "The runtime worker could not start.");
    timeout.current = setTimeout(() => finish("Stopped", "Execution exceeded 8 seconds."), 8000);
    task.postMessage({ source });
  }, [source, stop]);

  useEffect(() => {
    if (live) {
      const debounce = setTimeout(run, 350);
      return () => { clearTimeout(debounce); stop(); };
    }
    return stop;
  }, [live, run, stop]);

  return <main className="play">
    <header><h1>Blyx playground</h1><p>Edit a program and run it in your browser.</p></header>
    <div className="play-toolbar">
      <select aria-label="Example" value={example} onChange={e => {
        const sample = samples.find(x => x.title === e.target.value);
        if (sample) { setExample(sample.title); setSource(sample.code); setOutput(""); setStatus("Ready"); }
      }}>{example === "" && <option value="">Custom program</option>}{samples.map(x => <option key={x.title}>{x.title}</option>)}</select>
      <label><input type="checkbox" checked={live} onChange={e => { setLive(e.target.checked); setStatus("Ready"); }} /> Run on edit</label>
      <button onClick={run}>Run program</button>
    </div>
    <div className="play-panes">
      <section><h2><label htmlFor="source">main.blyx</label></h2><textarea id="source" spellCheck={false} value={source} onChange={e => { setSource(e.target.value); setExample(""); setStatus("Edited"); }} /></section>
      <section><h2>Output <span role="status">{status}</span></h2><pre aria-label="Program output">{output}</pre></section>
    </div>
  </main>;
}
