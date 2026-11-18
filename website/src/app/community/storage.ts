import "server-only";
import { createHmac } from "node:crypto";
import { unstable_cache, updateTag } from "next/cache";
import { BlobNotFoundError, get, list, put } from "@vercel/blob";
import { isPostId, type Board, type Post } from "./forum";

// Development and preview traffic must never create public discussions.
const root = "community/v1/" + (process.env.VERCEL_ENV || "development");
const privateJson = { access: "private", contentType: "application/json", addRandomSuffix: false } as const;

export function authorKey(value: string) {
    const secret = process.env.BLOB_READ_WRITE_TOKEN;
    if (!secret) throw new Error("Community storage is unavailable");
    return createHmac("sha256", secret).update(value).digest("hex");
}

async function read<T>(path: string) {
    try {
        const result = await get(path, { access: "private", useCache: false });
        if (!result || result.statusCode !== 200) return null;
        return { value: await new Response(result.stream).json() as T, etag: result.blob.etag };
    } catch (error) {
        if (error instanceof BlobNotFoundError) return null;
        throw error;
    }
}

function folder(board: Board, topic?: string) {
    return topic ? `${root}/replies/${board}/${topic}/` : `${root}/topics/${board}/`;
}

export async function getPost(board: Board, id: string, topic?: string) {
    return (await read<Post>(folder(board, topic) + id + ".json"))?.value ?? null;
}

async function listPage(prefix: string, cursor?: string) {
    const result = await list({ prefix, limit: 12, cursor });
    const entries = result.blobs.filter(b => b.pathname.startsWith(prefix) && isPostId(b.pathname.slice(prefix.length, -5)) && b.pathname.endsWith(".json"));
    const posts = await Promise.all(entries.map(async b => (await read<Post>(b.pathname))?.value));
    return { posts: posts.filter((post): post is Post => !!post), next: result.hasMore ? result.cursor : undefined };
}

export function getPage(board: Board, topic?: string, cursor?: string) {
    const prefix = folder(board, topic);
    if (cursor) return listPage(prefix, cursor);
    return unstable_cache(() => listPage(prefix), [prefix], { revalidate: 45, tags: [prefix] })();
}

type Limit = { last: number; day: string; count: number; request: string };
export class PostingLimit extends Error {}

export async function reservePost(network: string, request: string) {
    const path = `${root}/limits/${authorKey("network:" + network)}.json`;
    const previous = await read<Limit>(path);
    if (previous?.value.request === request) return;
    const now = Date.now();
    const day = new Date(now).toISOString().slice(0, 10);
    const count = previous?.value.day === day ? previous.value.count : 0;
    if (previous && now - previous.value.last < 15_000)
        throw new PostingLimit("Please wait 15 seconds between posts from this network.");
    if (count >= 40) throw new PostingLimit("This network has reached its daily posting limit. Please try again tomorrow.");
    const state: Limit = { last: now, day, count: count + 1, request };
    try {
        await put(path, JSON.stringify(state), {
            ...privateJson, allowOverwrite: !!previous, ifMatch: previous?.etag,
        });
    } catch (error) {
        const current = await read<Limit>(path);
        if (current?.value.request === request) return;
        if (current && current.etag !== previous?.etag)
            throw new PostingLimit("Another post just arrived from this network. Please try again in 15 seconds.");
        throw error;
    }
}

export async function writePost(board: Board, post: Post, topic?: string) {
    const prefix = folder(board, topic);
    const path = prefix + post.id + ".json";
    try {
        await put(path, JSON.stringify(post), { ...privateJson, allowOverwrite: false });
    } catch (error) {
        const saved = await getPost(board, post.id, topic);
        if (!saved || saved.name !== post.name || saved.title !== post.title || saved.body !== post.body || saved.tag !== post.tag) throw error;
    }
    updateTag(prefix);
}
