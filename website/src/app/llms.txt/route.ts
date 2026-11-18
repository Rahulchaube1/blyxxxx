import guides from "@/lib/guides.json";
import samples from "@/lib/samples.json";
import { handbookText } from "@/lib/handbook-text.mjs";

export const dynamic = "force-static";
export function GET() {
    return new Response(handbookText(guides, samples, false), {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
}
