import { unstable_cache } from "next/cache";
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

export async function GET() {
    const [registry, playground] = await Promise.all([registries(), usageSummary(utcDay()).catch(() => null)]);
    return Response.json({ registry, playground }, { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=30" } });
}
