"use client";
import { useEffect, useState } from "react";
import { cliVersion } from "@/lib/site";
import type { EcosystemDownloads } from "@/lib/ecosystem-downloads";
import styles from "../app/adoption/metrics.module.css";
type Live = {
    ecosystem: EcosystemDownloads;
    archives: { windows: number | null; linux: number | null; mac: number | null; observed: string } | null;
    registry: { marketplace: number | null; openVsx: number | null; cargo: number | null; observed: string };
    playground: { active: number; runs: number; browsers: number; observed: string; examples: Record<string, number>;
        countries: [string, number][]; linkedin: number | null } | null;
};
function date(stamp: string) {
    return new Date(stamp).toLocaleString("en-GB", { timeZone: "UTC", dateStyle: "medium", timeStyle: "short" }) + " UTC";
}
export function LiveActivity({compact = false, initial}: {compact?: boolean; initial: EcosystemDownloads}) {
    const [data, setData] = useState<Live>();
    const [ecosystem, setEcosystem] = useState(initial);
    const [failed, setFailed] = useState(false);
    useEffect(() => {
        const controller = new AbortController();
        let busy = false;
        async function refresh() {
            if (busy || document.hidden) return;
            busy = true;
            try {
                const r = await fetch("/api/adoption", { signal: controller.signal });
                if (!r.ok) throw new Error();
                const payload: Live = await r.json();
                if (!controller.signal.aborted) {
                    setData(payload);
                    if (payload.ecosystem) setEcosystem(previous =>
                        Date.parse(payload.ecosystem.observed) >= Date.parse(previous.observed) ? payload.ecosystem : previous);
                    setFailed(false);
                }
            } catch { if (!controller.signal.aborted) setFailed(true); } finally { busy = false; }
        }
        void refresh();
        const timer = setInterval(refresh, 60000);
        document.addEventListener("visibilitychange", refresh);
        return () => { controller.abort(); clearInterval(timer); document.removeEventListener("visibilitychange", refresh); };
    }, []);
    const reg = data?.registry, play = data?.playground;
    const metrics = [
        ["Language extension · Marketplace installs", reg?.marketplace], ["Language extension · Open VSX downloads", reg?.openVsx],
        ["Compiler crate downloads", reg?.cargo], ["Active playground browsers · 15 min", play?.active],
        ...compact ? [] : [["Playground browsers · 7 days", play?.browsers], ["Successful runs · 7 days", play?.runs]],
    ] as [string, number | null | undefined][];
    const channels = [
        ["Open VSX downloads", ecosystem.channels.openVsx],
        ["GitHub release downloads", ecosystem.channels.github],
        ["Compiler crate and dependency downloads", ecosystem.channels.cargo],
        ["VS Marketplace installs", ecosystem.channels.marketplace],
    ] as const;
    const Heading = compact ? "h3" : "h2";
    return <div>
        <section className={styles.ecosystem} aria-label="Ecosystem downloads and installs">
            <div>
                <Heading>Ecosystem downloads and installs</Heading>
                <strong className={styles.total}>{ecosystem.total.toLocaleString("en-US")}</strong>
                <p>Compiler, editor extensions, frameworks, libraries and tools.</p>
            </div>
            <div>
                <p>Last counted <time dateTime={ecosystem.observed}>{date(ecosystem.observed)}</time>.</p>
                <p>Source checks are scheduled every 15 minutes. This page checks for updates every minute.</p>
                {compact && <a href="/adoption#breakdown">See the channel breakdown →</a>}
            </div>
        </section>
        {!compact && <div id="breakdown"><dl className={styles.metrics}>{channels.map(([label, value]) =>
            <div key={label}><dt>{label}</dt><dd>{value.toLocaleString("en-US")}</dd></div>)}</dl>
            <p className="subtle">Repeat downloads, dependency installs and automated builds can each add to the total.</p></div>}
        <dl className={styles.metrics}>{metrics.map(([label, v]) =>
        <div key={label}><dt>{label}</dt><dd>{typeof v === "number" ? v.toLocaleString("en-US") : data || failed ? "Unavailable" : "…"}</dd></div>)}</dl>
        <p className="subtle">{failed ? "Refresh failed. " : ""}{reg ? "Registries checked " + date(reg.observed) + ". " : ""}{play ? "Playground sampled " + date(play.observed) + ". " : ""}Refreshes every minute. Playground figures include opted-in browsers.</p>
        {!compact && <section className="block"><h2>Blyx CLI {cliVersion} downloads by platform</h2>
            <dl className={styles.metrics}>{([["Windows x64","windows"],["Linux x64","linux"],["macOS Apple Silicon","mac"]] as const).map(([label,key]) =>
                <div key={key}><dt>{label}</dt><dd>{data?.archives?.[key]?.toLocaleString("en-US") ?? (data || failed ? "Unavailable" : "…")}</dd></div>)}</dl>
            <p className="subtle">GitHub archive downloads, refreshed about every five minutes. {data?.archives && "Checked " + date(data.archives.observed) + "."}</p>
        </section>}
        {!compact && play && <div className="block"><h2>What people ran</h2>
            <p>Across the last seven UTC dates, browsers reported <strong>{(play.examples.example || 0).toLocaleString("en-US")}</strong> successful runs of the selected example and <strong>{(play.examples.edited || 0).toLocaleString("en-US")}</strong> with edited code.</p>
            {play.countries.length ? <p>Activity by country (browser-days): {play.countries.map(([c,n]) => c + " · " + n).join(", ")}.</p> : <p>Country totals appear once a country reaches five participating browser-days.</p>}
            {play.linkedin !== null && <p>{play.linkedin} participating browser-days started with a run referred by LinkedIn.</p>}
        </div>}
    </div>;
}
