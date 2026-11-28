import "server-only";
import baseline from "./ecosystem-downloads-baseline.json";

export type EcosystemDownloads = typeof baseline;
export const snapshotUrl = "https://raw.githubusercontent.com/Rahulchaube1/blyxxxx/adoption-history/ecosystem.json";

export async function ecosystemDownloads(): Promise<EcosystemDownloads> {
    try {
        const response = await fetch(snapshotUrl, { next: { revalidate: 60 }, signal: AbortSignal.timeout(5000) });
        if (response.ok) {
            const snapshot: EcosystemDownloads = await response.json();
            const values = (Object.keys(baseline.channels) as (keyof EcosystemDownloads["channels"])[])
                .map(key => snapshot.channels[key]);
            if (values.every(n => Number.isSafeInteger(n) && n >= 0)
                && values.reduce((a, b) => a + b, 0) === snapshot.total
                && Date.parse(snapshot.observed) >= Date.parse(baseline.observed)) return snapshot;
        }
    } catch { /* The packaged observation has its own collection timestamp. */ }
    return baseline;
}
