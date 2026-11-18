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
                    <h2>Install with Homebrew</h2>
                    <p>
                        On Apple Silicon macOS or x86-64 Linux, Homebrew installs
                        the release binary and checks its SHA-256 checksum.
                    </p>
                    <pre>brew install rahulchaube1/blyx/blyx</pre>
                    <a href="https://github.com/Rahulchaube1/homebrew-blyx">Homebrew formula</a>
                </section>
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
                    <h2>Install with Cargo</h2>
                    <p>
                        With Rust and a host linker installed, Cargo can build
                        the compiler from its published source package.
                    </p>
                    <pre>cargo install --locked --version 0.2.0 blyxc</pre>
                    <div className="actions">
                        <a href="https://crates.io/crates/blyxc/0.2.0">Compiler on crates.io</a>
                        <a href={guideLink("installation")}>Installation guide →</a>
                    </div>
                </section>
            </div>
        </main>
    );
}
