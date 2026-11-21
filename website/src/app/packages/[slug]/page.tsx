import { notFound } from "next/navigation";
import catalog from "@/lib/packages.json";
import { guideLink, playLink, website } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
    return catalog.packages.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Props) {
    const { slug } = await params;
    const p = catalog.packages.find((item) => item.slug === slug);
    return p ? { title: "Blyx " + p.title, description: p.description, alternates: { canonical: website + "/packages/" + slug } } : {};
}

export default async function Package({ params }: Props) {
    const { slug } = await params;
    const p = catalog.packages.find((item) => item.slug === slug);
    if (!p) notFound();
    const clone = "git clone --depth 1 --branch v" + p.version + (slug === "modelgate" ? " --recurse-submodules" : "") + " " + p.repository + ".git vendor/" + slug;
    return (
        <main className="wrap">
            <header className="page-head">
                <a className="crumb" href="/packages">← Blyx ecosystem</a>
                <div className="package-heading package-title">
                    <img className="package-logo" src={p.logo} alt="" width="88" height="88" />
                    <div><h1>{p.title}</h1><span>{p.kind} · {p.version}</span></div>
                </div>
                <p>{p.description}</p>
                <div className="actions">
                    {p.trainedExample && <a className="button" href={playLink(p.trainedExample)}>Run the trained XOR network →</a>}
                    <a className={p.trainedExample ? undefined : "button"} href={playLink(p.example)}>{p.trainedExample ? "Differentiate a loss" : "Run the Blyx example →"}</a>
                    <a href={p.release}>Release on GitHub</a>
                </div>
            </header>
            <article className="prose">
                {p.cli && (
                    <section>
                        <h2>Run the command-line tool</h2>
                        <p>Extract the archive for your machine and run the included CSV example. Use <code>{".\\" + slug + ".exe"}</code> in PowerShell. The input header is <code>{p.cli[1]}</code>.</p>
                        <pre>{"./" + slug + " " + p.cli[0]}</pre>
                        <p>{p.cli[2]}</p>
                        <div className="actions">
                            <a href={p.release}>Downloads and checksums</a>
                            <a href={"https://github.com/Rahulchaube1/homebrew-blyx/blob/main/Formula/" + slug + ".rb"}>Homebrew formula</a>
                        </div>
                        <pre>{"brew install rahulchaube1/blyx/" + slug}</pre>
                        <p>On Windows x64, add the Blyx Scoop bucket once, then install the tool from PowerShell.</p>
                        <pre>{"scoop bucket add blyx https://github.com/Rahulchaube1/scoop-blyx\nscoop install blyx/" + slug}</pre>
                        <a href={"https://github.com/Rahulchaube1/scoop-blyx/blob/main/bucket/" + slug + ".json"}>Scoop manifest</a>
                    </section>
                )}
                <section>
                    <h2>Import into a Blyx project</h2>
                    <p>Install Blyx {catalog.compiler}, Rust 1.85 or newer and a host linker. From the directory containing your entry file, clone this tagged release.</p>
                    <pre>{clone}</pre>
                    <p>Save this as <code>main.blyx</code> beside <code>vendor</code> and run <code>blyxc native-run main.blyx</code>.</p>
                    <pre>{p.program}</pre>
                    <p>Expected output</p><pre>{p.output.trimEnd()}</pre>
                </section>
                <section>
                    <h2>API and input requirements</h2>
                    <p>{p.contract}</p>
                    <div className="table-box"><table><thead><tr><th scope="col">API</th><th scope="col">Use</th></tr></thead>
                        <tbody>{p.api.map(([signature, details]) => <tr key={signature}><th scope="row"><code>{signature}</code></th><td>{details}</td></tr>)}</tbody>
                    </table></div>
                </section>
                <section>
                    <h2>Develop and contribute</h2>
                    <p>Open the tagged source to read the implementation and examples. Include the smallest reproducible Blyx program, compiler version and expected result when reporting an issue.</p>
                    <div className="actions">
                        <a href={p.repository + "/tree/" + p.commit}>Tagged source</a>
                        <a href={p.repository + "/actions"}>Build and test runs</a>
                        <a href={p.repository + "/issues"}>Package issues</a>
                        <a href={guideLink(p.guide)}>Handbook tutorial →</a>
                        {(slug === "linearfit" || slug === "modelgate" || slug === "blyxtorch") && <a href={"/benchmarks#" + slug}>Measured performance</a>}
                    </div>
                </section>
            </article>
        </main>
    );
}
