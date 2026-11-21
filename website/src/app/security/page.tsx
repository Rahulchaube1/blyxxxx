import { pageMetadata } from "@/lib/metadata";
import { guideLink, repository, website } from "@/lib/site";
import ResourcePage from "@/components/ResourcePage";
export const metadata = pageMetadata(
    "Blyx security policy",
    "Report security issues privately to the Blyx project maintainers.",
    website + "/security",
);
const sections = [
    {
        heading: "Send a private report",
        body: "Email security@blyx-lang.space with the affected version or commit, component and impact. The project security policy explains how reports are handled.",
        label: "Email the maintainers",
        href: "mailto:security@blyx-lang.space",
    },
    {
        heading: "Version support",
        body: "The active development branch receives best-effort security support. Consult the repository policy for affected releases and disclosure guidance.",
        label: "Read SECURITY.md",
        href: repository + "/blob/blyx-main/SECURITY.md",
    },
    {
        heading: "Browser execution",
        body: "The browser interpreter runs in a worker with source, output, time and evaluation limits. Native builds and command-line runs have different execution limits.",
        label: "Execution limits",
        href: guideLink("diagnostics"),
    },
];
export default function Page() {
    return (
        <ResourcePage
            title={metadata.title}
            intro={metadata.description}
            sections={sections}
        />
    );
}
