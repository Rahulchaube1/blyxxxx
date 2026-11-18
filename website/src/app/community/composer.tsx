"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { submitPost } from "./actions";
import type { Board } from "./forum";

export function LiveUpdates() {
    const router = useRouter();
    useEffect(() => {
        const refresh = () => { if (!document.hidden) router.refresh(); };
        const timer = window.setInterval(refresh, 45_000);
        document.addEventListener("visibilitychange", refresh);
        return () => { clearInterval(timer); document.removeEventListener("visibilitychange", refresh); };
    }, [router]);
    return null;
}

export function Composer({ board, topic, serverTime }: { board: Board; topic?: string; serverTime: number }) {
    const router = useRouter();
    const [name, setName] = useState("");
    const [busy, setBusy] = useState(false);
    const [notice, setNotice] = useState("");
    const [error, setError] = useState("");
    const [ready, setReady] = useState(false);
    const session = useRef("");
    const nonce = useRef("");
    const clock = useRef(0);
    const serverStart = useRef(serverTime);
    const lock = useRef(false);

    useEffect(() => {
        clock.current = performance.now();
        session.current = crypto.randomUUID();
        try {
            const stored = localStorage.getItem("blyx.community.guest");
            if (stored) session.current = stored;
            else localStorage.setItem("blyx.community.guest", session.current);
            setName(localStorage.getItem("blyx.community.nickname") || "");
        } catch { /* The session still works when browser storage is disabled. */ }
        setReady(true);
    }, []);

    async function post(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (lock.current) return;
        lock.current = true;
        setBusy(true); setError(""); setNotice("");
        const form = event.currentTarget;
        const data = new FormData(form);
        const now = Math.round(serverStart.current + performance.now() - clock.current);
        nonce.current ||= String(9_999_999_999_999 - now).padStart(13, "0") + "-" + crypto.randomUUID();
        data.set("board", board); data.set("topic", topic || "");
        data.set("id", nonce.current); data.set("guest", session.current);
        try {
            const result = await submitPost(data);
            if (!result.href) { setError(result.error || "Please try again."); return; }
            try { localStorage.setItem("blyx.community.nickname", name.trim()); } catch { /* optional */ }
            nonce.current = "";
            form.reset();
            setNotice(topic ? "Your reply was posted." : "Your discussion was posted.");
            router.push(result.href, { scroll: !topic });
            router.refresh();
        } catch {
            setError("The connection was interrupted. Your draft is still here. Please try again.");
        } finally {
            lock.current = false; setBusy(false);
        }
    }
    return (
        <form className="forum-form" method="post" onSubmit={post}>
            <label>Nickname<input name="name" autoComplete="nickname" maxLength={40} required value={name} onChange={e => setName(e.target.value)} /></label>
            {!topic && <label>Topic title<input name="title" maxLength={120} required /></label>}
            <label>{topic ? "Your reply" : "Message"}<textarea name="body" rows={5} maxLength={6000} required /></label>
            <p className="forum-note">Posts are public. A short guest ID appears beside your nickname.</p>
            <noscript><p>Enable JavaScript to post a discussion or reply.</p></noscript>
            <div><button className="primary" disabled={busy || !ready}>{busy ? "Posting…" : topic ? "Post reply" : "Post discussion"}</button></div>
            {error && <p role="alert">{error}</p>}
            {notice && <p role="status">{notice}</p>}
        </form>
    );
}
