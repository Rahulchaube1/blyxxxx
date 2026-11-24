import snapshot from "./source-channel.json";

export const condaChannel = "https://rahulchaube1.github.io/blyx-packages";
export const distributionRepository = "https://github.com/Rahulchaube1/blyx-packages";
export const sourceCollection = distributionRepository + "/releases/tag/v" + snapshot.release;
export const sourceCollectionArchive = distributionRepository + "/releases/download/v" + snapshot.release
    + "/blyx-packages-" + snapshot.release + ".zip";

type PublishedSource = { name: string; version: string; build: string; commit: string };
const published: Record<string, PublishedSource> = snapshot.packages;

export function condaSource(p: { slug: string; version: string; commit: string }) {
    const pin = published[p.slug];
    if (!pin || pin.version !== p.version || pin.commit !== p.commit) return undefined;
    return { channel: condaChannel, name: pin.name, version: pin.version, build: pin.build };
}
