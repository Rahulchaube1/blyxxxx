"use client";
import { useState } from "react";
import { useHydrated } from "@/lib/useHydrated";
import { guides, stages } from "@/lib/handbook";
import { guideLink } from "@/lib/site";

const entries = guides.map((guide) => ({
    guide,
    search: [
        guide.title,
        guide.group,
        guide.summary,
        guide.exercise.prompt,
        ...guide.sections.flatMap((s) => [
            s.heading,
            s.text,
            s.command,
            ...(s.table?.rows.flat() ?? []),
        ]),
    ]
        .join(" ")
        .toLowerCase(),
}));

const beginnerChapters = new Set([
    "first-program", "arithmetic", "text-output", "bindings", "decisions", "functions",
    "control-flow", "vectors", "testing", "sensor-report",
]);

export default function GuideIndex({ course = false, children }: { course?: boolean; children?: React.ReactNode }) {
    const ready = useHydrated();
    const [query, setQuery] = useState("");
    const words = query.trim().toLowerCase().split(/\s+/);
    const results = entries.filter(({ guide, search }) =>
        course && !query.trim()
            ? beginnerChapters.has(guide.slug)
            : words.every((word) => search.includes(word)),
    );
    return (
        <main className="wrap">
            <header className="page-head">
                <div className="crumb">Blyx 0.2.1</div>
                <h1>{course ? "Blyx for beginners" : "Blyx documentation"}</h1>
                <p>
                    {course
                        ? "Start with ten lessons you can follow in your browser. By the last one, you will have written and tested a program that turns sensor readings into a report."
                        : "The Blyx handbook covers your first program, numerical computing, framework projects and native builds. Read in order or search for a function, command or worked example."}
                </p>
                <div className="actions">
                    <a className="button" href={guideLink("first-program")}>
                        Write your first program →
                    </a>
                    <a
                        className="button secondary"
                        href={guideLink("language-reference")}
                    >
                        Language reference
                    </a>
                </div>
            </header>
            {children}
            {course && <p className="course-handbook">Search all handbook chapters below or <a href={guideLink()}>browse the complete handbook</a>.</p>}
            <div className="filters">
                <label>
                    Search the handbook
                    <input
                        disabled={!ready}
                        type="search"
                        placeholder="Try recursion, dot, or --max-steps"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </label>
                <span role="status">
                    {results.length}{" "}
                    {results.length === 1 ? "chapter" : "chapters"}
                </span>
            </div>
            <div className="course-index">
                <nav className="course-sections" aria-label="Handbook sections">
                    {stages
                        .filter(([name]) =>
                            results.some(({ guide }) => guide.group === name),
                        )
                        .map(([name]) => (
                            <a
                                key={name}
                                href={
                                    "#" +
                                    name.toLowerCase().replaceAll(" ", "-")
                                }
                            >
                                {name}
                            </a>
                        ))}
                    <a href={guideLink("print")}>Printable handbook</a>
                    <a href="/llms-full.txt">Plain-text handbook</a>
                </nav>
                <div>
                    {stages.map(([name, description]) => {
                        const matches = results.filter(
                            ({ guide }) => guide.group === name,
                        );
                        if (!matches.length) return null;
                        return (
                            <section
                                className="course-stage"
                                key={name}
                                id={name.toLowerCase().replaceAll(" ", "-")}
                            >
                                <h2>{name}</h2>
                                <p>{description}</p>
                                <ul>
                                    {matches.map(({ guide }) => (
                                        <li key={guide.slug}>
                                            <a href={guideLink(guide.slug)}>
                                                <strong>{guide.title}</strong>
                                                <span>{guide.summary}</span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        );
                    })}
                    {!results.length && (
                        <p className="empty">
                            No chapters match this search.{" "}
                            <button onClick={() => setQuery("")}>
                                Clear search
                            </button>
                        </p>
                    )}
                </div>
            </div>
        </main>
    );
}
