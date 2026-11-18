"use client";
import { useHydrated } from "@/lib/useHydrated";
import { useState } from "react";
import guides from "@/lib/guides.json";
import { guideLink, docs } from "@/lib/site";
export default function GuideIndex() {
    const ready = useHydrated();
    const [query, setQuery] = useState("");
    const words = query.toLowerCase().trim().split(/\s+/);
    const results = guides.filter((g) => {
        const content = [
            g.title,
            g.summary,
            g.group,
            ...g.sections.map((s) => s.heading + " " + s.text),
        ]
            .join(" ")
            .toLowerCase();
        return words.every((w) => content.includes(w));
    });
    return (
        <main className="wrap">
            <header className="page-head">
                <div className="crumb">Blyx 0.2.0</div>
                <h1>Blyx documentation</h1>
                <p>
                    Learn the language from a running program, then take it from
                    your browser to a native executable.
                </p>
            </header>
            <div className="filters">
                <label>
                    Search documentation
                    <input
                        disabled={!ready}
                        type="search"
                        placeholder="Search the guide"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </label>
                <span role="status">{results.length} guides</span>
            </div>
            {Array.from(new Set(results.map((g) => g.group))).map((group) => (
                <section className="block" key={group}>
                    <div className="section-head">
                        <h2>{group}</h2>
                    </div>
                    <div className="grid">
                        {results
                            .filter((g) => g.group === group)
                            .map((g) => (
                                <a
                                    className="card card-link"
                                    key={g.slug}
                                    href={guideLink(g.slug)}
                                >
                                    <h3>{g.title}</h3>
                                    <p>{g.summary}</p>
                                    <span>Read guide â†’</span>
                                </a>
                            ))}
                    </div>
                </section>
            ))}
            {!results.length && (
                <p className="empty">
                    No guides match this search.{" "}
                    <button onClick={() => setQuery("")}>Clear search</button>
                </p>
            )}
            <p className="block">
                <a href={docs + "/guide/print"}>Printable guide â†’</a>
            </p>
        </main>
    );
}
