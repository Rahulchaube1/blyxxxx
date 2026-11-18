import { assets, guideLink, release } from "@/lib/site";
export const metadata = { title: "Download Blyx" };
const targets = [
    ["Windows", "x86-64", "x86_64-pc-windows-msvc.zip"],
    ["macOS", "Apple Silicon", "aarch64-apple-darwin.tar.gz"],
    ["Linux", "x86-64", "x86_64-unknown-linux-gnu.tar.gz"],
];
export default function Download() {
    return (
        <main className="wrap">
            <header className="page-head">
                <h1>Download Blyx</h1>
                <p>
                    Choose a Blyx 0.2.0 compiler for your machine. Each archive
                    contains the standalone blyxc CLI.
                </p>
            </header>
            <div className="grid">
                {targets.map(([os, arch, suffix]) => (
                    <article className="card" key={os}>
                        <h2>{os}</h2>
                        <p>{arch}</p>
                        <a
                            className="button"
                            href={assets + "blyx-v0.2.0-" + suffix}
                        >
                            Download for {os}
                        </a>
                    </article>
                ))}
            </div>
            <div className="prose block">
                <section>
                    <h2>Verify and run</h2>
                    <p>
                        Compare the archive’s SHA-256 hash with the release
                        checksums. Extract it, add the executable to PATH, and
                        check the version.
                    </p>
                    <pre>blyxc --version</pre>
                    <div className="actions">
                        <a href={assets + "SHA256SUMS"}>Release checksums</a>
                        <a href={release}>Release on GitHub</a>
                    </div>
                </section>
                <section>
                    <h2>Install from source</h2>
                    <p>
                        Use Cargo with a host linker to install the tagged
                        version. Native builds also require rustc.
                    </p>
                    <pre>
                        cargo install --locked --git
                        https://github.com/Rahulchaube1/blyxxxx --tag v0.2.0
                        blyxc
                    </pre>
                    <a href={guideLink("installation")}>Installation guide →</a>
                </section>
            </div>
        </main>
    );
}
