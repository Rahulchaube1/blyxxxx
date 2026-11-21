const docs = "https://doc.blyx-lang.space";
const site = "https://www.blyx-lang.space";

function block(body, language = "") {
    return ["```" + language, body.trimEnd(), "```"].join("\n");
}

export function handbookText(guides, samples, full) {
    const parts = [
        "# The Blyx handbook",
        "Blyx 0.2.1 · Released language and toolchain",
        "Start with a complete fn main(). Run your program in the playground or use blyxc check FILE followed by blyxc run FILE. For a native executable, use blyxc build FILE with Rust and a host linker installed.",
        "[Learn Blyx](" +
            site +
            "/learn) · [Playground](" +
            site +
            "/play) · [Executable subset](https://github.com/Rahulchaube1/blyxxxx/blob/blyx-main/docs/executable-subset.md) · [Full handbook](" +
            docs +
            "/llms-full.txt)",
        "The release supports synchronous functions, recursion, control flow and numeric vectors. Native projects can import Git-pinned Blyx packages and read files or command-line arguments. See the [ecosystem](https://www.blyx-lang.space/packages) for published libraries. GPU kernels, async tasks and a general tensor runtime are under development.",
    ];
    let group = "";
    for (const guide of guides) {
        if (group !== guide.group) {
            group = guide.group;
            parts.push("## " + group);
        }
        const url = docs + "/guide/" + guide.slug;
        parts.push(
            (full ? "### " : "- ") +
                "[" +
                guide.title +
                "](" +
                url +
                ")" +
                (full ? "\n\n" : " — ") +
                guide.summary,
        );
        if (!full) continue;
        for (const section of guide.sections) {
            parts.push("#### " + section.heading, section.text);
            if (section.command) parts.push(block(section.command));
            if (section.table) {
                const { columns, rows } = section.table;
                const line = (cells) =>
                    "| " +
                    cells
                        .map((cell) => cell.replaceAll("|", "\\|"))
                        .join(" | ") +
                    " |";
                parts.push(
                    [
                        line(columns),
                        line(columns.map(() => "---")),
                        ...rows.map(line),
                    ].join("\n"),
                );
            }
        }
        const sample = samples.find((s) => s.id === guide.example);
        if (sample)
            parts.push(
                "#### Worked program",
                block(sample.code, "blyx"),
                "Expected output",
                block(sample.expected),
            );
        const ex = guide.exercise;
        parts.push(
            "#### Practice",
            ex.prompt,
            "Hint",
            ex.hint,
            "Solution",
            ex.answer,
        );
        for (const [from, to] of ex.edits ?? [])
            parts.push(
                "Find",
                block(from, "blyx"),
                "Replace with",
                block(to, "blyx"),
            );
        if (ex.expected !== undefined)
            parts.push("Output after the change", block(ex.expected));
    }
    return parts.join("\n\n") + "\n";
}
