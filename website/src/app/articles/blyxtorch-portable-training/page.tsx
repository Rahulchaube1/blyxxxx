import StructuredData from "@/components/StructuredData";
import { pageMetadata } from "@/lib/metadata";
import { website } from "@/lib/site";
import styles from "../articles.module.css";

const path = "/articles/blyxtorch-portable-training";
const assets = "/articles/blyxtorch-040/";
const title = "One checkpoint, two processors";
const description = "A field test of BlyxTorch 0.4 on a laptop CPU and GPU. See the handwritten digits, building-load predictions, gradients and timings from a matched PyTorch comparison.";
const source = "https://github.com/Rahulchaube1/blyxtorch-verification";
const release = "https://github.com/Rahulchaube1/blyxtorch/releases/tag/v0.4.0";
const meta = pageMetadata(title + " · BlyxTorch 0.4", description, website + path, {url: website + assets + "digits.png", alt: "Held-out handwritten digits from the BlyxTorch experiment"});
export const metadata = {...meta, openGraph: {...meta.openGraph, type: "article" as const, publishedTime: "2026-11-23", authors: ["Rahul Chaube"]}};

function Figure({name, alt, caption}: {name: string; alt: string; caption: string}) {
    return <figure className={styles.figure}><img src={assets + name + ".png"} alt={alt} /><figcaption>{caption}</figcaption></figure>;
}

