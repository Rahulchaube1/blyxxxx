import { unstable_cache } from "next/cache";
import { cliVersion } from "@/lib/site";
import { usageSummary, utcDay } from "@/app/adoption/usage";

export const dynamic = "force-dynamic";
async function json(url: string, init?: RequestInit) {
    const result = await fetch(url, { ...init, cache: "no-store", signal: AbortSignal.timeout(6000) });
    if (!result.ok) throw new Error("Registry unavailable");
    return result.json();
}

const registries = unstable_cache(async () => {
    const results = await Promise.allSettled([
        json("https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery", {
            method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json;api-version=7.2-preview.1" },
            body: JSON.stringify({ filters: [{ criteria: [{ filterType: 7, value: "RahulChaube.blyx-language" }], pageNumber: 1, pageSize: 1 }], flags: 256 }),
        }).then(r => r.results[0].extensions[0].statistics.find((s: { statisticName: string }) => s.statisticName === "install")?.value),
        json("https://open-vsx.org/api/RahulChaube/blyx-language").then(r => r.downloadCount),
        json("https://crates.io/api/v1/crates/blyxc", {headers: {"User-Agent": "Blyx-Adoption/1.0 (+https://www.blyx-lang.space/adoption)"}}).then(r => r.crate.downloads),
    ]);
    const [marketplace, openVsx, cargo] = results.map(r =>
        r.status === "fulfilled" && Number.isSafeInteger(r.value) && r.value >= 0 ? Number(r.value) : null);
    return { marketplace, openVsx, cargo, observed: new Date().toISOString() };
}, ["blyx-public-install-counters-v1"], { revalidate: 60 });

const releaseDownloads = unstable_cache(async () => {
    const release = await json("https://api.github.com/repos/Rahulchaube1/blyxxxx/releases/tags/v" + cliVersion, {
        headers: { "User-Agent": "Blyx-adoption-dashboard", Accept: "application/vnd.github+json" },
    });
    function count(suffix: string) {
        const asset = release.assets.find((a: { name: string }) => a.name === "blyx-v" + cliVersion + "-" + suffix);
        return Number.isSafeInteger(asset?.download_count) ? Number(asset.download_count) : null;
    }
    return { windows: count("x86_64-pc-windows-msvc.zip"), linux: count("x86_64-unknown-linux-gnu.tar.gz"),
        mac: count("aarch64-apple-darwin.tar.gz"), observed: new Date().toISOString() };
}, ["blyx-cli-archive-counters", cliVersion], { revalidate: 300 });

export async function GET() {
    const [registry, playground, archives] = await Promise.all([registries(), usageSummary(utcDay()).catch(() => null), releaseDownloads().catch(() => null)]);
    return Response.json({ registry, playground, archives }, { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=30" } });
}
