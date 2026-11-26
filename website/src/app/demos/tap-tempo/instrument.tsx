"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./tempo.module.css";

type Reading = { period: number; bpm: number; intervals: number[] };
const empty: Reading = { period: 0, bpm: 0, intervals: [] };

export default function Instrument({ program }: { program: string }) {
    const worker = useRef<Worker | null>(null);
    const sequence = useRef(0);
    const liveTaps = useRef<number[]>([]);
    const [ready, setReady] = useState(false);
    const [reading, setReading] = useState<Reading>(empty);
    const [mode, setMode] = useState<"idle" | "live" | "example">("idle");
    const [error, setError] = useState("");
    useEffect(() => {
        try {
            const job = new Worker("/demos/tempo-worker.mjs", { type: "module" });
            worker.current = job;
            job.onmessage = ({ data }) => {
                if (data.id !== sequence.current) return;
                if (data.error) { setError(data.error); setReading(empty); }
                else { setReading(data); setError(""); }
            };
            job.onerror = () => {
                setError("The Blyx worker could not start. Reload this page to try again.");
                setReady(false);
                setReading(empty);
            };
            setReady(true);
            return () => { worker.current = null; job.terminate(); };
        } catch {
            setError("This browser could not start a worker. You can still download and run the Blyx file.");
        }
    }, []);

    function run(source: string) {
        setError("");
        worker.current?.postMessage({ id: ++sequence.current, source });
    }
    function tap() {
        const time = Math.round(performance.now());
        liveTaps.current = [...liveTaps.current.slice(-5), time];
        setMode("live");
        const driver = "fn main() { report([" + liveTaps.current.join(", ") + "]); }";
        run(program.slice(0, program.lastIndexOf("fn main()")) + driver);
    }
    function example() {
        liveTaps.current = [];
        setMode("example");
        run(program);
    }
    function reset() {
        ++sequence.current;
        liveTaps.current = [];
        setMode("idle");
        setReading(empty);
        setError("");
    }
    const { intervals, bpm, period } = reading;
    const format = (value: number) => value.toLocaleString(undefined, { maximumFractionDigits: 1 });
    const ceiling = Math.max(1, ...intervals);
    return <section className={styles.panel} aria-label="Tap tempo instrument">
        <div className={styles.face}>
            <div className={styles.readout}>
                <p>{mode === "example" ? "Recorded example" : "Your tempo"}</p>
                <strong data-testid="bpm">{intervals.length ? format(bpm) : "—"}</strong> <span>BPM</span>
                <p role="status">{error || (intervals.length ? format(period) + " ms median interval" :
                    mode === "live" ? "Tap again to measure a beat." : "Ready for your first tap.")}</p>
            </div>
            <button type="button" className={styles.pad} disabled={!ready} onClick={tap}
                onKeyDown={e => { if (e.repeat) e.preventDefault(); }}>Tap beat</button>
        </div>
        <div className={styles.trace}>
            <h2>Recent intervals</h2>
            {intervals.length ? <ol aria-label="Intervals from oldest to newest">
                {intervals.map((ms, i) => <li key={i}>
                    <span>{i + 1}</span><i aria-hidden="true" style={{ width: (100 * ms / ceiling) + "%" }} />
                    <b>{format(ms)} ms</b>
                </li>)}
            </ol> : <p>Each pair of taps adds a bar here.</p>}
        </div>
        <div className={styles.controls}>
            <button className="button secondary" disabled={!ready} onClick={example}>Try a missed beat</button>
            <button className="button secondary" disabled={mode === "idle"} onClick={reset}>Reset</button>
        </div>
    </section>;
}
