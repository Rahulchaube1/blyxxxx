import "server-only";
import { BlobNotFoundError, get, put } from "@vercel/blob";
import { unstable_cache } from "next/cache";

const slots = 4096;
const shards = 4;
const prefix = "playground-usage/v1/" + (process.env.VERCEL_ENV || "development");
type Day = { counts: string; minutes?: string; examples?: Record<string,number>; countries: Record<string, number>; referrals: Record<string, number> };
type Loaded = { value: Day; etag?: string };
export type Referral = "LinkedIn" | "Other or direct";
export const utcDay = () => new Date().toISOString().slice(0, 10);

function path(day: string, shard: number) { return `${prefix}/${day}/${shard}.json`; }

async function read(day: string, shard: number): Promise<Loaded> {
    try {
        const result = await get(path(day, shard), { access: "private", useCache: false });
        if (result && result.statusCode === 200) {
            return { value: await new Response(result.stream).json(), etag: result.blob.etag };
        }
    } catch (error) {
        if (!(error instanceof BlobNotFoundError)) throw error;
    }
    return { value: { counts: Buffer.alloc(slots).toString("base64"), countries: {}, referrals: {} } };
}

export async function record(day: string, bucket: number, count: number, country: string, referral: Referral, kind: string) {
    const shard = Math.floor(bucket / slots), index = bucket % slots;
    for (let attempt = 0; attempt < 5; attempt++) {
        const { value, etag } = await read(day, shard);
        const bytes = Buffer.from(value.counts, "base64");
        if (count <= bytes[index]) return;
        if (bytes[index] === 0) {
            value.countries[country] = (value.countries[country] || 0) + 1;
            value.referrals[referral] = (value.referrals[referral] || 0) + 1;
        }
        const delta = count - bytes[index];
        value.examples ??= {};
        value.examples[kind] = (value.examples[kind] || 0) + delta;
        const minutes = value.minutes ? Buffer.from(value.minutes, "base64") : Buffer.alloc(slots * 2);
        const now = new Date();
        minutes.writeUInt16LE(1 + now.getUTCHours() * 60 + now.getUTCMinutes(), index * 2);
        value.minutes = minutes.toString("base64");
        bytes[index] = count;
        value.counts = bytes.toString("base64");
        try {
            await put(path(day, shard), JSON.stringify(value), {
                access: "private", contentType: "application/json", addRandomSuffix: false,
                allowOverwrite: !!etag, ifMatch: etag,
            });
            return;
        } catch (error) {
            // Retry simultaneous creation or updates only if another writer advanced the file.
            if (attempt === 4 || (await read(day, shard)).etag === etag) throw error;
        }
    }
}

async function summarize(today: string) {
    const days = Array.from({ length: 7 }, (_, i) =>
        new Date(Date.parse(today + "T00:00:00Z") - i * 86400000).toISOString().slice(0, 10));
    const seen = new Uint8Array(slots * shards);
    const countries: Record<string, number> = {}, referrals: Record<string, number> = {};
    const active = new Uint8Array(slots * shards);
    const minute = Math.floor(Date.now() / 60000);
    const examples: Record<string,number> = {};
    let runs = 0;
    await Promise.all(days.map(async day => {
        await Promise.all(Array.from({ length: shards }, async (_, shard) => {
            const { value } = await read(day, shard);
            const bytes = Buffer.from(value.counts, "base64");
            const minutes = value.minutes ? Buffer.from(value.minutes, "base64") : null;
            const midnight = Date.parse(day + "T00:00:00Z") / 60000;
            for (let i = 0; i < bytes.length; i++) {
                const last = minutes?.readUInt16LE(i*2);
                if (last && midnight + last - 1 > minute - 15) active[shard * slots + i] = 1;
                runs += bytes[i];
                if (bytes[i]) seen[shard * slots + i] = 1;
            }
            for (const [k,n] of Object.entries(value.examples || {})) examples[k] = (examples[k] || 0) + n;
            for (const [k,n] of Object.entries(value.countries)) countries[k] = (countries[k] || 0) + n;
            for (const [k,n] of Object.entries(value.referrals)) referrals[k] = (referrals[k] || 0) + n;
        }));
    }));
    return { runs, examples, active: active.reduce((a,b) => a+b, 0), observed: new Date().toISOString(), browsers: seen.reduce((a,b) => a+b, 0),
        countries: Object.entries(countries).filter(([, n]) => n >= 5).sort((a,b) => b[1]-a[1]),
        linkedin: (referrals.LinkedIn || 0) >= 5 ? referrals.LinkedIn : null };
}
export const usageSummary = unstable_cache(summarize, ["blyx-playground-usage-v1"], { revalidate: 60 });
