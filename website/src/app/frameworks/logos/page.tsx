import { pageMetadata } from "@/lib/metadata";
import PackageLogoGallery from "@/components/PackageLogoGallery";
import { website } from "@/lib/site";

export const metadata = pageMetadata(
    "Blyx framework logos",
    "Browse the birds of the Blyx framework collection, download their artwork, or install a framework in your editor.",
    website + "/frameworks/logos",
);

export default function FrameworkLogos() {
    return <PackageLogoGallery category="framework" />;
}
