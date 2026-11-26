import { pageMetadata } from "@/lib/metadata";
import { guideLink, mainLink, repository, website } from "@/lib/site";
import Runner from "@/components/Runner";
import samples from "@/lib/samples.json";
import ResourcePage from "@/components/ResourcePage";
export const metadata = pageMetadata(
    "Blyx compiler and runtime",
    "See how blyxc parses, interprets and compiles Blyx programs. Try the interpreter and follow the native build guide.",
    website + "/compiler",
);
const sections = [
    {
        heading: "Compile directly with Blyx",
        body: "Blyx Direct 0.1.0 is written in Blyx. It reads a .blyx file and writes an x86-64 executable for Windows or Linux. The download can rebuild its own source with no external compiler or linker. Use it for integer, Boolean and control-flow programs.",
        label: "Build and verify a program",
        href: guideLink("native-builds"),
    },
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
        heading: "Build numerical programs with 0.2.1",
        body: "The 0.2.1 driver builds a wider subset, including floating-point arithmetic, vectors and imported modules. Its native build command generates Rust and uses rustc and the host linker.",
        label: "Native build guide",
        href: guideLink("native-builds"),
    },
    {
        heading: "Explore compiler research",
        body: "Read the self-hosted compiler, including its lexer, type checks, x86-64 emitter and executable headers. The repository also contains the earlier Rust-based frontend and experimental BIR/SSA work.",
        label: "Browse compiler source",
        href: repository + "/tree/blyx-main/compiler",
    },
];
export default function Page() {
    return (
        <ResourcePage
            title="Compiler and runtime"
            intro="Try a program in the interpreter, build an executable, or rebuild the compiler itself. Choose the toolchain that supports your source and platform."
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
