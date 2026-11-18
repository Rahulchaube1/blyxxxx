import { guideLink, mainLink, repository } from "@/lib/site";
import Runner from "@/components/Runner";
import samples from "@/lib/samples.json";
import ResourcePage from "@/components/ResourcePage";
export const metadata = { title: "Compiler and runtime" };
const sections = [
    {
        heading: "Parse a source file",
        body: "blyxc check tokenizes the source and parses the Blyx syntax tree. Parser diagnostics point to a line and column. Checking syntax does not evaluate the file.",
        label: "CLI commands",
        href: guideLink("projects"),
    },
    {
        heading: "Interpret the program",
        body: "blyxc run starts a parameterless main and evaluates the syntax tree. The browser playground uses this same interpreter compiled to WebAssembly inside a worker.",
        label: "Run a program",
        href: mainLink("/play"),
    },
    {
        heading: "Build for the host",
        body: "blyxc build lowers the synchronous typed subset to Rust, then invokes rustc and the platform linker. The output is a standalone executable.",
        label: "Native build guide",
        href: guideLink("native-builds"),
    },
    {
        heading: "Explore compiler research",
        body: "The repository also contains experimental semantic analysis and BIR/SSA work. The released native build path uses the Rust lowering backend.",
        label: "Browse compiler source",
        href: repository + "/tree/blyx-main/compiler",
    },
];
export default function Page() {
    return (
        <ResourcePage
            title="Compiler and runtime"
            intro="The Blyx frontend feeds two execution paths. Choose the interpreter for quick feedback or compile a typed program for native execution."
            sections={sections}
        >
            <section>
                <h2>Check a program’s syntax</h2>
                <p className="subtle">
                    Edit the source to see live parser diagnostics.
                </p>
                <Runner
                    code={samples.find((s) => s.id === "hello")!.code}
                    filename="main.blyx"
                    checkOnly
                />
            </section>
        </ResourcePage>
    );
}
