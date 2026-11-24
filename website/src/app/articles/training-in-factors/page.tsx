import StructuredData from "@/components/StructuredData";
import { pageMetadata } from "@/lib/metadata";
import { website } from "@/lib/site";
import styles from "../articles.module.css";

const path = "/articles/training-in-factors";
const title = "A matrix with 2.2 trillion coefficients";
const description = "How four feature pairs make a large matrix trainable on a CPU, what happens when a checkpoint crosses a shard, and how to test a quantum circuit gradient.";
const repository = "https://github.com/Rahulchaube1/";
const art = path + "/";
const meta = pageMetadata(title, description, website + path, {url: website + art + "factor-storage.png", alt: "Matrix storage compared with paired feature storage"});
export const metadata = {...meta, openGraph: {...meta.openGraph, type: "article" as const, publishedTime: "2026-11-24", authors: ["Rahul Chaube"]}};

const releases = [
    ["LinearFit", "blyx-linearfit", "0.2.0", "Train a bilinear regressor and query a weight."],
    ["BlyxTorch", "blyxtorch", "0.5.0", "Train an Ry/CNOT circuit and export it as OpenQASM 3."],
    ["Albatross", "blyx-albatross", "0.2.0", "Calculate the bytes of model state on each worker."],
    ["Kinglet", "blyx-kinglet", "0.2.0", "Read the pieces of a tensor slice from its shards."],
    ["Chaffinch", "blyx-chaffinch", "0.2.0", "Combine two workers’ sparse gradient sums."],
];

function Figure({file, alt, children}: {file: string; alt: string; children: React.ReactNode}) {
    return <figure className={styles.figure}><img src={art + file} alt={alt} /><figcaption>{children}</figcaption></figure>;
}

