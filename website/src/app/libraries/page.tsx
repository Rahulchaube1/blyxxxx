import PackageDirectory from "@/components/PackageDirectory";
import { website } from "@/lib/site";

export const metadata = {
    title: "Blyx libraries",
    description: "Browse importable Blyx libraries by task, try a function in the playground, and install its tagged source.",
    alternates: { canonical: website + "/libraries" },
};

export default function Libraries() {
    return <PackageDirectory category="library" />;
}
