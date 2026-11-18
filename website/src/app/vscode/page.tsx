import { guideLink, repository } from "@/lib/site";
import ResourcePage from "@/components/ResourcePage";
export const metadata = {
    title: "Blyx for VS Code",
    description:
        "Run the current Blyx buffer, see parser diagnostics while editing, and use syntax highlighting and snippets.",
};
const sections = [
    {
        heading: "Install the 1.2.3 extension",
        body: "Download the versioned VSIX from the Blyx release. Choose Extensions → Install from VSIX in desktop VS Code and select the downloaded file.",
        label: "Download Blyx Language 1.2.3",
        href: repository + "/releases/download/editor-v1.2.3/blyx-language-1.2.3.vsix",
    },
    {
        heading: "Run a file",
        body: "Open a .blyx file and choose Blyx: Run File. The bundled interpreter runs locally and writes to the Blyx output channel.",
        label: "Editor walkthrough",
        href: guideLink("editor"),
    },
    {
        heading: "Extension registries",
        body: "Each registry displays its currently published version. Use the release download above to install 1.2.3 directly.",
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
