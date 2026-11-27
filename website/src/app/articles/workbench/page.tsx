import { pageMetadata } from "@/lib/metadata";
import { website } from "@/lib/site";
import styles from "../articles.module.css";

export const metadata = pageMetadata("Blyx Workbench workflows and libraries", "Replay a stale editorial approval and divide an installment payment in Blyx. Explore the design and tests behind 200 packages.", website + "/articles/workbench");

const source = "https://github.com/Rahulchaube1/blyx-workbench";
const nest = "https://nest.blyx-lang.space/packages/";
export default function Workbench() {
    return <main className="wrap"><article className={styles.body}>
        <a href="/articles">← Engineering articles</a>
        <header><p className={styles.byline}>Rahul Chaube · Blyx Workbench 0.1.0</p>
            <h1>What happens when an approval arrives late?</h1>
            <p className={styles.dek}>An editor opens revision 3. The author saves revision 4. A minute later the editor clicks Approve. Which text gets published?</p></header>
        <p>The answer depends on which revision the approval names. Edition Review records the revision under review and checks each incoming event against it. You can run that decision locally with the Blyx compiler and inspect every command it issues.</p>
        <h2>Replay the handoff</h2>
        <p>Install the Nest client and Blyx 0.2.2, then create a standalone example. Running the example without arguments plays a five-event history, including the late approval. <a href="/download">Get Blyx</a> · <a href="https://nest.blyx-lang.space/install.html">Get Nest</a></p>
        <pre><code>{`nest demo edition_review@0.1.0
cd edition_review-demo
blyxc native-run main.blyx`}</code></pre>
        <table><thead><tr><th>Event</th><th>Command returned by Blyx</th></tr></thead>
            <tbody>{[["submit 3","request_review"],["revise 4","replace_draft"],["approve 3","reject"],["approve 4","queue_publication"],["publish 4","announce"]].map(([event,command])=><tr key={event}><td><code>{event}</code></td><td><code>{command}</code></td></tr>)}</tbody></table>
        <p>The third event leaves revision 4 available for review. An application can record that rejection and continue. The command-line runner also supports fail-fast replay. Give it the sequence below and it exits with code 1 at the outdated approval.</p>
        <pre><code>blyxc native-run main.blyx -- submit 3 revise 4 approve 3</code></pre>
        <p>In a publishing service, the host persists the new state and arranges the action named by the returned command. If two editors act concurrently, the host must serialize those updates or use a conditional write. Recording a command and its state change together lets a delivery worker retry after a crash. <a href={nest+"edition_review.html"}>Edition Review package</a></p>
        <h2>When the whole job is a function</h2>
        <p>A shop needs to collect 100 minor currency units over three installments. Rounding every installment down collects only 99. Installment Piece divides the amount in integers and distributes the remainder to the earliest installments. Positions start at zero.</p>
        <pre><code>{`use vendor::installment_piece::installment_piece;

fn main() {
    println!(installment_piece(100, 3, 0));
    println!(installment_piece(100, 3, 1));
    println!(installment_piece(100, 3, 2));
}`}</code></pre>
        <p>The program prints 34, 33 and 33. Use <code>nest add installment_piece@0.1.0</code> in the project before compiling. The package guide gives the accepted ranges and the response for an invalid installment index. <a href={nest+"installment_piece.html"}>Installment Piece package</a></p>
        <h2>What informed the other packages?</h2>
        <p>Framework documentation from other ecosystems describes failure modes a developer can recognize. Celery documents message redelivery. SQLAlchemy distinguishes a nested savepoint from its enclosing transaction. GeoPandas explains how interpreting coordinates depends on their reference system. Each suggests a concrete question for Blyx code. Can we replay delivery safely? Can the outer batch commit yet? Has the requested coordinate transform completed? <a href={source+"/blob/v0.1.0/RESEARCH.md"}>Read the primary sources and design decisions</a></p>
        <p>Workbench includes 100 workflow frameworks for publishing, commerce, data systems, reliability, media, scientific acquisition, machine learning, document production, logistics and interactive clients. Each has an event vocabulary, a replay API and a CLI. The 100 libraries cover problems such as decoding signed audio samples, locating ties in a sorted sequence and integrating equally spaced observations. Applications can install each package separately. <a href="/frameworks">Framework directory</a> · <a href="/libraries">Library directory</a></p>
        <h2>A bird for each framework</h2>
        <p>Edition Review uses a king eider with an orange bill shield. Embargo Clock uses a rhinoceros hornbill with a curved casque. The framework gallery identifies all 100 birds by name and links each icon to its package. <a href="/frameworks/logos">Explore the illustrated framework directory</a></p>
        <h2>Install one package</h2>
        <p>For a standalone project, choose “Download Blyx project” in either directory, extract the ZIP and run <code>blyxc native-run main.blyx</code> from the extracted directory. Each download includes its own source, checks and expected output. Choose “Install from VSIX” in your editor to add that package’s snippets. <a href="/workbench/downloads/edition_review-0.1.2.zip">Download the Edition Review project</a> · <a href="/workbench/downloads/blyx-edition-review-0.1.2.vsix">Download Edition Review for your editor</a> · <a href="/workbench/downloads/SHA256SUMS.txt">Verify a download</a></p>
        <p>The framework and library directories link each individually released project to its own GitHub repository. Its Releases page includes a tagged source archive and an editor download with completion snippets for its public Blyx functions. Nest installs just the version you ask for. <a href="/frameworks">Find a framework</a> · <a href="/libraries">Find a library</a></p>
        <h2>How to reproduce a result</h2>
        <p>The release checks stage the same vendor directory that a Nest project uses. They compile the examples and tests, compare exact output, and exercise each framework CLI with an accepted sequence, a rejected event and malformed arguments. An additional 704 reference cases cover 22 libraries. Those fixtures use independently calculated expected values and are included as Blyx programs.</p>
        <pre><code>{`git clone --branch v0.1.0 https://github.com/Rahulchaube1/blyx-workbench
cd blyx-workbench
python tools/check.py --compiler blyxc --package edition_review`}</code></pre>
        <p>Omit the package option to run the complete suite. The release measures decision and calculation correctness on the supplied inputs. To assess an application that uses these packages, also test its storage, external services and workload. <a href={source+"/releases/tag/v0.1.0"}>Download the release and offline editor</a></p>
    </article></main>;
}
