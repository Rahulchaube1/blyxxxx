import { pageMetadata } from "@/lib/metadata";
import { website } from "@/lib/site";
import Catalog from "./catalog";
import samples from "@/lib/samples.json";
export const metadata = pageMetadata(
    "Blyx code examples",
    "Run and edit Blyx examples for functions, loops, numerical computing, frameworks and libraries in the browser playground.",
    website + "/examples",
);
export default function Examples() {
    return (
        <main className="wrap">
            <header className="page-head">
                <h1>Blyx code examples</h1>
                <p>
                    Explore Blyx programs you can edit in the playground or
                    build locally.
                </p>
            </header>
            <Catalog samples={samples.map(({ id, title, category, description, file }) => ({ id, title, category, description, file }))} />
        </main>
    );
}
