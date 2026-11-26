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
        body: "Choose Extensions → Install from VSIX in desktop VS Code. Version 1.3.0 adds Blyx: Build Native Executable for saved files in trusted workspaces. Install Blyx Direct on Windows x64 or Linux x64, then choose a fresh output filename.",
        label: "Download Blyx Language 1.3.0",
        href: repository + "/releases/download/editor-v1.3.0/blyx-language-1.3.0.vsix",
    },
    {
        heading: "Run a file",
        body: "Open a .blyx file and choose Blyx: Run File. The bundled interpreter runs locally and writes to the Blyx output channel.",
        label: "Editor walkthrough",
        href: guideLink("editor"),
    },
    {
        heading: "Extension registries",
        body: "Each registry displays its currently published version. The release download above installs version 1.3.0 directly.",
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
