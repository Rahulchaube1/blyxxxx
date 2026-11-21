import PackageDirectory from "@/components/PackageDirectory";
import { website } from "@/lib/site";

export const metadata = {
    title: "Blyx frameworks",
    description: "Find a Blyx workflow by domain, try its example in the playground, and download its native CLI or source.",
    alternates: { canonical: website + "/frameworks" },
};

export default function Frameworks() {
    return <PackageDirectory category="framework" />;
}
