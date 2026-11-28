import { pageMetadata } from "@/lib/metadata";
import { repository, website } from "@/lib/site";
import ResourcePage from "@/components/ResourcePage";
export const metadata = pageMetadata(
    "Blyx roadmap",
    "Track what ships in the current release and what is still being explored.",
    website + "/roadmap",
);
const sections = [
    {
        heading: "Available in 0.2.3",
        body: "Run source on the CLI, in the browser and through the VS Code extension. Build native projects with local module imports, command-line arguments, file access and CPU vector operations.",
        label: "Read the release",
        href: repository + "/releases/tag/v0.2.3",
    },
    {
        heading: "Compiler development",
        body: "The public roadmap describes the work on analysis, diagnostics, optimizer infrastructure and backends. Proposals and experiments can change as implementation progresses.",
        label: "Read the engineering roadmap",
        href: repository + "/blob/blyx-main/ROADMAP.md",
    },
    {
        heading: "Language proposals",
        body: "Actors, GPU execution, general-purpose modules and richer tensor support remain development topics. Follow individual proposals in the project’s RFC directory.",
        label: "Browse RFCs",
        href: repository + "/tree/blyx-main/RFC",
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
