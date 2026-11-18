import { guideLink, mainLink } from "@/lib/site";
import ResourcePage from "@/components/ResourcePage";
export const metadata = {
    title: "Learn Blyx",
    description:
        "Start with a program you can change, then work through the parts of the language you need.",
};
const sections = [
    {
        heading: "Write your first program",
        body: "Print a greeting, add an expression and read the output directly in the guide.",
        label: "Start the tutorial",
        href: guideLink("first-program"),
    },
    {
        heading: "Work with data",
        body: "Learn how vector lengths, indices and reductions fit together before fitting a simple model.",
        label: "Explore numerical vectors",
        href: guideLink("vectors"),
    },
    {
        heading: "Practice with examples",
        body: "Choose from control flow, numerical algorithms and introductory machine learning. Every example includes editable source.",
        label: "Browse examples",
        href: mainLink("/examples"),
    },
    {
        heading: "Move to your terminal",
        body: "Install blyxc, create a project, and use check, run and build on your own files.",
        label: "Install Blyx",
        href: guideLink("installation"),
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
