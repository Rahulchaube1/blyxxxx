import { condaSource } from "@/lib/source-channel";
import { pageMetadata } from "@/lib/metadata";
import StructuredData from "@/components/StructuredData";
import { notFound } from "next/navigation";
import catalog from "@/lib/packages.json";
import { directoryFor } from "@/lib/package-categories";
import { guideLink, nestRegistry, playLink, website } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
    return catalog.packages.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Props) {
    const { slug } = await params;
    const p = catalog.packages.find((item) => item.slug === slug);
    if (!p) return {};
    return {
        ...pageMetadata(
            p.title + " · Blyx " + p.category,
            p.description,
            website + "/packages/" + slug,
            { url: website + p.logo, alt: p.logoAlt ?? p.title + " package logo" },
        ),
        icons: { icon: p.logo },
    };
}

export default async function Package({ params }: Props) {
    const { slug } = await params;
    const p = catalog.packages.find((item) => item.slug === slug);
    if (!p) notFound();
    const directory = directoryFor(p.category);
    const packaged = condaSource(p);
    const clone = "git clone --depth 1 --branch v" + p.version + (slug === "modelgate" ? " --recurse-submodules" : "") + " " + p.repository + ".git vendor/" + slug;
    return (
        <main className="wrap">
            <StructuredData data={{
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                itemListElement: [
                    { "@type": "ListItem", position: 1, name: "Package catalog", item: website + "/packages" },
                    { "@type": "ListItem", position: 2, name: directory.title, item: website + directory.href },
                    { "@type": "ListItem", position: 3, name: p.title, item: website + "/packages/" + slug },
                ],
            }} />
            <header className="page-head">
                <nav className="crumb package-crumb" aria-label="Breadcrumb">
                    <a href="/packages">Package catalog</a><span aria-hidden="true">/</span>
                    <a href={directory.href}>{directory.title}</a><span aria-hidden="true">/</span>
                    <span aria-current="page">{p.title}</span>
                </nav>
                <div className="package-heading package-title">
                    <img className="package-logo" src={p.logo} alt={p.logoAlt ?? ""} width="88" height="88" />
                    <div><h1>{p.title}</h1><span>{p.kind} · {p.version}</span></div>
                </div>
                <p>{p.description}</p>
                <div className="actions">
                    {packaged && <a href={nestRegistry + "/packages/" + slug + ".html"}>Install from Blyx Nest</a>}
                    {packaged && <a href="#conda">Install with Conda</a>}
                    {p.editor && <a className="button" href="#editor">Install in your editor</a>}
                    {p.projects && <a href="#projects">Try the projects</a>}
                    {p.trainedExample && <a href={playLink(p.trainedExample)}>Run the trained XOR network →</a>}
                    <a className={p.trainedExample ? undefined : "button"} href={playLink(p.example)}>{p.workflow?.browserTitle ?? (p.trainedExample ? "Differentiate a loss" : "Run the Blyx example →")}</a>
                    <a href={p.release}>Release on GitHub</a>
                    <a href={p.logo} download={p.slug + ".png"}>Download logo (PNG)</a>
                </div>
            </header>
            <article className="prose">
                {p.workflow && (
                    <section id="project">
                        <h2>{p.workflow.title}</h2>
                        <p>{p.workflow.description}</p>
                        <h3>{p.collection ? "Run the native CLI" : "Download the standalone example"}</h3>
                        {p.collection ? (
                            <p>Extract the workflow collection for your platform. Run <code>{".\\bin\\" + slug + ".exe --help"}</code> in PowerShell or <code>{"./bin/" + slug + " --help"}</code> on Linux and macOS. Running the command with no arguments prints the worked example.</p>
                        ) : (
                            <p>Extract the archive and run <code>{p.slug + "-demo.exe"}</code> on Windows or <code>{"./" + p.slug + "-demo"}</code> on Linux and macOS. Each archive includes the Blyx source and tests.</p>
                        )}
                        <div className="actions">
                            {p.workflow.downloads.map((download) => <a href={download.url} key={download.platform}>{download.platform}</a>)}
                            <a href={p.workflow.checksums}>SHA-256 checksums</a>
                        </div>
                        <h3>Build from source</h3>
                        <p>With Blyx {catalog.compiler}, Rust and a host linker installed, run these commands to edit and rebuild the example.</p>
                        <pre>{p.workflow.command}</pre>
                        <div className="actions">
                            <a href={p.workflow.source}>Read the project source</a>
                            {p.workflow.preview && <a href={p.workflow.preview}>Open the generated {p.slug === "bunting" ? "HTML report" : "SVG layout"}</a>}
                            <a href={guideLink(p.guide)}>Work through the handbook exercise</a>
                        </div>
                        <h3>Why this framework exists</h3>
                        <p>{p.workflow.problem} <a href={p.workflow.reference.url}>{p.workflow.reference.title}</a></p>
                    </section>
                )}
                {p.editor && (
                    <section id="editor">
                        <h2>Install {p.title} in your editor</h2>
                        <p>Extension <strong>{p.editor.id}</strong> · {p.editor.version}</p>
                        {slug === "blyxtorch"
                            ? <p>The extension includes the native CPU trainer for Windows x64, Linux x64 and Apple Silicon macOS, plus two editable training projects.</p>
                            : <p>The extension includes a runnable Blyx example, function completions and the framework source. For the modular project, extract the starter, open its folder and run <code>blyxc native-run main.blyx</code> with the native toolchain installed.</p>}
                        <div className="actions">
                            {p.editor.marketplace && <a className="button" href={p.editor.marketplace}>Visual Studio Marketplace</a>}
                            {p.editor.openVsx && <a href={p.editor.openVsx}>Open VSX</a>}
                            <a href={p.editor.vsix}>Download the VSIX</a>
                            {slug !== "blyxtorch" && <a href={p.editor.starter}>Download the starter ZIP</a>}
                        </div>
                        <p>Create an empty <code>.blyx</code> file, type <code>{p.editor.examplePrefix}</code> and accept the completion. Choose <strong>Blyx: Run File</strong> to run the example.</p>
                        <p>For an offline installation, choose <strong>Extensions: Install from VSIX</strong> for Blyx Language first, then for {p.title}.</p>
                        <a href="https://github.com/Rahulchaube1/blyxxxx/releases/download/editor-v1.2.3/blyx-language-1.2.3.vsix">Download the companion Blyx Language VSIX</a>
                    </section>
                )}
                {p.collection && (
                    <section>
                        <h2>{p.collection.libraries.length ? "Libraries in this framework" : "Framework using this library"}</h2>
                        <div className="actions">
                            {p.collection.libraries.length
                                ? p.collection.libraries.map((lib) => <a key={lib.slug} href={"/packages/" + lib.slug}>{lib.title}</a>)
                                : <a href={"/packages/" + p.collection.family}>{p.collection.familyTitle}</a>}
                            <a href="/downloads/blyx-ecosystem-source.zip" download>Download the source collection</a>
                        </div>
                    </section>
                )}
                {p.projects && p.editor && (
                    <section id="projects">
                        <h2>Build a project with BlyxTorch</h2>
                        {p.projects.map((project) => (
                            <div key={project.id}>
                                <h3>{project.title}</h3>
                                <p>{project.description}</p>
                                <div className="actions">
                                    <a href={playLink(project.id)} aria-label={project.title + " – run in the playground"}>Run in the playground →</a>
                                    <a href={project.source} aria-label={project.title + " – read the Blyx source"}>Read the Blyx source</a>
                                </div>
                            </div>
                        ))}
                        <p>The starter includes the editable programs, CSV data, saved weights and three editor tasks. Extract it, open <code>BlyxTorch.code-workspace</code>, then choose <strong>Terminal → Run Task → BlyxTorch: Evaluate print queue</strong>.</p>
                        <a className="button" href={p.editor.starter}>Download both projects</a>
                    </section>
                )}
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
                {packaged && (
                    <section id="conda">
                        <h2>Install with Conda</h2>
                        <p>Create an environment containing {p.title} {packaged.version}, its Blyx source and a runnable example.
                            Run the second command with Blyx {catalog.compiler}, Rust and a host linker installed.</p>
                        <pre>{'conda create -y --prefix ./blyx-env --override-channels -c ' + packaged.channel + ' ' + packaged.name + '=' + packaged.version + '=' + packaged.build
                            + '\nblyxc native-run ./blyx-env/share/blyx/' + slug + '/main.blyx'}</pre>
                        <p>To use this package in your application, copy <code>{'share/blyx/' + slug + '/vendor/' + slug}</code> from the environment into your project's <code>vendor</code> directory.</p>
                        <a href="/packages#install">Install the full collection with Homebrew or Scoop</a>
                    </section>
                )}
                <section id="import">
                    <h2>Import into a Blyx project</h2>
                    <p>Install Blyx {catalog.compiler}, Rust 1.85 or newer and a host linker. From the directory containing your entry file, clone this tagged release.</p>
                    <pre>{clone}</pre>
                    {p.collection && <p>You can also <a href={p.repository + "/archive/refs/tags/v" + p.version + ".zip"}>download {p.title} as a ZIP</a>. Extract its contents into <code>{"vendor/" + slug}</code>.</p>}
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
                        {(slug === "warbler" || slug === "robin") && <a href="/benchmarks#workflows">Measured performance</a>}
                    </div>
                </section>
            </article>
        </main>
    );
}
