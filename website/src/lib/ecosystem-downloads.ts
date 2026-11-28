import "server-only";
import { unstable_cache } from "next/cache";
import baseline from "./ecosystem-downloads-baseline.json";
import { channelNames, mergeDownloads, type DownloadSnapshot } from "./download-observation";
import { cliVersion } from "./site";

export const snapshotUrl = "https://raw.githubusercontent.com/Rahulchaube1/blyxxxx/adoption-history/ecosystem.json";
type FullSnapshot = DownloadSnapshot & { cliRelease?: { tag: string; downloads: number } };
const publisher = "RahulChaube";
const msGallery = "https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery";

async function json<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, { ...options, cache: "no-store", signal: AbortSignal.timeout(6000) });
    if (!response.ok) throw new Error("Counter source returned " + response.status);
    return response.json();
}
function counter(n: number) {
    if (!Number.isSafeInteger(n) || n < 0) throw new Error("Invalid download count");
    return n;
}
function measured(value: number) {
    return { value: counter(value), observed: new Date().toISOString() };
}

const fullSnapshot = unstable_cache(async (): Promise<FullSnapshot> => {
    const s = await json<FullSnapshot>(snapshotUrl);
    if (Date.parse(s.observed) < Date.parse(baseline.observed)) return baseline;
    if (!(Date.parse(s.observed) >= Date.parse(baseline.observed))
        || s.total !== channelNames.reduce((sum, key) => sum + counter(s.channels[key]), 0))
        throw new Error("Incomplete ecosystem snapshot");
    return s;
}, ["ecosystem-full-snapshot-v2"], { revalidate: 30 });

const extensionNames = unstable_cache(async () => {
    const data = await json<{ extensions: Record<string,string> }>("https://open-vsx.org/api/" + publisher);
    const names = Object.keys(data.extensions).filter(n => n.toLowerCase().includes("blyx"));
    if (!names.includes("blyx-language")) throw new Error("Incomplete publisher inventory");
    return names;
}, ["ecosystem-extension-inventory-v1"], { revalidate: 60 });

const openVsx = unstable_cache(async () => {
    const names = new Set(await extensionNames());
    const counts = new Map<string, number>();
    let offset = 0;
    do {
        const p = await json<{ totalSize: number; extensions: { namespace: string; name: string; downloadCount: number }[] }>(
            "https://open-vsx.org/api/-/search?query=" + publisher + "&size=500&offset=" + offset);
        for (const e of p.extensions) if (e.namespace.toLowerCase() === publisher.toLowerCase() && names.has(e.name))
            counts.set(e.name, counter(e.downloadCount));
        offset += p.extensions.length;
        if (offset >= p.totalSize || !p.extensions.length) break;
    } while (true);
    if (counts.size !== names.size) throw new Error("Incomplete Open VSX search");
    return measured([...counts.values()].reduce((a,b) => a+b, 0));
}, ["ecosystem-openvsx-total-v1"], { revalidate: 10 });

type Extension = { extensionName: string; publisher: { publisherName: string }; statistics?: { statisticName: string; value: number }[] };
type GalleryResult = { extensions: Extension[]; resultMetadata: { metadataType: string; metadataItems: { name: string; count: number }[] }[] };
const marketplace = unstable_cache(async () => {
    const counts = new Map<string, number>();
    async function query(criteria: { filterType: number; value: string }[], pageNumber = 1) {
        const { results: [r] } = await json<{results: GalleryResult[]}>(msGallery, {
            method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json;api-version=7.2-preview.1" },
            body: JSON.stringify({ filters: [{ criteria, pageNumber, pageSize: 100 }], flags: 256 }),
        });
        for (const e of r.extensions) {
            const installs = e.statistics?.find(s => s.statisticName === "install");
            if (e.publisher.publisherName.toLowerCase() === publisher.toLowerCase() && e.extensionName.includes("blyx") && installs)
                counts.set(e.extensionName, counter(installs.value));
        }
        return r;
    }
    const criteria = [{filterType: 8, value: "Microsoft.VisualStudio.Code"}, {filterType: 10, value: "Blyx"}];
    const first = await query(criteria);
    const matches = first.resultMetadata.find(m => m.metadataType === "ResultCount")?.metadataItems.find(i => i.name === "TotalCount");
    if (!matches) throw new Error("Missing Marketplace search size");
    for (let page = 2; (page-1)*100 < matches.count; page++) await query(criteria, page);
    const names = (await extensionNames()).filter(n => !counts.has(n));
    const batches = [];
    for (let i=0; i<names.length; i+=45) batches.push(query(names.slice(i,i+45).map(name => ({filterType: 7, value: publisher+"."+name}))));
    await Promise.all(batches);
    if (!counts.has("blyx-language")) throw new Error("Missing language installs");
    return measured([...counts.values()].reduce((a,b) => a+b, 0));
}, ["ecosystem-marketplace-total-v1"], { revalidate: 60 });

