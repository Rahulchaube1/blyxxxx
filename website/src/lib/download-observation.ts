export const channelNames = ["openVsx", "marketplace", "cargo", "github"] as const;
export type DownloadChannel = (typeof channelNames)[number];
export type DownloadSnapshot = {
    channels: Record<DownloadChannel, number>;
    observed: string;
    total: number;
    sourceObserved?: Record<DownloadChannel, string>;
    githubReconciled?: string;
};

export function mergeDownloads(previous: DownloadSnapshot, incoming: DownloadSnapshot): DownloadSnapshot {
    const channels = { ...previous.channels };
    const sourceObserved = {} as Record<DownloadChannel, string>;
    let githubReconciled = previous.githubReconciled ?? previous.observed;
    for (const key of channelNames) {
        const before = previous.sourceObserved?.[key] ?? previous.observed;
        const after = incoming.sourceObserved?.[key] ?? incoming.observed;
        const value = incoming.channels[key];
        const incomingSweep = incoming.githubReconciled ?? incoming.observed;
        const sweepChange = key === "github" ? Date.parse(incomingSweep) - Date.parse(githubReconciled) : 0;
        const newer = Number.isSafeInteger(value) && value >= 0 &&
            (sweepChange > 0 || (sweepChange === 0 && Date.parse(after) >= Date.parse(before)));
        channels[key] = newer ? value : previous.channels[key];
        sourceObserved[key] = newer ? after : before;
        if (key === "github" && newer) githubReconciled = incomingSweep;
    }
    const total = Object.values(channels).reduce((sum, value) => sum + value, 0);
    // A combined observation is only as recent as its oldest contributing source.
    const observed = new Date(Math.min(...Object.values(sourceObserved).map(Date.parse))).toISOString();
    return { channels, sourceObserved, total, observed, githubReconciled };
}
