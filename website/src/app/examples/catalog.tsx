"use client";
import { useHydrated } from "@/lib/useHydrated";
import { useState } from "react";
import samples from "@/lib/samples.json";
import { playLink, repository } from "@/lib/site";
export default function Catalog() {
    const ready = useHydrated();
    const [query, setQuery] = useState(""),
        [category, setCategory] = useState("");
    const results = samples.filter(
        (s) =>
            (!category || category === s.category) &&
            [s.title, s.description, s.category, s.code]
                .join(" ")
                .toLowerCase()
                .includes(query.trim().toLowerCase()),
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
                <span role="status">{results.length} examples</span>
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
                                Source Ã¢â€ â€”
                            </a>
                        </div>
                    </article>
                ))}
            </div>
            {!results.length && (
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
