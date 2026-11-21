import { pageMetadata } from "@/lib/metadata";
import { playLink, website } from "@/lib/site";
import GuideIndex from "@/components/GuideIndex";
export const metadata = pageMetadata(
    "Blyx for beginners",
    "Write your first Blyx program in the browser. Learn how to print a value, use variables and loops, and test a small project.",
    website + "/learn",
);
export default function Learn() {
    return (
        <GuideIndex course>
            <section className="prose first-lesson" aria-labelledby="first-output">
                <h2 id="first-output">Print a greeting</h2>
                <pre><code>{'fn main() {\n    println!("Hello, World from Blyx!");\n}'}</code></pre>
                <p>Blyx starts at <code>main</code>. The line inside the braces prints <samp>Hello, World from Blyx!</samp>.</p>
                <p><a href={playLink("hello")}>Open this program in the playground</a>, replace <code>World</code> with your name, and run it again.</p>
            </section>
        </GuideIndex>
    );
}
