import { guideLink, mainLink } from "@/lib/site";
export default function NotFound() {
    return (
        <main className="wrap">
            <header className="page-head">
                <h1>Page not found</h1>
                <p>
                    Find the topic in the Blyx guide or start with a runnable
                    example.
                </p>
            </header>
            <div className="actions">
                <a className="button" href={guideLink()}>
                    Browse documentation
                </a>
                <a href={mainLink("/examples")}>Example library</a>
            </div>
        </main>
    );
}
