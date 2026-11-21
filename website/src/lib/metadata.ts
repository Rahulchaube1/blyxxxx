import { docs, website } from "./site";

export const languageSiteName = "Blyx";
export const handbookSiteName = "Blyx Documentation";

export function pageMetadata(
    title: string,
    description: string,
    canonical: string,
    image = { url: website + "/blyx.png", alt: "The Blyx penguin" },
) {
    return {
        title,
        description,
        alternates: { canonical },
        openGraph: {
            type: "website" as const,
            siteName: new URL(canonical).origin === docs ? handbookSiteName : languageSiteName,
            title,
            description,
            url: canonical,
            images: [image],
        },
    };
}
