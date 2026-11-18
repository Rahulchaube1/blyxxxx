"use server";

import { headers } from "next/headers";
import { forumLink, isBoard, isPostId } from "./forum";
import { authorKey, getPost, PostingLimit, reservePost, writePost } from "./storage";

export async function submitPost(form: FormData): Promise<{ href?: string; error?: string }> {
    const field = (key: string) => {
        const value = form.get(key);
        return typeof value === "string" ? value.trim() : "";
    };
    const board = field("board"), topic = field("topic") || undefined, id = field("id");
    if (!isBoard(board) || (topic && !isPostId(topic)) || !isPostId(id))
        return { error: "This discussion link is invalid. Reopen the board and try again." };
    const name = field("name"), body = field("body"), title = topic ? undefined : field("title");
    if (!name || name.length > 40 || /[\p{Cc}\p{Cf}]/u.test(name))
        return { error: "Use a nickname of 1 to 40 visible characters." };
    if (!body || body.length > 6000 || (!topic && (!title || title.length > 120)))
        return { error: "Add a message of up to 6,000 characters and a topic title of up to 120 characters." };
    const guest = field("guest");
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(guest))
        return { error: "Reload this page to start a guest session." };
    // A reverse timestamp puts the newest immutable entries first in Blob's pathname listing.
    const time = 9_999_999_999_999 - Number(id.slice(0, 13));
    if (Math.abs(Date.now() - time) > 86_400_000)
        return { error: "This draft has expired. Reload the page and try again." };
    try {
        if (topic && !await getPost(board, topic))
            return { error: "This discussion is no longer available." };
        const h = await headers();
        const network = h.get("x-vercel-forwarded-for") || h.get("x-forwarded-for") || "localhost";
        await reservePost(network.split(",")[0].trim(), [board, topic || "", id].join("/"));
        await writePost(board, {
            id, name, tag: authorKey("guest:" + guest).slice(0, 8), title, body,
            published: new Date().toISOString(),
        }, topic);
        return { href: forumLink(board, topic || id) };
    } catch (error) {
        if (error instanceof PostingLimit) return { error: error.message };
        console.error("Blyx community write failed", error instanceof Error ? error.name : "unknown");
        return { error: "We couldn’t save your post. Your draft is still here. Please try again." };
    }
}
