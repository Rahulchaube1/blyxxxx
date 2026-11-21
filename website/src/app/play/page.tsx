import { pageMetadata } from "@/lib/metadata";
import { website } from "@/lib/site";
import Runner from "@/components/Runner";
import ExamplePicker from "./picker";
import samples from "@/lib/samples.json";
export const metadata = pageMetadata(
    "Blyx playground",
    "Write and run Blyx code in your browser with the WebAssembly interpreter. Edit an example and see its output as you type.",
    website + "/play",
);
export default async function Playground({
    searchParams,
}: {
    searchParams: Promise<{ example?: string }>;
}) {
    const { example } = await searchParams;
    const active = samples.find((s) => s.id === example) ?? samples[0];
    return (
        <main className="wrap">
            <header className="page-head">
                <h1>Blyx playground</h1>
                <p>
                    Edit a program and see the result as you type. Execution
                    stays in your browser.
                </p>
            </header>
            <ExamplePicker id={active.id} samples={samples.map(({ id, title }) => ({ id, title }))} />
            <div className="block">
                <h2>{active.title}</h2>
                <p className="subtle">{active.description}</p>
            </div>
            <Runner key={active.id} code={active.code} filename={active.file} />
        </main>
    );
}
