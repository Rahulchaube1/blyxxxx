"use client";

import { useState } from "react";
import type { DirectoryEntry } from "@/lib/package-directory";
import { useHydrated } from "@/lib/useHydrated";
import { guideLink, playLink } from "@/lib/site";

export default function PackageCatalog({ items, frameworks = false }: { items: DirectoryEntry[]; frameworks?: boolean }) {
    const ready = useHydrated();
    const [query, setQuery] = useState("");
    const [group, setGroup] = useState("");
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const groups = [...new Set(items.map((p) => p.group))];
    const matches = items.filter((p) => (!group || p.group === group) && terms.every((t) => p.search.includes(t)));
    const noun = frameworks ? "framework" : "package";
    return (
        <section aria-label="Package catalog">
            <div className="filters">
                <label>
                    Search {frameworks ? "frameworks" : "packages"}
                    <input type="search" value={query} disabled={!ready} onChange={(e) => setQuery(e.target.value)} placeholder="Try CSV, routing, layout, or training" />
                </label>
                <label>
                    Task
                    <select value={group} disabled={!ready} onChange={(e) => setGroup(e.target.value)}>
                        <option value="">All tasks</option>
                        {groups.map((name) => <option key={name}>{name}</option>)}
                    </select>
                </label>
                <span role="status">{matches.length} {noun}{matches.length === 1 ? "" : "s"}</span>
            </div>
            {groups.map((name) => {
                const packages = matches.filter((p) => p.group === name);
                if (!packages.length) return null;
                return (
                    <section className="package-group" key={name}>
                        <div className="section-head"><h2>{name}</h2></div>
                        <div className="grid package-grid">
                            {packages.map((p) => (
                                <article className="card package-card" key={p.slug}>
                                    <div className="package-heading">
                                        <img className="package-logo" src={p.logo} width="54" height="54" alt="" loading="lazy" decoding="async" />
                                        <div><h3><a href={"/packages/" + p.slug}>{p.title}</a></h3>
                                            <small>{p.kind} · {p.version}</small></div>
                                    </div>
                                    <p>{p.description}</p>
                                    <div className="actions">
                                        <a href={"/packages/" + p.slug}>Install and use →</a>
                                        <a href={playLink(p.example)}>Run example</a>
                                        {frameworks && <a href={guideLink(p.guide)}>Handbook</a>}
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>
                );
            })}
            {!matches.length && <p className="empty">No matching packages. <button onClick={() => { setQuery(""); setGroup(""); }}>Clear filters</button></p>}
        </section>
    );
}
