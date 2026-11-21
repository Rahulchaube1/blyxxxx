import catalog from "@/lib/packages.json";
import { guideLink, website } from "@/lib/site";

export const metadata = {
    title: "Blyx frameworks",
    description: "Choose a Blyx framework by the project you want to build, from web APIs and CSV imports to neural networks and games.",
    alternates: { canonical: website + "/frameworks" },
};

export default function Frameworks() {
    const frameworks = catalog.packages.filter((item) => item.kind.toLowerCase().includes("framework"));
    const featured = frameworks.filter((item) => item.workflow);
    const others = frameworks.filter((item) => !item.workflow);
    return (
        <main className="wrap">
            <header className="page-head">
                <a className="crumb" href="/packages">← Blyx ecosystem</a>
                <h1>Blyx frameworks</h1>
                <p>Choose a project, run its example, then import the same Blyx code into your application.</p>
            </header>
            <section className="grid package-grid" aria-label="Framework projects">
                {[...featured, ...others].map((item) => (
                    <article className="card package-card" key={item.slug}>
                        <div className="package-heading">
                            <img className="package-logo" src={item.logo} alt="" width="54" height="54" />
                            <div><small>{item.group}</small><h2><a href={"/packages/" + item.slug}>{item.title}</a></h2></div>
                        </div>
                        <p>{item.description}</p>
                        <a href={guideLink(item.guide)}>{item.workflow?.title ?? "Open the tutorial"} →</a>
                    </article>
                ))}
            </section>
        </main>
    );
}