export default function TrainingInFactors() {
    return <main className="wrap"><article className={styles.body}>
        <StructuredData data={{"@context":"https://schema.org","@type":"TechArticle",headline:title,description,datePublished:"2026-11-24",
            mainEntityOfPage:website+path,image:[website+art+"factor-storage.png",website+art+"circuit-gradient.png"],
            author:{"@type":"Person",name:"Rahul Chaube",url:"https://github.com/Rahulchaube1"}}} />
        <a href="/articles">← Engineering articles</a>
        <header><h1>{title}</h1>
            <p className={styles.dek}>Four pairs of feature vectors let us train a regression whose full weight matrix would occupy 16 TiB. Here is what the laptop actually stored, what it learned, and how we checked the answer.</p>
            <p className={styles.byline}>Rahul Chaube · <time dateTime="2026-11-24">24 November 2026</time></p>
        </header>
        <nav className={styles.contents} aria-label="Article sections">
            <a href="#matrix">Matrix experiment</a><a href="#workers">Training infrastructure</a><a href="#circuit">Circuit gradients</a><a href="#reproduce">Reproduce the results</a>
        </nav>
        <section id="matrix"><h2>One update explains the storage bill</h2>
            <p>Suppose each observation describes a pair, such as a document and a query. Let <i>x</i> describe the document, <i>z</i> the query, and <i>y</i> the score we want to predict. A bilinear regressor predicts <i>x</i>ᵀ<i>Wz</i>. An entry of <i>W</i> describes how one document feature interacts with one query feature. With 2,097,152 features on one side and 1,048,576 on the other, that gives 2,199,023,255,552 entries.</p>
            <p>For squared error, each SGD step adds a multiple of the outer product <i>xz</i>ᵀ to the matrix. Start at zero and visit four training pairs in any fixed order. After any number of steps, the entire matrix is a weighted sum of those same four outer products. Store their feature vectors and four weights, and any entry can be reconstructed on demand.</p>
            <p>LinearFit first builds a four-by-four Gram matrix. Entry <i>ij</i> multiplies the dot product of the two left vectors by the dot product of the two right vectors. That product is the inner product of the two outer products. During training, a dot product against one Gram row gives a prediction, and one expansion coefficient changes. At inference, a new pair only needs dot products against the stored factors. Pairwise kernels use the same product structure. <a href="https://arxiv.org/abs/2009.01054">Generalized vec trick for fast learning of pairwise kernel models</a></p>
            <Figure file="factor-storage.png" alt="At the largest width, four pairs of FP64 input vectors occupy 96 MiB. A full FP64 matrix would occupy 16 TiB.">The green series counts the bytes of the input vectors used in each run. The orange series is eight times the number of matrix entries. The 16 Gram entries and four learned doubles add 160 bytes. These counts exclude allocator overhead and temporary buffers.</Figure>
            <p>We chose four deterministic, signed feature patterns with targets 1, −0.5, 0.75 and 0.25. Twelve passes made 48 updates. The training half mean squared error fell from 0.234375 to 1.397 × 10⁻⁸. The last matrix entry changed from zero to 1.43016 × 10⁻⁶. At the largest width, the complete process took a median of 155.84 ms across seven launches, including constructing 96 MiB of factors, building the Gram matrix and printing the result.</p>
            <p>The number of adjustable coefficients in this fixture is four. The matrix rank is at most four. A general dense language model has many independently adjustable weights and a different training workload. Increasing the number of example pairs also has a cost here. For <i>n</i> pairs the Gram matrix contains <i>n</i>² entries. The method is a good fit when the number of pairs is small compared with the product of the feature widths.</p>
            <h3>Checking the training rule independently</h3>
            <p>On a separate fixture, NumPy explicitly updated every entry of a 5 × 7 matrix after each of nine random pairs for four epochs. The largest final difference across all 35 entries was 2.78 × 10⁻¹⁷. Twelve unseen pairs had a maximum prediction difference of 1.53 × 10⁻¹⁶. Saving after two epochs and resuming produced byte-identical coefficient output to four uninterrupted epochs. Three deterministic fixtures also matched explicit updates at every coordinate, up to a 256 × 128 matrix.</p>
        </section>
        <section id="workers"><h2>Three questions before a distributed run</h2>
            <h3>How much state lands on one worker?</h3>
            <p>Albatross divides weights, gradients and optimizer state according to the requested ZeRO stage, giving any remainder to the lowest numbered workers. Consider 2⁴¹ independently stored parameters at two bytes for each weight, two for each gradient and twelve for optimizer state. At stage 3 all three arrays are partitioned. With 512 workers, each worker’s share is exactly 64 GiB. If each device has 80 GiB and the job reserves 16 GiB for everything else, 512 is the smallest count that satisfies that arithmetic budget. <a href="https://arxiv.org/abs/1910.02054">ZeRO: Memory Optimizations Toward Training Trillion Parameter Models</a></p>
            <Figure file="worker-memory.png" alt="Calculated model-state payload falls from 256 GiB per worker at 128 workers to 16 GiB at 2,048. At 512 workers it is 64 GiB.">These are calculated payload sizes. Activation checkpoints, communication buffers, fragmentation and runtime memory depend on the model, the sequence length and the implementation. No cluster was provisioned for this calculation.</Figure>
            <h3>Which bytes restore the next tensor slice?</h3>
            <p>Kinglet accepts a tensor length, element width, shard size and a half-open slice. In the study, five two-byte elements straddled a shard boundary. The answer was four bytes at the end of shard 1023 and six at the beginning of shard 1024. The result contains inclusive byte endpoints suitable for an HTTP range request. A local test physically wrote shard files, reconstructed 32 random slices and compared each byte against the original file. The large-offset case checked address arithmetic independently of storage capacity. <a href="https://www.rfc-editor.org/rfc/rfc9110.html#section-14">HTTP range requests</a></p>
            <h3>What if one worker cancels another?</h3>
            <p>At one coordinate, suppose a worker contributes 10¹⁶ and 1, and a second worker contributes −10¹⁶. A naive floating-point sum can lose the 1. Chaffinch merges two sorted coordinate streams with compensated summation and divides by the global example count. With four examples the fixture returns 0.25. A second check compared 52 worker contributions against Python’s <code>math.fsum</code> at four coordinates, including 2⁴¹ − 1 and 2⁵³ − 1. All four means matched. This is a local reducer that can operate on worker outputs. Transport, scheduling and failure recovery belong to the distributed application.</p>
        </section>
        <section id="sparse"><h2>What changes when weights can vary independently?</h2>
            <p>We also trained a sparse embedding table with 549,755,813,888 rows and four independent weights per row. An unseen row starts at zero. Training examples reached 64 rows spread across the table, each with four different targets. For each row, two observations went to one worker stream and two to another. Chaffinch combined the streams and BlyxTorch applied the mean gradients. Both worker streams ran in one CPU process.</p>
            <p>After twelve rounds, 256 distinct weights had changed. Every updated weight matched its analytically predicted value within 10⁻¹⁴. To check prediction, we asked for a weighted combination of the four features that had never appeared in training, on each of the 64 trained rows. Mean squared error fell from 0.54294 to 3.24 × 10⁻⁸. A separate unseen row still returned four zeros. This experiment exercises independently trainable coordinates within a 2.2-trillion-weight address space. Its physical workload is the 256 weights the examples touched.</p>
            <p>Download the Blyx program and its verification script into one folder. Run <code>python check_sparse.py --compiler blyxc</code> with Git and the compiler revision in the framework guide. The script fetches the two pinned framework sources and checks both errors against an independent calculation. <a href={art+"sparse-training.blyx"} download>Training program in Blyx</a> · <a href={art+"check_sparse.py"} download>Verification script</a> · <a href={art+"sparse-measurements.json"}>Observed results</a></p>
        </section>
        <section id="circuit"><h2>Differentiate a quantum circuit on a CPU</h2>
            <p>BlyxTorch 0.5.0 starts a circuit in the all-zero state. Each layer applies a separately adjustable Y rotation to each qubit, then entangles neighbours with a CNOT chain. We measure the expectation of Z on one chosen qubit. The training command adjusts the angles to move that expectation toward a target. A two-qubit example started at 0.992398 and reached −0.24999977 after 40 updates toward −0.25.</p>
            <p>One way to get a derivative is to shift a rotation by +π/2 and −π/2, evaluate both circuits and halve the difference. An adjoint sweep instead propagates the measured observable backward through the simulated circuit, collecting every angle derivative. We checked the implementation against an independent dense rotation-matrix simulator using parameter shifts. The largest absolute difference across 116 derivatives was 1.33 × 10⁻¹⁵. <a href="https://arxiv.org/abs/1811.11184">Schuld et al., evaluating analytic gradients on quantum hardware</a> · <a href="https://arxiv.org/abs/2009.02823">Jones and Gacon, efficient calculation of gradients in simulated circuits</a></p>
            <Figure file="circuit-gradient.png" alt="Four gradients at ten qubits took a median of 14.12 ms with the adjoint method and 92.29 ms with parameter shifts on the same CPU.">Each dot is a fresh CPU process performing four gradient evaluations of a three-layer circuit. Horizontal marks show medians. Small-circuit results include a substantial process startup cost.</Figure>
            <div className={styles.data}><table><caption>Measured process time for four gradients</caption><thead><tr><th scope="col">Qubits</th><th scope="col">Angles</th><th scope="col">Adjoint</th><th scope="col">Parameter shift</th></tr></thead>
                <tbody>{[[4,12,"10.09 ms","14.19 ms"],[6,18,"10.03 ms","17.45 ms"],[8,24,"9.93 ms","30.40 ms"],[10,30,"14.12 ms","92.29 ms"]].map(row=><tr key={row[0]}><th scope="row">{row[0]}</th>{row.slice(1).map((cell,i)=><td key={i}>{cell}</td>)}</tr>)}</tbody></table></div>
            <p>The 6.54× timing ratio at ten qubits compares two differentiation algorithms on the same CPU. The simulator stores 2<sup>q</sup> real amplitudes per state and accepts up to 16 qubits. Its gate set is real-valued. Exporting a circuit produces OpenQASM 3 text for an external backend. We parsed exports at 1, 2, 5 and 16 qubits. Hardware execution, device noise, dense trillion-parameter LLM training and end-to-end multi-node throughput remain unmeasured. <a href="https://openqasm.com/versions/3.0/intro.html">OpenQASM 3 specification</a></p>
        </section>
        <section id="reproduce"><h2>Run the same checks</h2>
            <p>Download the native archive for your OS from each release below. Compare each archive with its release’s SHA256SUMS. Place the five framework executables and the two study executables in a directory called <code>bin</code>. LinearFit supplies <code>pair-study</code> and BlyxTorch supplies <code>quantum-study</code>. Windows filenames end in <code>.exe</code>.</p>
            <div className={styles.data}><table><caption>Frameworks used in the study</caption><thead><tr><th scope="col">Release</th><th scope="col">What to try</th></tr></thead><tbody>{releases.map(([name,repo,version,task])=><tr key={repo}><th scope="row"><a href={repository+repo+"/releases/tag/v"+version}>{name} {version}</a></th><td>{task}</td></tr>)}</tbody></table></div>
            <pre><code>{["./bin/pair-study factors 21","./bin/quantum-study adjoint 10 3 4","./bin/quantum-study shift 10 3 4","python -m pip install numpy==2.2.6","python reproduce.py --bin ./bin --out my-measurements.json"].join("\n")}</code></pre>
            <p>Our workstation ran Windows on an Intel Family 6 Model 154 processor, with Python 3.10.6 and NumPy 2.2.6 for the independent checks. The test driver records one warm-up and then times seven fresh processes per configuration. Seeds 712, 192 and 2889 control the random reference fixtures. Timing is machine-dependent. The measurement file contains all samples, reference errors and the training curve. To redraw the charts, put <code>figures.py</code> beside <code>measurements.json</code> and run it with Matplotlib installed.</p>
            <div className="actions"><a href={art+"measurements.json"}>Raw measurements (JSON)</a><a download href={art+"reproduce.py"}>Download the test driver</a><a download href={art+"figures.py"}>Download the figure source</a><a href="https://nest.blyx-lang.space/">Blyx Nest registry</a></div>
        </section>
    </article></main>;
}
