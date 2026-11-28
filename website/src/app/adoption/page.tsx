import NestActivity from "@/components/NestActivity";
import { connection } from "next/server";
import baseline from "@/lib/adoption-baseline.json";
import { pageMetadata } from "@/lib/metadata";
import { repository, website } from "@/lib/site";
import { LiveActivity } from "@/components/LiveActivity";
import { ecosystemDownloads, snapshotUrl } from "@/lib/ecosystem-downloads";
import styles from "./metrics.module.css";

export const metadata = pageMetadata("Blyx downloads and playground activity", "See installs, downloads and voluntary usage statistics for Blyx and its frameworks.", website + "/adoption");
export const revalidate = 600;
const raw = "https://raw.githubusercontent.com/Rahulchaube1/blyxxxx/adoption-history/adoption.json";
type Sample = { marketplace: number; openVsx: number; cargo: number; cli: number; direct: number; frameworkMs: number; frameworkOv: number };
type Snapshot = { updated: string; history: Record<string, Sample>; frameworks: {slug:string; title:string; marketplace:number|null; openVsx:number}[] };
async function latest(): Promise<Snapshot> {
    try {
        const r = await fetch(raw, { next: { revalidate: 600 }, signal: AbortSignal.timeout(5000) });
        if (r.ok) {
            const s = await r.json();
            if (s.history?.[s.updated?.slice(0,10)] && Array.isArray(s.frameworks)) return s;
        }
    } catch { /* Show the dated release baseline when the data branch is unreachable. */ }
    return baseline;
}
const series: [keyof Sample, string, string][] = [
    ["marketplace", "Blyx Language · Marketplace installs", "https://marketplace.visualstudio.com/items?itemName=RahulChaube.blyx-language"],
    ["openVsx", "Blyx Language · Open VSX downloads", "https://open-vsx.org/extension/RahulChaube/blyx-language"],
    ["cargo", "Compiler crate · downloads", "https://crates.io/crates/blyxc"],
    ["cli", "Blyx CLI · GitHub binary downloads", repository + "/releases"],
    ["direct", "Blyx Direct · GitHub binary downloads", repository + "/releases/tag/direct-v0.1.0"],
    ["frameworkMs", "Framework extensions · reported Marketplace installs", "/frameworks"],
    ["frameworkOv", "Framework extensions · Open VSX downloads", "/frameworks"],
];
const format = (n: number) => n.toLocaleString("en-US");
export default async function Adoption() {
    await connection();
    const [s, ecosystem] = await Promise.all([latest(), ecosystemDownloads()]);
    const day = s.updated.slice(0,10), counts = s.history[day];
    function change(key: keyof Sample, days: number) {
        const previous = s.history[new Date(Date.parse(day + "T00:00:00Z") - days * 86400000).toISOString().slice(0,10)];
        if (!previous) return "—";
        const diff = counts[key] - previous[key];
        return (diff > 0 ? "+" : "") + format(diff);
    }
    return <main className="wrap"><header className="page-head"><h1>Blyx activity</h1>
        <p>Follow compiler downloads, editor installs and successful runs in the browser playground.</p></header>
        <LiveActivity initial={ecosystem} />
        <NestActivity />
        <section className="block"><h2>Selected channels over time</h2><p>This daily series tracks the language and the original {s.frameworks.length} framework extensions. Snapshot for <time dateTime={s.updated}>{day} UTC</time>.</p>
            <div className={styles.table}><table><thead><tr><th>Channel</th><th>Total</th><th>7-day change</th><th>30-day change</th></tr></thead><tbody>{series.map(([key,label,href]) =>
                <tr key={key}><th scope="row"><a href={href}>{label}</a></th><td>{format(counts[key])}</td><td>{change(key,7)}</td><td>{change(key,30)}</td></tr>)}</tbody></table></div>
            <details><summary>See all {s.frameworks.length} framework extensions</summary>
            <div className={styles.table}><table><thead><tr><th>Framework</th><th>Marketplace installs</th><th>Open VSX downloads</th></tr></thead><tbody>{s.frameworks.map(p =>
                <tr key={p.slug}><th scope="row"><a href={"/packages/" + p.slug}>{p.title}</a></th><td>{p.marketplace === null ? "Unreported" : format(p.marketplace)}</td><td>{format(p.openVsx)}</td></tr>)}</tbody></table></div></details>
        </section><section className="prose block" id="method"><h2>How the counts work</h2>
            <p>The ecosystem total adds Blyx extension downloads on Open VSX, reported Marketplace installs, downloads of the official compiler crates, and software files attached to public Blyx GitHub releases. Package managers and automated builds can fetch those files. Direct website downloads without a public counter are outside this total. Registries update on their own schedules. One developer can install several packages or keep using the CLI offline.</p>
            <p>On the playground, you can opt in to count successful clicks on Run program. Automatic runs, syntax checks and failed builds are excluded. Your browser picks one of 16,384 random slots and sends its slot, daily count, and whether the selected example was edited. The report includes a broad LinkedIn or other referral category. The server groups participating browser-days by country when the hosting platform supplies it. The report contains no source code, filenames or program output.</p>
            <p>“Active” means a slot reported success in the current or previous 14 UTC minutes. The weekly window covers today and six preceding UTC dates. Shared slots can undercount browsers, and clearing storage or using several devices can count a person again. Each slot contributes up to 255 runs per day. Country and referral counts appear from five browser-days. Unchecking the box clears the local slot and stops reporting. The desktop CLI and editor run offline.</p>
            <p><a href="/api/adoption">Live counters (JSON)</a> · <a href={snapshotUrl}>Last full collection</a> · <a href={raw}>Daily channel history</a> · <a href={repository + "/tree/adoption-history"}>Snapshot history</a> · <a href="/play">Open the playground</a></p></section>
    </main>;
}
