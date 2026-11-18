import { repository } from "@/lib/site";
import ResourcePage from "@/components/ResourcePage";
export const metadata = {
    title: "Blyx community",
    description:
        "Rahul Chaube leads the Blyx project. Ujjwal Chaudhury is a core contributor. Development, proposals and issue tracking take place in the project repository.",
};
const sections = [
    {
        heading: "Contribute a change",
        body: "Build the workspace, reproduce the issue you want to address and follow the contribution guide when preparing a change.",
        label: "Contribution guide",
        href: repository + "/blob/blyx-main/CONTRIBUTING.md",
    },
    {
        heading: "Report a bug",
        body: "Include your Blyx version, the smallest program that demonstrates the problem, the command you used, and the observed output.",
        label: "Open the issue tracker",
        href: repository + "/issues",
    },
    {
        heading: "Discuss a language feature",
        body: "Review the existing language proposals before opening a design discussion.",
        label: "Browse proposals",
        href: repository + "/tree/blyx-main/RFC",
    },
    {
        heading: "Community standards",
        body: "The code of conduct describes how participants are expected to work together.",
        label: "Read the code of conduct",
        href: repository + "/blob/blyx-main/CODE_OF_CONDUCT.md",
    },
    {
        heading: "Support development",
        body: "The project accepts community sponsorship through its existing funding page.",
        label: "Support Blyx",
        href: "https://buymeacoffee.com/rahulchaube",
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