const cargo = unstable_cache(async () => {
    const crates = new Map<string, number>();
    for (let page=1; ; page++) {
        const r = await json<{ crates: { id: string; downloads: number; repository?: string }[]; meta: {total: number} }>(
            "https://crates.io/api/v1/crates?q=blyx&per_page=100&page=" + page,
            {headers: {"User-Agent": "Blyx-Adoption/1.0 (+https://www.blyx-lang.space/adoption)"}});
        for (const c of r.crates) if (c.repository?.toLowerCase().replace(/\/$/, "") === "https://github.com/rahulchaube1/blyxxxx")
            crates.set(c.id, counter(c.downloads));
        if (page*100 >= r.meta.total) break;
        if (!r.crates.length) throw new Error("Incomplete crates.io search");
    }
    if (!["blyxc","blyx_ast","blyx_lexer","blyx_parser"].every(n => crates.has(n))) throw new Error("Missing compiler crates");
    return measured([...crates.values()].reduce((a,b) => a+b, 0));
}, ["ecosystem-crates-total-v1"], { revalidate: 60 });

export const currentRelease = unstable_cache(async () => {
    const tag = "v" + cliVersion;
    const r = await json<{tag_name:string; assets:{name:string; download_count:number}[]}>(
        "https://api.github.com/repos/Rahulchaube1/blyxxxx/releases/tags/" + tag,
        {headers: {"User-Agent":"Blyx-adoption-dashboard", Accept:"application/vnd.github+json"}});
    if (r.tag_name !== tag || r.assets.length >= 30) throw new Error("Incomplete CLI release listing");
    const assets = r.assets.filter(a => /\.(vsix|zip|tar\.gz|tgz|exe|mjs)$/i.test(a.name));
    const platform = (suffix:string) => assets.find(a => a.name === "blyx-" + tag + "-" + suffix)?.download_count ?? null;
    const windows = platform("x86_64-pc-windows-msvc.zip"), linux = platform("x86_64-unknown-linux-gnu.tar.gz"), mac = platform("aarch64-apple-darwin.tar.gz");
    if ([windows, linux, mac].some(n => n === null)) throw new Error("Missing CLI release archive");
    return { ...measured(assets.reduce((sum,a) => sum+counter(a.download_count),0)), tag, windows, linux, mac };
}, ["ecosystem-cli-release-v1", cliVersion], { revalidate: 120 });

export async function ecosystemDownloads(): Promise<DownloadSnapshot> {
    const [s, ov, ms, cr, cli] = await Promise.all([
        fullSnapshot().catch((): FullSnapshot => baseline),
        openVsx().catch(() => null), marketplace().catch(() => null), cargo().catch(() => null), currentRelease().catch(() => null),
    ]);
    const anchor = s.cliRelease;
    const gh = cli && anchor?.tag === cli.tag && Number.isSafeInteger(anchor.downloads)
        && anchor.downloads >= 0 && anchor.downloads <= s.channels.github && Date.parse(cli.observed) >= Date.parse(s.observed)
        ? {value: s.channels.github - anchor.downloads + cli.value, observed: cli.observed} : null;
    const readings = { openVsx: ov, marketplace: ms, cargo: cr, github: gh };
    const incoming = { ...s, channels: {...s.channels}, sourceObserved: {
        openVsx: s.observed, marketplace: s.observed, cargo: s.observed, github: s.observed,
    } };
    for (const key of channelNames) {
        const sample = readings[key];
        incoming.channels[key] = sample?.value ?? s.channels[key];
        incoming.sourceObserved[key] = sample?.observed ?? s.observed;
    }
    return mergeDownloads(s, { ...incoming, githubReconciled: s.observed });
}
