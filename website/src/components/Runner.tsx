"use client";
import { useHydrated } from "@/lib/useHydrated";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import "../app/play/play.css";
type Result = {
    status: number;
    output: string;
    diagnostics: { line?: number; column?: number; message: string }[];
};
export default function Runner({
    code,
    filename,
    checkOnly = false,
}: {
    code: string;
    filename: string;
    checkOnly?: boolean;
}) {
    const ready = useHydrated();
    const id = useId();
    const [source, setSource] = useState(code),
        [live, setLive] = useState(true),
        [state, setState] = useState("Ready"),
        [output, setOutput] = useState("");
    const worker = useRef<Worker | null>(null),
        deadline = useRef<ReturnType<typeof setTimeout> | undefined>(undefined),
        debounce = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const cancel = useCallback(() => {
        clearTimeout(debounce.current);
        clearTimeout(deadline.current);
        worker.current?.terminate();
        worker.current = null;
    }, []);
    const run = useCallback(() => {
        cancel();
        setState("Running");
        setOutput("");
        let job: Worker;
        try {
            job = new Worker("/runtime/worker.mjs", { type: "module" });
        } catch {
            setState("Error");
            setOutput("Unable to start the Blyx worker.");
            return;
        }
        worker.current = job;
        function finish(label: string, text: string) {
            if (worker.current !== job) return;
            cancel();
            setState(label);
            setOutput(text);
        }
        job.onmessage = ({ data }: MessageEvent<Result>) => {
            const issues = data.diagnostics.map(
                (d) =>
                    (d.line ? d.line + ":" + d.column + "  " : "") + d.message,
            );
            finish(
                data.status === 0 ? "Finished" : "Error",
                [
                    checkOnly && data.status === 0 ? "Syntax OK" : data.output,
                    ...issues,
                ]
                    .filter(Boolean)
                    .join("\n"),
            );
        };
        job.onerror = (e) =>
            finish("Error", e.message || "Unable to load the Blyx runtime.");
        deadline.current = setTimeout(
            () => finish("Stopped", "Execution exceeded eight seconds."),
            8000,
        );
        job.postMessage({ source, run: !checkOnly });
    }, [source, cancel, checkOnly]);
    useEffect(() => {
        if (live) debounce.current = setTimeout(run, 300);
        return cancel;
    }, [live, run, cancel]);
    return (
        <div className="runner">
            <div className="run-toolbar">
                <label>
                    <input
                        disabled={!ready}
                        type="checkbox"
                        checked={live}
                        onChange={(e) => {
                            cancel();
                            setLive(e.target.checked);
                            setState("Ready");
                        }}
                    />{" "}
                    {checkOnly ? "Check on edit" : "Run on edit"}
                </label>
                <button
                    className="button secondary"
                    disabled={!ready || source === code}
                    onClick={() => {
                        cancel();
                        setSource(code);
                        setOutput("");
                        setState("Ready");
                    }}
                >
                    Reset example
                </button>
                {state === "Running" ? (
                    <button
                        className="primary"
                        onClick={() => {
                            cancel();
                            setState("Stopped");
                        }}
                    >
                        Stop
                    </button>
                ) : (
                    <button className="primary" onClick={run} disabled={!ready}>
                        {checkOnly ? "Check syntax" : "Run program"}
                    </button>
                )}
            </div>
            <div className="run-panes">
                <div>
                    <label className="pane-title" htmlFor={id}>
                        {filename.split("/").pop()}
                    </label>
                    <textarea
                        disabled={!ready}
                        id={id}
                        aria-label="Blyx source"
                        spellCheck={false}
                        value={source}
                        onChange={(e) => {
                            cancel();
                            setSource(e.target.value);
                            setState("Edited");
                            setOutput("");
                        }}
                    />
                </div>
                <div>
                    <div className="pane-title">
                        Output <span role="status">{state}</span>
                    </div>
                    <pre aria-label="Program output">{output}</pre>
                </div>
            </div>
        </div>
    );
}
