"use client";

import { useState } from "react";
import catalog from "@/lib/packages.json";
import { useHydrated } from "@/lib/useHydrated";
import { playLink } from "@/lib/site";

const groups = Array.from(new Set(catalog.packages.map((p) => p.group)));

export default function PackageCatalog() {
    const ready = useHydrated();
    const [query, setQuery] = useState("");
    const [group, setGroup] = useState("");
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const matches = catalog.packages.filter((p) => {
        const text = [p.title, p.kind, p.group, p.description, p.contract, ...p.api.flat()].join(" ").toLowerCase();
        return (!group || p.group === group) && terms.every((t) => text.includes(t));
    });
    return (
        <section aria-label="Package catalog">
            <div className="filters">
                <label>
                    Search packages
                    <input type="search" value={query} disabled={!ready} onChange={(e) => setQuery(e.target.value)} placeholder="Try CSV, routing, layout, or training" />
                </label>
                <label>
                    Task
                    <select value={group} disabled={!ready} onChange={(e) => setGroup(e.target.value)}>
                        <option value="">All tasks</option>
                        {groups.map((name) => <option key={name}>{name}</option>)}
                    </select>
                </label>
                <span role="status">{matches.length} {matches.length === 1 ? "package" : "packages"}</span>
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
                                        <img className="package-logo" src={p.logo} width="54" height="54" alt="" />
                                        <div><h3><a href={"/packages/" + p.slug}>{p.title}</a></h3>
                                            <small>{p.kind} · {p.version}</small></div>
                                    </div>
                                    <p>{p.description}</p>
                                    <div className="actions">
                                        <a href={"/packages/" + p.slug}>Install and use →</a>
                                        <a href={playLink(p.example)}>Run example</a>
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
