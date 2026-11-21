import { guideLink, mainLink, repository } from "@/lib/site";
export default function Footer() {
    const groups = [
        [
            "Language",
            [
                ["Documentation", guideLink()],
                ["Learn", mainLink("/learn")],
                ["Examples", mainLink("/examples")],
                ["Playground", mainLink("/play")],
            ],
        ],
        [
            "Toolchain",
            [
                ["Download", mainLink("/download")],
                ["Compiler", mainLink("/compiler")],
                ["VS Code", mainLink("/vscode")],
                ["Ecosystem", mainLink("/packages")],
                ["Benchmarks", mainLink("/benchmarks")],
            ],
        ],
        [
            "Project",
            [
                ["About", mainLink("/about")],
                ["Community", mainLink("/community")],
                ["Release notes", mainLink("/blog")],
                ["Roadmap", mainLink("/roadmap")],
                ["Security", mainLink("/security")],
            ],
        ],
    ] as const;
    return (
        <footer className="footer">
            <div className="foot-inner">
                <div>
                    <a className="brand" href={mainLink("/")}>
                        Blyx
                    </a>
                    <p>The open-source Blyx programming language.</p>
                    <a href={repository}>Source on GitHub ↗</a>
                </div>
                {groups.map(([label, links]) => (
                    <div key={label}>
                        <h2>{label}</h2>
                        {links.map(([text, href]) => (
                            <a key={text} href={href}>
                                {text}
                            </a>
                        ))}
                    </div>
                ))}
            </div>
        </footer>
    );
}
