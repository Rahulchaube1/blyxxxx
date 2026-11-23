import { pageMetadata } from "@/lib/metadata";
import { guideLink, repository, website } from "@/lib/site";
import ResourcePage from "@/components/ResourcePage";
export const metadata = pageMetadata(
    "Blyx for VS Code",
    "Run the current Blyx buffer, see parser diagnostics while editing, and use syntax highlighting and snippets.",
    website + "/vscode",
);
const sections = [
    {
        heading: "Install a framework",
        body: "Choose a Blyx framework to get its editor extension, example and installation instructions. Each framework also has a direct VSIX download.",
        label: "Browse framework extensions",
        href: "/frameworks/logos",
    },
    {
        heading: "Train a model with BlyxTorch",
        body: "BlyxTorch 0.4.0 includes offline CPU training, two editable Blyx projects and an optional device host for Vulkan GPUs. Fit a classifier on your own features or train a sensor model from the starter workspace.",
        label: "BlyxTorch editor downloads and projects",
        href: "/packages/blyxtorch#editor",
    },
    {
        heading: "Install the Blyx Language extension",
        body: "Choose Extensions → Install from VSIX in desktop VS Code. Version 1.2.4 adds the Blyx bird beside .blyx files in light and dark themes that show language icons.",
        label: "Download Blyx Language 1.2.4",
        href: repository + "/releases/download/editor-v1.2.4/blyx-language-1.2.4.vsix",
    },
    {
        heading: "Run a file",
        body: "Open a .blyx file and choose Blyx: Run File. The bundled interpreter runs locally and writes to the Blyx output channel.",
        label: "Editor walkthrough",
        href: guideLink("editor"),
    },
    {
        heading: "Extension registries",
        body: "Each registry displays its currently published version. The release download above installs version 1.2.4 directly.",
        label: "Visual Studio Marketplace",
        href: "https://marketplace.visualstudio.com/items?itemName=RahulChaube.blyx-language",
    },
    {
        heading: "Open VSX",
        body: "Blyx Language also has an Open VSX listing under the RahulChaube namespace.",
        label: "View Open VSX listing",
        href: "https://open-vsx.org/extension/RahulChaube/blyx-language",
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
