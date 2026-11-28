"use client";
import { useEffect, useState } from "react";
import { cliVersion } from "@/lib/site";
import { mergeDownloads, type DownloadChannel, type DownloadSnapshot } from "@/lib/download-observation";
import styles from "../app/adoption/metrics.module.css";
type Live = {
    ecosystem: DownloadSnapshot;
    archives: { windows: number | null; linux: number | null; mac: number | null; observed: string } | null;
    registry: { marketplace: number | null; openVsx: number | null; cargo: number | null; observed: string };
    playground: { active: number; runs: number; browsers: number; observed: string; examples: Record<string, number>;
        countries: [string, number][]; linkedin: number | null } | null;
};
function date(stamp: string) {
    return new Date(stamp).toISOString().replace("T", " ").slice(0, 19) + " UTC";
}
export function LiveActivity({compact = false, initial}: {compact?: boolean; initial: DownloadSnapshot}) {
    const [data, setData] = useState<Live>();
    const [ecosystem, setEcosystem] = useState(initial);
    const [failed, setFailed] = useState(false);
    const [received, setReceived] = useState<string>();
    useEffect(() => {
        const controller = new AbortController();
        let busy = false;
        async function refresh() {
            if (busy || document.hidden) return;
            busy = true;
            try {
                const r = await fetch("/api/adoption", { signal: AbortSignal.any([controller.signal, AbortSignal.timeout(15000)]) });
                if (!r.ok) throw new Error();
                const payload: Live = await r.json();
                if (!controller.signal.aborted) {
                    setData(payload);
                    if (payload.ecosystem) setEcosystem(previous => mergeDownloads(previous, payload.ecosystem));
                    setReceived(new Date().toISOString());
                    setFailed(false);
                }
            } catch { if (!controller.signal.aborted) setFailed(true); } finally { busy = false; }
        }
        void refresh();
        const timer = setInterval(refresh, 1000);
        document.addEventListener("visibilitychange", refresh);
        window.addEventListener("online", refresh);
        return () => { controller.abort(); clearInterval(timer); document.removeEventListener("visibilitychange", refresh); window.removeEventListener("online", refresh); };
    }, []);
    const reg = data?.registry, play = data?.playground;
    const metrics = [
        ["Language extension · Marketplace installs", reg?.marketplace], ["Language extension · Open VSX downloads", reg?.openVsx],
        ["Compiler crate downloads", reg?.cargo], ["Active playground browsers · 15 min", play?.active],
        ...compact ? [] : [["Playground browsers · 7 days", play?.browsers], ["Successful runs · 7 days", play?.runs]],
    ] as [string, number | null | undefined][];
    const channels: [string, DownloadChannel][] = [
        ["Open VSX downloads", "openVsx"], ["GitHub release downloads", "github"],
        ["Compiler crate and dependency downloads", "cargo"], ["VS Marketplace installs", "marketplace"],
    ];
    const newest = new Date(Math.max(...Object.values(ecosystem.sourceObserved ?? { initial: ecosystem.observed }).map(Date.parse))).toISOString();
    const Heading = compact ? "h3" : "h2";
    return <div>
        <section className={styles.ecosystem} aria-label="Ecosystem downloads and installs">
            <div>
                <Heading>Ecosystem downloads and installs</Heading>
                <strong className={styles.total}>{ecosystem.total.toLocaleString("en-US")}</strong>
                <p>Compiler, editor extensions, frameworks, libraries and tools.</p>
            </div>
            <div>
                <p>{failed ? "Reconnecting to the live feed." : received ? <>Last received <time dateTime={received}>{date(received)}</time>.</> : "Connecting to the live feed…"}</p>
                <p>Latest source check <time dateTime={newest}>{date(newest)}</time>. This page checks the feed every second.</p>
                {compact && <a href="/adoption#breakdown">See the channel breakdown →</a>}
            </div>
        </section>
        {!compact && <div id="breakdown"><dl className={styles.metrics}>{channels.map(([label, key]) => {
            const stamp = ecosystem.sourceObserved?.[key] ?? ecosystem.observed;
            return <div key={key}><dt>{label}<small className={styles.sourceTime}>Checked <time dateTime={stamp}>{date(stamp)}</time></small></dt><dd>{ecosystem.channels[key].toLocaleString("en-US")}</dd></div>;
        })}</dl>
            <p className="subtle">Full GitHub release inventory checked {date(ecosystem.githubReconciled ?? ecosystem.observed)}. The current CLI release is checked between full counts.</p>
            <p className="subtle">Repeat downloads, dependency installs and automated builds can each add to the total.</p></div>}
        <dl className={styles.metrics}>{metrics.map(([label, v]) =>
        <div key={label}><dt>{label}</dt><dd>{typeof v === "number" ? v.toLocaleString("en-US") : data || failed ? "Unavailable" : "…"}</dd></div>)}</dl>
        <p className="subtle">{reg ? "Language registries checked " + date(reg.observed) + ". " : ""}{play ? "Playground sampled " + date(play.observed) + ". " : ""}Playground figures include opted-in browsers.</p>
        {!compact && <section className="block"><h2>Blyx CLI {cliVersion} downloads by platform</h2>
            <dl className={styles.metrics}>{([["Windows x64","windows"],["Linux x64","linux"],["macOS Apple Silicon","mac"]] as const).map(([label,key]) =>
                <div key={key}><dt>{label}</dt><dd>{data?.archives?.[key]?.toLocaleString("en-US") ?? (data || failed ? "Unavailable" : "…")}</dd></div>)}</dl>
            <p className="subtle">GitHub archive downloads, checked about every two minutes while the feed is in use. {data?.archives && "Checked " + date(data.archives.observed) + "."}</p>
        </section>}
        {!compact && play && <div className="block"><h2>What people ran</h2>
            <p>Across the last seven UTC dates, browsers reported <strong>{(play.examples.example || 0).toLocaleString("en-US")}</strong> successful runs of the selected example and <strong>{(play.examples.edited || 0).toLocaleString("en-US")}</strong> with edited code.</p>
            {play.countries.length ? <p>Activity by country (browser-days): {play.countries.map(([c,n]) => c + " · " + n).join(", ")}.</p> : <p>Country totals appear once a country reaches five participating browser-days.</p>}
            {play.linkedin !== null && <p>{play.linkedin} participating browser-days started with a run referred by LinkedIn.</p>}
        </div>}
    </div>;
}
