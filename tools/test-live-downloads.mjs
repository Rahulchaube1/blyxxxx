import assert from "node:assert/strict";
import test from "node:test";
import { mergeDownloads } from "../website/src/lib/download-observation.ts";

const earlier = "2026-11-28T10:00:00Z", later = "2026-11-28T11:00:00Z";
const snapshot = {channels: {openVsx: 110, marketplace: 20, cargo: 30, github: 40}, observed: later, total: 200};

test("accepts a source correction while retaining the other newer observations", () => {
    const received = {channels: {openVsx: 108, marketplace: 0, cargo: 0, github: 0}, observed: earlier,
        sourceObserved: {openVsx: "2026-11-28T11:01:00Z", github: earlier, cargo: earlier, marketplace: earlier}, total: 108};
    const merged = mergeDownloads(snapshot, received);
    assert.deepEqual(merged.channels, {...snapshot.channels, openVsx: 108});
    assert.equal(merged.total, 198);
    assert.equal(merged.sourceObserved.marketplace, later);
    assert.equal(mergeDownloads(merged, snapshot).total, 198);
});

test("an older GitHub inventory cannot overwrite a newer sweep using a recent CLI check", () => {
    const lateCli = {...snapshot, githubReconciled: earlier, channels: {...snapshot.channels, github: 9},
        sourceObserved: {github: "2026-11-28T12:00:00Z", marketplace: later, openVsx: later, cargo: later}};
    assert.equal(mergeDownloads(snapshot, lateCli).channels.github, 40);
    assert.equal(mergeDownloads(lateCli, snapshot).channels.github, 40);
});
