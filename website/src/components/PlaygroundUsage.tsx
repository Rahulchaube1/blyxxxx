"use client";
import { useEffect, useState } from "react";

const enabledKey = "blyx.playground.count";
const stateKey = "blyx.playground.activity";
function enabled() {
    return localStorage.getItem(enabledKey) === "yes" && navigator.doNotTrack !== "1" && !navigator.webdriver;
}

export function PlaygroundUsage() {
    const [checked, setChecked] = useState(false);
    const [available, setAvailable] = useState(false);
    useEffect(() => {
        const sync = () => { try {
            setAvailable(navigator.doNotTrack !== "1");
            setChecked(enabled());
        } catch { setAvailable(false); } };
        sync(); window.addEventListener("storage", sync);
        return () => window.removeEventListener("storage", sync);
    }, []);
    if (!available) return null;
    return <p className="subtle"><label><input type="checkbox" checked={checked} onChange={e => {
        try {
            if (e.target.checked) localStorage.setItem(enabledKey, "yes");
            else { localStorage.removeItem(enabledKey); localStorage.removeItem(stateKey); }
            setChecked(e.target.checked);
        } catch { setAvailable(false); }
    }} /> Include my successful Run program clicks in public usage statistics.</label>{" "}
        <a href="/adoption#method">What gets counted?</a></p>;
}

export async function reportPlaygroundRun(kind: "example" | "edited") {
    try {
        if (!enabled()) return;
        const prepare = () => {
            if (!enabled()) return;
            const now = Date.now(), day = new Date(now).toISOString().slice(0,10);
            let prior;
            try { prior = JSON.parse(localStorage.getItem(stateKey) || "null"); } catch { /* First run with new storage. */ }
            const valid = prior && Number.isInteger(prior.bucket) && prior.bucket >= 0 && prior.bucket < 16384;
            const bucket = valid ? prior.bucket : crypto.getRandomValues(new Uint16Array(1))[0] % 16384;
            const count = Math.min(255, (valid && prior.day === day && Number.isInteger(prior.count) ? prior.count : 0) + 1);
            const item = { bucket, count, day };
            localStorage.setItem(stateKey, JSON.stringify(item));
            let linked = new URLSearchParams(location.search).get("utm_source")?.toLowerCase() === "linkedin";
            if (document.referrer) linked ||= /(^|\.)linkedin\.com$|^lnkd\.in$/.test(new URL(document.referrer).hostname);
            return { ...item, kind, referral: linked ? "LinkedIn" : "Other or direct" };
        };
        const item = navigator.locks ? await navigator.locks.request(stateKey, prepare) : prepare();
        if (item && enabled()) await fetch("/api/playground-usage", { method: "POST", credentials: "omit",
            referrerPolicy: "no-referrer", keepalive: true, headers: { "Content-Type": "application/json" }, body: JSON.stringify(item) });
    } catch { /* Offline and restricted browsers can still run Blyx. */ }
}
