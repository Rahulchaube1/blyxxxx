import { readFileSync } from "node:fs";
import { join } from "node:path";
import StructuredData from "@/components/StructuredData";
import { pageMetadata } from "@/lib/metadata";
import { docs, repository, website } from "@/lib/site";
import styles from "../articles.module.css";

const title = "How Blyx learned to compile itself";
const description = "Follow a small Blyx program from source to a Windows or Linux executable, rebuild Blyx Direct 0.1.0, and see what its self-hosting tests establish.";
const url = website + "/articles/blyx-direct";
const assets = "/articles/blyx-direct/";
const release = repository + "/releases/tag/direct-v0.1.0";
const source = repository + "/blob/direct-v0.1.0/compiler/blyxc/bootstrap/compiler.blyx";
const tests = repository + "/blob/direct-v0.1.0/tools/test-self-host.py";
const image = { url: website + assets + "bootstrap.png", alt: "The seed builds generation one, which builds a byte-identical generation two on the same target." };
export const dynamic = "force-static";
const base = pageMetadata(title, description, url, image);
export const metadata = { ...base, openGraph: { ...base.openGraph, type: "article" as const, publishedTime: "2026-11-26" } };

export default function BlyxDirectArticle() {
    const sample = readFileSync(join(process.cwd(), "public/articles/blyx-direct/batches.blyx"), "utf8").trimEnd();
    return <main className="wrap"><article className={styles.body}>
        <StructuredData data={{ "@context": "https://schema.org", "@type": "TechArticle", headline: title, description, datePublished: "2026-11-26", author: { "@type": "Organization", name: "Blyx", url: website }, mainEntityOfPage: url, image: image.url }} />
        <header>
            <p className={styles.byline}><a href="/articles">Engineering articles</a> · <time dateTime="2026-11-26">26 November 2026</time></p>
            <h1>{title}</h1>
            <p className={styles.dek}>A small executable and a file called <code>compiler.blyx</code> are enough to build another copy of Blyx Direct. Here is what happens between those two files, and how to check the result yourself.</p>
        </header>
        <nav className={styles.contents} aria-label="In this article">
            <a href="#editions">Choose a toolchain</a><a href="#program">Build a program</a><a href="#inside">Inside the compiler</a><a href="#bootstrap">Rebuild it</a><a href="#coverage">What works today</a>
        </nav>
        <section id="editions">
            <h2>One language, two compiler downloads</h2>
            <p>Until this release, building a native Blyx program meant asking the Blyx driver to translate it into Rust. The driver invoked <code>rustc</code> and the host linker, and you could give the finished executable to someone who had none of those tools. Rust was a dependency on the machine doing the build. For a developer working on Blyx itself, that also meant that part of the language’s behavior lived in the code that generated Rust.</p>
            <p>Blyx Direct 0.1.0 brings a second route. Its lexer, parser, type checks, instruction emitter and executable writer live in a Blyx source file. On Windows x64 or Linux x64, the downloaded compiler can turn a supported program into an executable on its own. One program that fits within its supported language is the compiler itself. That is what <em>self-hosted</em> means in this release. <a href={source}>Read the compiler source.</a></p>
            <p>The two downloads both contain a file named <code>blyxc</code>, so keep them in separate directories. Direct reports <code>blyxc direct 0.1.0</code> when you run its version command. The 0.2.1 toolchain remains the choice for floating-point arithmetic, vectors, imported packages and Apple Silicon macOS. The browser playground and the editor’s Run File command use the Blyx interpreter compiled to WebAssembly. <a href="/download#direct">Choose a download.</a></p>
        </section>
        <section id="program">
            <h2>A first program with an awkward last batch</h2>
            <p>Suppose a sensor logger sends up to 64 readings per batch. Exactly 64 readings take one batch. A 65th reading needs a second batch, even though that batch has 63 empty slots. This little calculation is a useful introduction to Blyx because the answer is easy to check by hand and the obvious formula has an edge case.</p>
            <pre><code>{sample}</code></pre>
            <p><code>fn</code> introduces a function. Both parameters are signed 64-bit integers, and <code>-&gt; i64</code> tells the compiler what the caller expects back. <code>let full</code> binds an immutable value. The early returns handle invalid inputs and exact multiples. The final expression, <code>full + 1</code>, supplies the remaining return value. The function uses −1 as its own convention for invalid input. A caller can distinguish that result from the zero batches needed for an empty log.</p>
            <p>A common formula adds capacity minus one to the number of readings before dividing. With the largest signed 64-bit integer and a capacity of two, that intermediate addition overflows. Here we divide first. When there is a remainder, the quotient is small enough for one more batch. That is why the fourth call can print the correct answer even at the upper limit of the type.</p>
            <p><a download href={assets + "batches.blyx"}>Download batches.blyx</a> into the directory where you extracted Direct. On Windows, run these commands in PowerShell. Choose a new output filename if you have already built the example.</p>
            <pre><code>{".\\blyxc.exe --version\n.\\blyxc.exe build batches.blyx -o batches.exe\n.\\batches.exe"}</code></pre>
            <p>On Linux x64, run the compiler and executable from the extracted directory.</p>
            <pre><code>{"./blyxc --version\n./blyxc build batches.blyx -o batches\n./batches"}</code></pre>
            <p>The five lines correspond to an empty log, an exact batch, a partial final batch, the integer boundary and an invalid capacity. Change 65 to 128 in the third call and predict which output will change before rebuilding.</p>
            <pre aria-label="Expected program output"><code>{"0\n1\n2\n4611686018427387904\n-1"}</code></pre>
        </section>
        <section id="inside">
            <h2>Follow a comparison into the executable</h2>
            <p>Start with the test <code>readings % capacity == 0</code>. The lexer distinguishes identifiers, numbers and operators. In particular, it reads the two adjacent equals signs as a single comparison token. The parser gives the remainder operation higher precedence than equality, so the comparison uses the remainder of the division. The result is a Boolean, the type required by the enclosing <code>if</code>.</p>
            <p>The compiler makes two passes over the functions. The first records names, parameter types and result types. That lets a function call another function defined later in the same file. On the second pass the compiler can check the argument count and types at a call site while emitting the function body. A call to an unknown function is a compilation error. Diagnostics report a byte offset into the source, which matters when a string contains multibyte UTF-8 characters.</p>
            <p>While emitting an <code>if</code>, the compiler knows which condition will skip the body. It cannot yet know how many instruction bytes the body will occupy. It reserves space for that distance and fills it in once it has emitted the destination. Calls to functions defined later need a similar fixup. You can follow those steps in the source by looking for <code>branch</code>, <code>resolve</code> and <code>call_fixup</code>.</p>
            <p>Instructions alone are insufficient for an operating system to launch a program. Windows needs a PE32+ image with an entry point and imports for system services. Linux needs an ELF64 image with loadable segments and an entry point. Direct writes those headers, emits the runtime routines and resolves the addresses itself. Both targets use x86-64 instructions, but each executable belongs to its own operating system. <a href={source}>Inspect the PE and ELF writers.</a></p>
        </section>
        <section id="bootstrap">
            <h2>Where the first compiler came from</h2>
            <p>If a compiler is written in the language it compiles, something still has to build the first executable. For this release, the Rust-based Blyx driver builds a one-time seed. The seed reads <code>compiler.blyx</code> and writes generation one. Generation one reads the same source and writes generation two. The release workflow packages the verified second generation with the source and instructions.</p>
            <figure className={styles.figure}><img src={assets + "bootstrap.png"} width="1350" height="780" loading="lazy" alt={image.alt}/><figcaption>The comparison is made separately on each operating system. Windows and Linux have different executable formats.</figcaption></figure>
            <p>You can repeat the interesting part with the files already in the download. In a fresh directory on Linux, build the compiler twice, then ask the operating system to compare the executable files.</p>
            <pre><code>{"./blyxc build compiler.blyx -o generation2\n./generation2 build compiler.blyx -o generation3\ncmp generation2 generation3"}</code></pre>
            <p>A successful <code>cmp</code> exits with status zero and prints nothing. On Windows, the two SHA-256 values printed by these commands should agree.</p>
            <pre><code>{".\\blyxc.exe build compiler.blyx -o generation2.exe\n.\\generation2.exe build compiler.blyx -o generation3.exe\nGet-FileHash .\\generation2.exe, .\\generation3.exe"}</code></pre>
            <p>Identical bytes are evidence that the compiler reaches a fixed point for this source and target. A compiler could also reproduce a bug perfectly. The release tests therefore run the programs it emits. They check recursion, block scope, short-circuit logic and signed arithmetic, along with errors such as an unknown function or an assignment to an immutable value. They also exercise paths containing spaces and Unicode and check that an existing output file survives a failed attempt to reuse its name. The test process clears <code>PATH</code> for these builds and runs. <a href={tests}>Read the tests</a> or <a href={repository + "/actions/runs/45776154652"}>inspect the release run.</a></p>
        </section>
        <section id="coverage">
            <h2>What the release covers today</h2>
            <p>We ran the 195 programs in the website’s example catalog through the Windows Direct compiler at the release revision. Eight compiled, ran and produced exactly the catalog’s expected output. The other 187 stopped at compilation. Fibonacci, greatest common divisor, short-circuit evaluation and a value returned from a loop were among the eight that passed. This count describes one public collection, which includes numerical and package examples. It measures neither execution speed nor the percentage of the language specification implemented.</p>
            <div className={styles.data}><table><caption>Choosing an execution path</caption><thead><tr><th scope="col">What you want to do</th><th scope="col">What to use</th></tr></thead><tbody>
                <tr><td>Learn syntax, edit examples or inspect output immediately</td><td>The browser playground, or Run File in the Blyx Language editor extension.</td></tr>
                <tr><td>Build an integer-based utility or study a working compiler</td><td>Blyx Direct on Windows x64 or Linux x64. It supports checked integer arithmetic, functions, recursion and loops.</td></tr>
                <tr><td>Fit a regression, compute a dot product or import an existing numerical package</td><td>The 0.2.1 toolchain. Its native build path needs Rust and a host linker.</td></tr>
            </tbody></table></div>
            <p>A concrete dividing line is a batch of floating-point sensor readings. Direct can calculate how many batches to transmit, as in our example. Calculating the mean of a vector of readings uses the wider numerical toolchain. The distinction applies to packages too. LinearFit trains a regression, Kinglet works with checkpoint ranges, and BlyxTorch provides training tools. A package listing in Blyx Nest tells you where to find its source and examples. Read its version and execution requirements before choosing a compiler. <a href="/frameworks">Browse frameworks</a>, <a href="/libraries">explore libraries</a> or <a href="https://nest.blyx-lang.space/">open Blyx Nest.</a></p>
            <p>For a first contribution, choose one short program that already works in the wider toolchain and write down its expected result. Try compiling it with Direct. If it stops, reduce it to the smallest example that still exhibits the behavior. Include the compiler version, operating system, source and exact output in a report. That gives a compiler contributor a test case and gives other developers a precise answer about what works. <a href="/community">Share a result with the Blyx community.</a></p>
            <p><a href={release}>Release archives and checksums</a> · <a href={docs + "/guide/native-builds"}>Handbook build guide</a> · <a href="/learn">Learn Blyx from the beginning</a></p>
        </section>
    </article></main>;
}