export default function PortableTraining() {
    return <main className="wrap"><article className={styles.body}>
        <StructuredData data={{"@context": "https://schema.org", "@type": "TechArticle",
            headline: title, description, datePublished: "2026-11-23", mainEntityOfPage: website + path,
            image: [website + assets + "digits.png", website + assets + "training.png"],
            author: {"@type": "Person", name: "Rahul Chaube", url: "https://github.com/Rahulchaube1"}}} />
        <a href="/articles">← Engineering articles</a>
        <header>
            <h1>{title}</h1>
            <p className={styles.dek}>We trained BlyxTorch on handwritten digits and simulated buildings, then timed the same weight update on a laptop CPU and GPU.</p>
            <p className={styles.byline}>Rahul Chaube · <time dateTime="2026-11-23">23 November 2026</time> · BlyxTorch 0.4.0</p>
        </header>
        <nav aria-label="Article contents" className={styles.contents}>
            <a href="#design">The training step</a><a href="#digits">Digits</a><a href="#energy">Building loads</a><a href="#timing">Speed</a><a href="#applications">Applications</a><a href="#reproduce">Reproduce</a>
        </nav>
        <section id="design">
            <h2>What has to travel with a model?</h2>
            <p>A developer who trains a ticket classifier on a workstation should be able to copy its weights to a laptop and make the same decision. Our starting point was deliberately small. Given a table of numerical features, fit a class label or a set of continuous targets, save the weights, and load them through a different execution path. Pixel intensities, sensor readings and fixed text embeddings can all enter through this interface.</p>
            <p>The checkpoint holds a format identifier, the input and output dimensions, a matrix of weights and a bias vector. It is small enough to inspect in a text editor. It does depend on an external agreement about the features. If column zero meant air temperature during training, sending humidity at prediction time still produces a perfectly ordinary number. Our experiments therefore preserve the column order, fit preprocessing only on training examples and record checksums of the resulting CSV files.</p>
            <p>The native Blyx trainer uses 64-bit floats. For a device, Blyx emits a StableHLO graph for the same forward pass, gradients and SGD update in 32-bit floats. An optional host reads a batch, puts it on the device and keeps the updated weights there until training ends. A final batch of seven rows receives an update averaged over seven rows. This matters when comparing two implementations over many epochs. <a href="https://openxla.org/stablehlo/spec">StableHLO operation definitions</a></p>
        </section>
        <section id="digits">
            <h2>A test you can read with your eyes</h2>
            <p>Each digit is an 8 × 8 grayscale image. We divided its 64 pixel values by 16 and trained a ten-class linear classifier from zero weights. The split kept class proportions approximately equal. It gave us 1,437 training images and 360 evaluation images. All three implementations saw the same examples in the same order for 12 epochs, with a batch size of 64 and a learning rate of 0.3.</p>
            <Figure name="digits" alt="First twelve held-out digit images, with the true class and Intel GPU prediction written above each" caption="The first twelve evaluation rows in their fixed split order. The number on the left is the dataset label and the number on the right is the GPU-trained model’s prediction." />
            <p>The native Blyx CPU model, the Intel GPU model and the PyTorch CPU model each classified <strong>332 of 360 digits correctly (92.22%)</strong>. A model predicting only the most frequent training class scored 10.00%. The linear classifier therefore learned useful structure, with 28 mistakes left to investigate. This is a sample-level split. Performance on handwriting from entirely new writers calls for a writer-separated evaluation. <a href="https://scikit-learn.org/stable/modules/generated/sklearn.datasets.load_digits.html">Digits dataset and provenance</a></p>
        </section>
        <section id="energy">
            <h2>Hold out a building shape</h2>
            <p>The UCI Energy Efficiency dataset asks a different question. Eight descriptors of a simulated building, including its geometry, orientation and glazing, predict heating and cooling load. Related designs share the same relative compactness. We reserved three whole compactness groups for testing so that a model could not encounter those shapes during training. That left 576 training and 192 evaluation rows.</p>
            <p>We standardized inputs with the training means and standard deviations and fit both targets together. After 30 epochs, all three implementations reached a pooled root mean squared error of <strong>1.8013 target units</strong>. Always predicting the two training means gave 11.0146. The GPU-trained model’s heating RMSE was 1.9840 and its cooling RMSE was 1.5978. Reporting both helps a developer spot a weak target that a single pooled score might hide.</p>
            <Figure name="energy" alt="Predicted versus reference heating and cooling loads for 192 held-out simulated designs with a diagonal for exact predictions" caption="Each panel shows 192 held-out predictions. The dashed diagonal marks perfect agreement. Simulated energy loads give a reproducible regression problem. Field deployment would need measurements from actual buildings." />
            <p>The data are by A. Tsanas and A. Xifara. The split, feature scaling and fit are available in the reproduction script. <a href="https://archive.ics.uci.edu/dataset/242/energy+efficiency">UCI Energy Efficiency dataset and license</a></p>
        </section>
        <section id="timing">
            <h2>When the CPU wins</h2>
            <p>We timed one manageable operation on an Intel Core i5-12450H laptop with Intel UHD Graphics. Each update used 128 rows, 64 features and ten classes. We fixed the input, labels and starting weights. Each timing sample performed 100 consecutive float32 SGD updates, then synchronized by reading back the weights and bias. Each engine ran two warm-up samples and seven measured samples. Model compilation, disk I/O and initial device transfers took place outside the clock.</p>
            <Figure name="training" alt="Median time for 100 SGD updates was 2.45 ms for compiled BlyxTorch CPU, 11.85 ms for eager PyTorch CPU and 79.86 ms for the Intel Vulkan GPU" caption="Median of seven runs. Both CPU routes used one thread. BlyxTorch used an IREE-compiled graph with explicit gradients. The PyTorch baseline used eager autograd. PyTorch compilation and PyTorch GPU training were outside this comparison." />
            <p>The compiled CPU path took 2.45 ms, eager PyTorch CPU took 11.85 ms and Vulkan took 79.86 ms. That is a <strong>4.83× CPU speedup for this particular update</strong>. A developer shipping this small head on similar hardware has a good reason to try the CPU first. A larger matrix, a dedicated GPU or a compiled PyTorch model changes the experiment. Timing just the call that submits GPU work would also have hidden the cost we measured here.</p>
            <h2>Why a sparse checkpoint took six seconds</h2>
            <p>A different delay appeared before any training began. Version 0.3 rebuilt a growing row buffer and scanned previously seen row IDs as it parsed each entry. In 0.4 the loader sizes its buffers first and indexes exact integer IDs while decoding. It still validates every row and rejects duplicates, including keys that land in the same initial hash slot. Existing checkpoints retain their layout and row order.</p>
            <Figure name="checkpoint" alt="Sparse checkpoint lookup time increases from 17 ms to 6,302 ms in 0.3 and from 10 ms to 128 ms in 0.4 as the number of stored rows grows" caption="One new process loads a shuffled text checkpoint, validates its contents, reads the last stored row and prints four values. Each point is the median of seven runs after two warm-ups. Both axes use logarithmic scales." />
            <p>At 16,384 stored rows the median fell from 6,302 ms to 128 ms, a <strong>49.15× improvement over BlyxTorch 0.3.0</strong>. At 512 rows it fell from 17.2 ms to 10.3 ms. These times include startup, text parsing and the final lookup. The checkpoint still has to fit in memory. Model training throughput is measured by the preceding experiment.</p>
        </section>
        <section id="applications">
            <h2>What a developer can build with it</h2>
            <p>For product search or support routing, compute a fixed embedding for each labelled example and fit a small local classification head. Keep the encoder version and preprocessing with the checkpoint. The bundled bridge exposes the local head as an OpenAI Responses function or an Anthropic client tool. An application selects the executable and checkpoint. The model supplies feature values and receives probabilities. Both tool-call formats were tested offline against the real local executable, including a 1,536-feature input. Hosted requests require a provider account. The weights updated by BlyxTorch are the local head’s weights. <a href="https://developers.openai.com/api/docs/guides/function-calling">OpenAI function calling</a> · <a href="https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview">Anthropic tool use</a></p>
            <p>For image or sequence work there are also independent forward and backward exports for strided and padded 2D convolution and causal or full multi-head attention. We compared 545 output and gradient values per backend with PyTorch autograd on two convolution configurations and two attention masks. The maximum absolute difference was 2.39 × 10⁻⁷ or less on IREE CPU, Intel Vulkan and OpenXLA CPU. These are operator checks. The digit experiment above used a linear head.</p>
            <h2>Choose what to hold out</h2>
            <p>A useful first experiment in another sector begins with a deployment question. These are candidate projects for the released interfaces. Each needs its own labels and evaluation.</p>
            <div className={styles.data}><table>
                <thead><tr><th scope="col">Project</th><th scope="col">Model input and output</th><th scope="col">Useful holdout</th></tr></thead>
                <tbody>
                    <tr><th scope="row">Factory maintenance</th><td>Classify a fixed window of vibration features by machine state.</td><td>Machines absent from training.</td></tr>
                    <tr><th scope="row">Retail and logistics</th><td>Estimate delivery time from order size, depot and route features.</td><td>A later operating period, split before fitting preprocessing.</td></tr>
                    <tr><th scope="row">Agriculture</th><td>Predict two soil-sensor readings from a calibrated sensor array.</td><td>Whole plots or seasons.</td></tr>
                    <tr><th scope="row">Customer support</th><td>Route a fixed ticket embedding to a team and examine low-confidence cases.</td><td>New conversations, grouped by thread.</td></tr>
                </tbody>
            </table></div>
            <p>For a small offline service the published Windows executable measures 820,736 bytes (about 802 KiB). It can fit, predict and score on CPU without a Python installation. Device training adds a Python host, NumPy, a compiler and a compatible runtime. A TPU selector is available for a single PJRT device, but physical TPU execution still needs verification. Distributed pretraining and a dense trillion-parameter run have likewise yet to be demonstrated. In a new industry application, choose a representative dataset, split along the way it will actually be used and measure the cost of its mistakes.</p>
        </section>
        <section id="reproduce">
            <h2>Run the experiment</h2>
            <p>Start with the six labelled rows in the release. These commands train a three-class model and return an ordered list of probabilities for one input. Change a label, train again and inspect the checkpoint to see how the decision changes.</p>
            <pre><code>{`./blyxtorch probe-init 2 3 > initial.bt
./blyxtorch probe-fit initial.bt fixtures/probe-routing.csv 40 0.2 4 > routing.bt
./blyxtorch probe-predict routing.bt 1,0`}</code></pre>
            <p>For the full study, the verification repository prepares both datasets using seed 20261123. Run the native, Vulkan and PyTorch passes against the same directory. The measurement file includes the input and holdout checksums, the seven raw timing samples, per-output gradient deviations and package versions. <a href={source}>Reproduction scripts</a> · <a href={assets + "measurements.json"}>Download the measurements (JSON)</a></p>
            <p><a href={release}>Download BlyxTorch 0.4.0</a> · <a href="/packages/blyxtorch">Framework installation</a> · <a href="https://doc.blyx-lang.space/guide/blyxtorch">BlyxTorch handbook</a></p>
        </section>
    </article></main>;
}
