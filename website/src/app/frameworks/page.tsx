import { pageMetadata } from "@/lib/metadata";
import PackageDirectory from "@/components/PackageDirectory";
import { website } from "@/lib/site";

export const metadata = pageMetadata(
    "Blyx frameworks",
    "Find a Blyx workflow by domain, try its example in the playground, and download its native CLI or source.",
    website + "/frameworks",
);

export default function Frameworks() {
    return <PackageDirectory category="framework" />;
}
