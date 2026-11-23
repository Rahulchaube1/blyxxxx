import { bookEdition, buyMeACoffee, githubSponsors, guideLink, mainLink, nestRegistry, repository } from "@/lib/site";
export default function Footer() {
    const groups = [
        [
            "Language",
            [
                ["Documentation", bookEdition ? guideLink() : "/docs"],
                ["Blyx for beginners", mainLink("/learn")],
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
                ["Package catalog", mainLink("/packages")],
                ["Blyx Nest registry", nestRegistry + "/"],
                ["Frameworks", mainLink("/frameworks")],
                ["Libraries", mainLink("/libraries")],
                ["Benchmarks", mainLink("/benchmarks")],
            ],
        ],
        [
            "Project",
            [
                ["About", mainLink("/about")],
                ["Community", mainLink("/community")],
                ["Engineering articles", mainLink("/articles")],
                ["Release notes", mainLink("/blog")],
                ["Roadmap", mainLink("/roadmap")],
                ["Security", mainLink("/security")],
            ],
        ],
        [
            "Support Blyx",
            [
                ["Buy Me a Coffee", buyMeACoffee],
                ["GitHub Sponsors", githubSponsors],
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
