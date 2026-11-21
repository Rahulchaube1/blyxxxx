import { pageMetadata } from "@/lib/metadata";
import PackageDirectory from "@/components/PackageDirectory";
import { website } from "@/lib/site";

export const metadata = pageMetadata(
    "Blyx libraries",
    "Browse importable Blyx libraries by task, try a function in the playground, and install its tagged source.",
    website + "/libraries",
);

export default function Libraries() {
    return <PackageDirectory category="library" />;
}
