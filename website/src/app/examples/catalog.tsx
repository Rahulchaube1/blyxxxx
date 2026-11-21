"use client";
import { useHydrated } from "@/lib/useHydrated";
import { useEffect, useState } from "react";
import { playLink, repository } from "@/lib/site";
type ExampleSummary = { id: string; title: string; category: string; description: string; file: string };

export default function Catalog({ samples }: { samples: ExampleSummary[] }) {
    const ready = useHydrated();
    const [query, setQuery] = useState(""),
        [category, setCategory] = useState("");
    const [sources, setSources] = useState<Map<string, string>>();
    const [sourceError, setSourceError] = useState(false);
    const needle = query.trim().toLowerCase();
    const needsSources = Boolean(needle) && !sources;
    useEffect(() => {
        if (!needsSources) return;
        let active = true;
        setSourceError(false);
        import("@/lib/samples.json").then(({ default: entries }) => {
            if (active) setSources(new Map(entries.map((entry) => [entry.id, entry.code.toLowerCase()])));
        }).catch(() => { if (active) setSourceError(true); });
        return () => { active = false; };
    }, [needsSources]);
    const results = samples.filter(
        (s) =>
            (!category || category === s.category) &&
            [s.title, s.description, s.category, sources?.get(s.id) ?? ""]
                .join(" ")
                .toLowerCase()
                .includes(needle),
    );
    return (
        <>
            <div className="filters">
                <label>
                    Search examples
                    <input
                        disabled={!ready}
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Try vectors or Fibonacci"
                    />
                </label>
                <label>
                    Topic
                    <select
                        disabled={!ready}
                        aria-label="Topic"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">All topics</option>
                        {[...new Set(samples.map((s) => s.category))].map(
                            (x) => (
                                <option key={x}>{x}</option>
                            ),
                        )}
                    </select>
                </label>
                <span role="status">{results.length} {results.length === 1 ? "example" : "examples"}{needsSources && (sourceError ? " · Source search unavailable" : " · Searching source…")}</span>
            </div>
            <div className="grid">
                {results.map((s) => (
                    <article className="card" key={s.id}>
                        <div className="file-label">{s.category}</div>
                        <h2>{s.title}</h2>
                        <p>{s.description}</p>
                        <div className="actions">
                            <a className="button" href={playLink(s.id)}>
                                Open program
                            </a>
                            <a href={repository + "/blob/blyx-main/" + s.file}>
                                View source
                            </a>
                        </div>
                    </article>
                ))}
            </div>
            {!results.length && (!needsSources || sourceError) && (
                <div className="empty">
                    No matching examples.{" "}
                    <button
                        onClick={() => {
                            setCategory("");
                            setQuery("");
                        }}
                    >
                        Clear filters
                    </button>
                </div>
            )}
        </>
    );
}
