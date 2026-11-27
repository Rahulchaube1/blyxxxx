"use client";

import { useState } from "react";
import type { DirectoryEntry } from "@/lib/package-directory";
import { directoryFor, packageDirectories, type PackageCategory } from "@/lib/package-categories";
import { useHydrated } from "@/lib/useHydrated";
import { guideLink, playLink } from "@/lib/site";

export default function PackageCatalog({ items, category }: { items: DirectoryEntry[]; category?: PackageCategory }) {
    const ready = useHydrated();
    const [query, setQuery] = useState("");
    const [group, setGroup] = useState("");
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const groups = [...new Set(items.map((p) => p.group))];
    const matches = items.filter((p) => (!group || p.group === group) && terms.every((t) => p.search.includes(t)));
    const directory = category && directoryFor(category);
    const plural = directory?.title.toLowerCase() ?? "packages";
    const showResults = Boolean(category || terms.length || group);
    const sections = category
        ? groups.map((name) => ({ name, packages: matches.filter((p) => p.group === name) }))
        : packageDirectories.map((d) => ({ name: d.title, packages: matches.filter((p) => p.category === d.category) }));
    return (
        <section aria-label={directory?.title ?? "Search the ecosystem"}>
            <div className="filters">
                <label>
                    Search {plural}
                    <input type="search" value={query} disabled={!ready} onChange={(e) => setQuery(e.target.value)} placeholder={directory?.placeholder ?? "Search by name, task, or function"} />
                </label>
                <label>
                    Task
                    <select value={group} disabled={!ready} onChange={(e) => setGroup(e.target.value)}>
                        <option value="">All tasks</option>
                        {groups.map((name) => <option key={name}>{name}</option>)}
                    </select>
                </label>
                <span role="status">{matches.length} {matches.length === 1 ? (category ?? "package") : plural}</span>
            </div>
            {showResults && sections.map(({ name, packages }) => {
                if (!packages.length) return null;
                return (
                    <section className="package-group" aria-label={name} key={name}>
                        <div className="section-head"><h2>{name}</h2></div>
                        <div className="grid package-grid">
                            {packages.map((p) => (
                                <article className={p.flightdeck ? "card flightdeck-workflow" : p.workbench ? "card workbench-package" : "card package-card"} key={p.slug}>
                                    <div className="package-heading">
                                        <img className="package-logo" src={p.logo} width="72" height="72" alt="" loading="lazy" decoding="async" />
                                        <div><h3><a href={p.documentation}>{p.title}</a></h3>
                                            <small>{p.kind} · {p.version}</small></div>
                                    </div>
                                    <p>{p.description}</p>
                                    <div className="actions">
                                        <a href={p.documentation}>Install and use →</a>
                                        {p.workbench ? <a href={"https://github.com/Rahulchaube1/blyx-workbench/blob/v0.1.0/packages/" + p.slug + "/README.md"}>API guide</a> : p.flightdeck ? <a href={"https://nest.blyx-lang.space/packages/" + p.slug + ".html"}>Install from Nest</a> : <a href={playLink(p.example)}>Run example</a>}
                                        {p.category === "framework" && !p.workbench && <a href={p.flightdeck ? "/frameworks/flightdeck#editor" : "/packages/" + p.slug + "#editor"}>Install in editor</a>}
                                        {p.category === "framework" && !p.workbench && !p.flightdeck && <a href={guideLink(p.guide)}>Handbook</a>}
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>
                );
            })}
            {!matches.length && <p className="empty">No matching {plural}. <button onClick={() => { setQuery(""); setGroup(""); }}>Clear filters</button></p>}
        </section>
    );
}
