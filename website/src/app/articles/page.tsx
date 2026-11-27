import { pageMetadata } from "@/lib/metadata";
import { website } from "@/lib/site";
import styles from "./articles.module.css";

export const metadata = pageMetadata("Blyx engineering articles", "Experiments with Blyx software, including source code, measurements and reproducible examples.", website + "/articles");

export default function Articles() {
    return <main className="wrap">
        <header className="page-head">
            <h1>Engineering articles</h1>
            <p>Experiments from the people building Blyx, with the code and data behind each result.</p>
        </header>
        <article className={styles.feature}>
            <div><p className={styles.byline}>Blyx Workbench 0.1.0</p>
                <h2><a href="/articles/workbench">What happens when an approval arrives late?</a></h2>
                <p>Replay an editorial workflow, divide a payment exactly and explore 200 installable Blyx packages.</p>
                <a href="/articles/workbench">Read the walkthrough →</a></div>
            <div className="actions"><a href="/frameworks">Browse frameworks</a><a href="/libraries">Browse libraries</a></div>
        </article>
        <article className={styles.feature}>
            <div><p className={styles.byline}>27 November 2026 · Blyx Flightdeck 0.1.0</p>
                <h2><a href="/articles/flightdeck">From a loss function to a GPU training step</a></h2>
                <p>Follow a three-weight classifier and check 50 workflows on CPU and Vulkan.</p>
                <a href="/articles/flightdeck">Read the study →</a></div>
            <img src="/flightdeck/training.png" alt="CPU and GPU training loss across 80 updates" />
        </article>
        <article className={styles.feature}>
            <div><p className={styles.byline}><time dateTime="2026-11-26">26 November 2026</time> · Interactive audio timing</p>
                <h2><a href="/articles/tap-tempo">What happens when you miss a beat?</a></h2>
                <p>Build a tap-tempo instrument in Blyx and follow six taps from timestamps to a 120 BPM reading.</p>
            </div>
            <div className="actions"><a className="button" href="/demos/tap-tempo">Try the instrument</a><a href="/articles/tap-tempo">Read the walkthrough</a></div>
        </article>
        <article className={styles.feature}>
            <div>
                <p className={styles.byline}><time dateTime="2026-11-26">26 November 2026</time> · Blyx Direct 0.1.0</p>
                <h2><a href="/articles/blyx-direct">How Blyx learned to compile itself</a></h2>
                <p>Build a batch counter, follow a comparison into machine code, and reproduce the compiler from its own Blyx source on Windows or Linux.</p>
                <a href="/articles/blyx-direct">Read the compiler walkthrough →</a>
            </div>
            <img src="/articles/blyx-direct/bootstrap.png" alt="Stages in the Blyx compiler bootstrap" />
        </article>
        <article className={styles.feature}>
            <div>
                <p className={styles.byline}><time dateTime="2026-11-24">24 November 2026</time> · LinearFit and BlyxTorch</p>
                <h2><a href="/articles/training-in-factors">A matrix with 2.2 trillion coefficients</a></h2>
                <p>Fit a matrix from four feature pairs, restart a million-weight training run in two CPU processes, and compare two ways to differentiate the same quantum circuit.</p>
                <a href="/articles/training-in-factors">Read the experiment →</a>
            </div>
            <img src="/articles/training-in-factors/factor-storage.png" alt="Storage used by four pairs of input vectors compared with a full matrix" />
        </article>
        <article className={styles.feature}>
            <div>
                <p className={styles.byline}><time dateTime="2026-11-23">23 November 2026</time> · BlyxTorch</p>
                <h2><a href="/articles/blyxtorch-portable-training">One checkpoint, two processors</a></h2>
                <p>Train the same model on a laptop CPU and GPU. Compare 360 handwritten digits, 192 building simulations and the cost of 100 training updates.</p>
                <a href="/articles/blyxtorch-portable-training">Read the experiment →</a>
            </div>
            <img src="/articles/blyxtorch-040/digits.png" alt="Twelve handwritten test digits paired with their predicted classes" />
        </article>
    </main>;
}
