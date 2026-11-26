"use client";
import { useEffect, useState } from "react";
import styles from "../app/adoption/metrics.module.css";
type Live = {
    registry: { marketplace: number | null; openVsx: number | null; cargo: number | null; observed: string };
    playground: { active: number; runs: number; browsers: number; observed: string; examples: Record<string, number>;
        countries: [string, number][]; linkedin: number | null } | null;
};
function date(stamp: string) {
    return new Date(stamp).toLocaleString("en-GB", { timeZone: "UTC", dateStyle: "medium", timeStyle: "short" }) + " UTC";
}
export function LiveActivity({compact = false}: {compact?: boolean}) {
    const [data, setData] = useState<Live>();
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
                if (!controller.signal.aborted) { setData(payload); setFailed(false); }
            } catch { if (!controller.signal.aborted) setFailed(true); } finally { busy = false; }
        }
        void refresh();
        const timer = setInterval(refresh, 60000);
        document.addEventListener("visibilitychange", refresh);
        return () => { controller.abort(); clearInterval(timer); document.removeEventListener("visibilitychange", refresh); };
    }, []);
    const reg = data?.registry, play = data?.playground;
    const metrics = [
        ["Marketplace installs", reg?.marketplace], ["Open VSX downloads", reg?.openVsx],
        ["Compiler crate downloads", reg?.cargo], ["Active playground browsers · 15 min", play?.active],
        ...compact ? [] : [["Playground browsers · 7 days", play?.browsers], ["Successful runs · 7 days", play?.runs]],
    ] as [string, number | null | undefined][];
    return <div><dl className={styles.metrics}>{metrics.map(([label, v]) =>
        <div key={label}><dt>{label}</dt><dd>{typeof v === "number" ? v.toLocaleString("en-US") : data || failed ? "Unavailable" : "…"}</dd></div>)}</dl>
        <p className="subtle">{failed ? "Refresh failed. " : ""}{reg ? "Registries checked " + date(reg.observed) + ". " : ""}{play ? "Playground sampled " + date(play.observed) + ". " : ""}Refreshes every minute. Playground figures include opted-in browsers.</p>
        {!compact && play && <div className="block"><h2>What people ran</h2>
            <p>Across the last seven UTC dates, browsers reported <strong>{(play.examples.example || 0).toLocaleString("en-US")}</strong> successful runs of the selected example and <strong>{(play.examples.edited || 0).toLocaleString("en-US")}</strong> with edited code.</p>
            {play.countries.length ? <p>Activity by country (browser-days): {play.countries.map(([c,n]) => c + " · " + n).join(", ")}.</p> : <p>Country totals appear once a country reaches five participating browser-days.</p>}
            {play.linkedin !== null && <p>{play.linkedin} participating browser-days started with a run referred by LinkedIn.</p>}
        </div>}
    </div>;
}
