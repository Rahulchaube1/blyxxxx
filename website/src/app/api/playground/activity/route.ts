import { usageSummary, utcDay } from "@/app/adoption/usage";

export const dynamic = "force-dynamic";

export async function GET() {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=0, s-maxage=30, must-revalidate",
    };
    try {
        const { active, observed } = await usageSummary(utcDay());
        return Response.json({ active, observed }, { headers });
    } catch {
        return Response.json({ active: null, observed: null }, {
            status: 503, headers: { ...headers, "Cache-Control": "no-store" },
        });
    }
}
