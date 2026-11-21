import { pageMetadata } from "@/lib/metadata";
import PackageLogoGallery from "@/components/PackageLogoGallery";
import { website } from "@/lib/site";

export const metadata = pageMetadata(
    "Blyx library logos",
    "Browse the Blyx penguin illustrations for every library and download the transparent PNGs.",
    website + "/libraries/logos",
);

export default function LibraryLogos() {
    return <PackageLogoGallery category="library" />;
}
