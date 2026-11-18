import { docs, website, bookEdition } from "@/lib/site";
export default function robots() {
    return {
        rules: { userAgent: "*", allow: "/" },
        sitemap: (bookEdition ? docs : website) + "/sitemap.xml",
    };
}
