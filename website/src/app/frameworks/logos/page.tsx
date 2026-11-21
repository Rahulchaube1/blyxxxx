import PackageLogoGallery from "@/components/PackageLogoGallery";
import { website } from "@/lib/site";

export const metadata = {
    title: "Blyx framework logos",
    description: "Browse the birds of the Blyx framework collection, download their artwork, or install a framework in your editor.",
    alternates: { canonical: website + "/frameworks/logos" },
};

export default function FrameworkLogos() {
    return <PackageLogoGallery category="framework" />;
}
