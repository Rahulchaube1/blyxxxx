import Catalog from "./catalog";
import samples from "@/lib/samples.json";
export const metadata = { title: "Runnable examples" };
export default function Examples() {
    return (
        <main className="wrap">
            <header className="page-head">
                <h1>Example library</h1>
                <p>
                    Explore Blyx programs you can edit in the playground or
                    build locally.
                </p>
            </header>
            <Catalog samples={samples.map(({ id, title, category, description, file }) => ({ id, title, category, description, file }))} />
        </main>
    );
}
