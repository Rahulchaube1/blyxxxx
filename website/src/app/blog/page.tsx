import { pageMetadata } from "@/lib/metadata";
import { repository, release, website } from "@/lib/site";
export const metadata = pageMetadata(
    "Blyx release notes",
    "Find published Blyx releases, version history, and links to the release notes and downloads on GitHub.",
    website + "/blog",
);
type Release = {
    tag_name: string;
    name: string | null;
    published_at: string;
    html_url: string;
};
async function getReleases(): Promise<Release[] | null> {
    try {
        const r = await fetch(
            "https://api.github.com/repos/Rahulchaube1/blyxxxx/releases?per_page=12",
            {
                next: { revalidate: 300 },
                headers: { Accept: "application/vnd.github+json" },
                signal: AbortSignal.timeout(5000),
            },
        );
        if (!r.ok) return null;
        return ((await r.json()) as Release[]).filter(
            (x) =>
                x.published_at &&
                x.html_url.startsWith(repository + "/releases/"),
        );
    } catch {
        return null;
    }
}
export default async function Blog() {
    const releases = await getReleases();
    return (
        <main className="wrap">
            <header className="page-head">
                <h1>Release notes</h1>
                <p>
                    Published compiler and tooling releases from the Blyx
                    repository.
                </p>
            </header>
            <p className="block"><a href="/articles">Read the Blyx engineering articles →</a></p>
            {releases?.length ? (
                <div className="grid">
                    {releases.map((r) => (
                        <article key={r.tag_name} className="card">
                            <div className="file-label">
                                <time dateTime={r.published_at}>
                                    {r.published_at.slice(0, 10)}
                                </time>
                            </div>
                            <img alt="Blyx" src="/favicon-192.png" width="42" height="42" />
                            <h2>{r.name || r.tag_name}</h2>
                            <p>{r.tag_name}</p>
                            <a href={r.html_url}>Read release notes →</a>
                        </article>
                    ))}
                </div>
            ) : (
                <div className="card">
                    <h2>Blyx 0.2.2</h2>
                    <p>
                        The release feed is currently unavailable. The
                        documented release remains available on GitHub.
                    </p>
                    <a href={release}>Open release →</a>
                </div>
            )}
            <p className="block">
                <a href={repository + "/releases"}>All releases on GitHub ↗</a>
            </p>
        </main>
    );
}
