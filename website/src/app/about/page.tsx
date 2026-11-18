import { guideLink, mainLink, repository } from "@/lib/site";
import ResourcePage from "@/components/ResourcePage";
export const metadata = {
    title: "About Blyx",
    description:
        "Blyx is an open-source experimental programming language created by Rahul Chaube. Its own lexer, parser and runtime support the same source files in the browser, desktop editor and terminal.",
};
const sections = [
    {
        heading: "How a program runs",
        body: "The CLI interprets the Blyx syntax tree. A WebAssembly build of the interpreter powers the playground and the editor extension. A separate backend compiles the typed subset into host executables.",
        label: "Compiler architecture",
        href: mainLink("/compiler"),
    },
    {
        heading: "Language design",
        body: "The project explores numerical computing and systems programming. The released numerical features are CPU-based f64 vectors and scalar operations.",
        label: "Release capabilities",
        href: guideLink("compatibility"),
    },
    {
        heading: "Source and licensing",
        body: "The compiler and language source live in the public Blyx repository under the MIT or Apache 2.0 license.",
        label: "Browse the repository",
        href: repository,
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
