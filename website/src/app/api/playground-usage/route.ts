import { record, utcDay } from "@/app/adoption/usage";

export async function POST(request: Request) {
    const origin = new URL(request.url).origin;
    if (request.headers.get("origin") !== origin || !request.headers.get("content-type")?.startsWith("application/json"))
        return new Response(null, { status: 403 });
    if (Number(request.headers.get("content-length")) > 160) return new Response(null, { status: 413 });
    const body = await request.text();
    if (body.length > 160) return new Response(null, { status: 413 });
    let event;
    try { event = JSON.parse(body); } catch { return new Response(null, { status: 400 }); }
    if (!event || !Number.isInteger(event.bucket) || event.bucket < 0 || event.bucket >= 16384 ||
        !Number.isInteger(event.count) || event.count < 1 || event.count > 255 || event.day !== utcDay() ||
        !["example","edited"].includes(event.kind) || !["LinkedIn", "Other or direct"].includes(event.referral)) return new Response(null, { status: 400 });
    const region = process.env.VERCEL ? request.headers.get("x-vercel-ip-country") || "" : "";
    try {
        await record(event.day, event.bucket, event.count, /^[A-Z]{2}$/.test(region) ? region : "Unknown", event.referral, event.kind);
        return new Response(null, { status: 204 });
    } catch { return new Response(null, { status: 503 }); }
}
