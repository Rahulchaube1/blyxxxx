import { guideLink, repository } from "@/lib/site";
import ResourcePage from "@/components/ResourcePage";
export const metadata = {
    title: "Projects and packages",
    description:
        "The released compiler works with a local Blyx source file. Start a project with blyxc new and run its entry file directly.",
};
const sections = [
    {
        heading: "Start a local project",
        body: "The CLI creates a Blyx.toml manifest and a src/main.blyx entry point. Run blyxc run hello/src/main.blyx after creating a project named hello.",
        label: "Project walkthrough",
        href: guideLink("projects"),
    },
    {
        heading: "Package manager status",
        body: "blyxpkg is a separate prototype. Its registry, dependency installation and publish commands are still under development. The 0.2.0 download contains blyxc.",
        label: "Inspect blyxpkg",
        href: repository + "/tree/blyx-main/tools/blyxpkg",
    },
    {
        heading: "Use the built-ins",
        body: "Vector operations such as dot, len, at and sum are available directly in Blyx source.",
        label: "Vector reference",
        href: guideLink("vectors"),
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
