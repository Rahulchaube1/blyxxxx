import PackageLogoGallery from "@/components/PackageLogoGallery";
import { website } from "@/lib/site";

export const metadata = {
    title: "Blyx library logos",
    description: "Browse the Blyx penguin illustrations for every library and download the transparent PNGs.",
    alternates: { canonical: website + "/libraries/logos" },
};

export default function LibraryLogos() {
    return <PackageLogoGallery category="library" />;
}
