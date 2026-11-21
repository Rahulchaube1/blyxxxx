import PackageCatalog from "@/components/PackageCatalog";
import { packageDirectory } from "@/lib/package-directory";
import { repository, website } from "@/lib/site";

export const metadata = {
    title: "Blyx frameworks",
    description: "Find a Blyx workflow by domain, try its example in the playground, and download its native CLI or source.",
    alternates: { canonical: website + "/frameworks" },
};

export default function Frameworks() {
    const frameworks = packageDirectory(true);
    return (
        <main className="wrap">
            <header className="page-head">
                <a className="crumb" href="/packages">← Blyx ecosystem</a>
                <h1>Blyx frameworks</h1>
                <p>Choose a project, run its example, then import the same Blyx code into your application.</p>
                <div className="actions">
                    <a className="button" href={repository + "/releases/tag/ecosystem-v0.1.0"}>Download native workflow CLIs</a>
                    <a href="/downloads/blyx-ecosystem-0.1.0-source.zip" download>Get the workflow collection source</a>
                </div>
            </header>
            <PackageCatalog items={frameworks} frameworks />
        </main>
    );
}
