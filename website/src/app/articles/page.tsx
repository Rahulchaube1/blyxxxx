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
