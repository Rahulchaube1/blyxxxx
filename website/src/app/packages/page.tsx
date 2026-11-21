import { guideLink, playLink, repository, website } from "@/lib/site";

export const metadata = {
    title: "Blyx ecosystem",
    description: "Evaluate classifiers, forecast time series and score ranked search results with published Blyx packages.",
    alternates: { canonical: website + "/packages" },
};

const owner = "https://github.com/Rahulchaube1";
const libraries = [
    {
        name: "classification",
        title: "Classification",
        description: "Count true and false predictions at a threshold. Measure recall, precision and F1, then assign a different cost to each kind of mistake.",
    },
    {
        name: "calibration",
        title: "Calibration",
        description: "Compare forecast probabilities with observed outcomes. Compute the binary Brier score, inspect reliability bins and measure expected calibration error.",
    },
    {
        name: "retrieval",
        title: "Retrieval",
        description: "Score a search result or a RAG retriever against a set of relevant document IDs. Repeated hits occupy a rank and earn credit only once.",
    },
    {
        name: "backtest",
        title: "Forecast backtesting",
        description: "Evaluate forecasts in time order with a gap for delayed observations. Compare a model with last-value and training-mean baselines on the same test windows.",
    },
];

export default function Packages() {
    return (
        <main className="wrap">
            <header className="page-head">
                <h1>Blyx ecosystem</h1>
                <p>Use these Blyx libraries in your own programs or run ModelGate on predictions you already have.</p>
            </header>
            <section className="prose">
                <h2>Should you ship the new classifier?</h2>
                <p>In the ModelGate example, two models both get three out of four predictions right. The baseline raises a false alarm. The candidate misses a positive. When a miss costs five times as much, the cost per prediction rises from 0.25 to 1.25.</p>
                <p>Download ModelGate 0.1.1 and extract the archive. Run the included comparison to see both models’ metrics in JSON. It exits with code 1 so CI can stop the release.</p>
                <pre>{'./modelgate fixtures/regression.csv --fn-cost 5'}</pre>
                <p>In PowerShell, use <code>{'.\\modelgate.exe'}</code> as the command. On Apple Silicon macOS and x86-64 Linux, you can also install the command with <code>brew install rahulchaube1/blyx/modelgate</code> and run it against your own CSV.</p>
                <div className="actions">
                    <a className="button" href={owner + "/blyx-modelgate/releases/tag/v0.1.1"}>Download ModelGate</a>
                    <a className="button secondary" href={guideLink("ai-packages")}>Follow the evaluation guide →</a>
                    <a href="/benchmarks#modelgate">Performance measurements</a>
                </div>
            </section>
            <section className="block">
                <div className="section-head"><h2>Libraries and frameworks</h2></div>
                <div className="grid package-grid">
                    {libraries.map(({ name, title, description }) => (
                        <article className="card" key={name}>
                            <h3>{title}</h3>
                            <p>{description}</p>
                            <div className="actions">
                                <a href={playLink("package-" + name)}>Run example →</a>
                                <a href={owner + "/blyx-" + name + "/tree/v0.1.0"}>Source v0.1.0</a>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
            <section className="prose block">
                <h2>Import a library</h2>
                <p>From the directory containing your entry file, clone the library at the version you want. Blyx 0.2.1 resolves native imports relative to the importing file.</p>
                <pre>{'git clone --depth 1 --branch v0.1.0 https://github.com/Rahulchaube1/blyx-classification.git vendor/classification'}</pre>
                <p>Save this as <code>main.blyx</code>. One false alarm at a cost of 1 and one missed positive at a cost of 5 give a total cost of 6.</p>
                <pre>{'use vendor::classification::classification;\n\nfn main() {\n    println!(class_cost(1.0, 1.0, 1.0, 5.0));\n}'}</pre>
                <p>Run <code>blyxc native-run main.blyx</code> with Rust and a host linker installed. Browser examples include the library source in one editable file.</p>
                <div className="actions">
                    <a href={guideLink("projects")}>Start a project →</a>
                    <a href={repository + "/tree/blyx-main/tools/blyxpkg"}>Package manager prototype</a>
                </div>
            </section>
        </main>
    );
}
