import catalog from "@/lib/packages.json";
import { website } from "@/lib/site";

export const metadata = {
    title: "Blyx library logos",
    description: "Browse the Blyx penguin illustrations for every library and download the transparent PNGs.",
    alternates: { canonical: website + "/libraries/logos" },
};

export default function LibraryLogos() {
    const libraries = catalog.packages
        .filter((p) => p.category === "library")
        .sort((a, b) => a.title.localeCompare(b.title, "en"));

    return (
        <main className="wrap directory-page">
            <header className="page-head">
                <a className="crumb" href="/libraries">← Blyx libraries</a>
                <h1>Blyx library logos</h1>
                <p>Each penguin illustrates a task you can do with that library. Choose a name to see an example.</p>
                <div className="actions">
                    <a className="button" href="/blyx-library-logos.zip" download>Download all {libraries.length} logos (ZIP)</a>
                </div>
            </header>
            <ul className="library-logo-grid" aria-label="Library logos">
                {libraries.map((p) => (
                    <li className="library-logo-card" key={p.slug}>
                        <a href={"/packages/" + p.slug}>
                            <img src={p.logo} alt={p.logoAlt} width="144" height="144" loading="lazy" decoding="async" />
                            <span>{p.title}</span>
                        </a>
                        <a className="library-logo-download" href={p.logo} download={p.slug + ".png"} aria-label={"Download " + p.title + " logo as a PNG"}>Download PNG</a>
                    </li>
                ))}
            </ul>
        </main>
    );
}
