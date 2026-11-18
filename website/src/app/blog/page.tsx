import { repository, release } from "@/lib/site";
export const metadata = { title: "Release notes" };
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
            {releases?.length ? (
                <div className="grid">
                    {releases.map((r) => (
                        <article key={r.tag_name} className="card">
                            <div className="file-label">
                                <time dateTime={r.published_at}>
                                    {r.published_at.slice(0, 10)}
                                </time>
                            </div>
                            <h2>{r.name || r.tag_name}</h2>
                            <p>{r.tag_name}</p>
                            <a href={r.html_url}>Read release notes →</a>
                        </article>
                    ))}
                </div>
            ) : (
                <div className="card">
                    <h2>Blyx 0.2.0</h2>
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
