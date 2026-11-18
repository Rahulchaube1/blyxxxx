import guides from "@/lib/guides.json";
import samples from "@/lib/samples.json";
export const metadata = { title: "Printable Blyx guide" };
export default function Print() {
    return (
        <main className="wrap prose">
            <h1>The Blyx guide</h1>
            <p>Blyx 0.2.0 · Print edition</p>
            {guides.map((g) => {
                const s = samples.find((s) => s.id === g.example);
                return (
                    <article className="block" key={g.slug}>
                        <h2>{g.title}</h2>
                        <p>{g.summary}</p>
                        {g.sections.map((p) => (
                            <section key={p.heading}>
                                <h3>{p.heading}</h3>
                                <p>{p.text}</p>
                                {"command" in p && <pre>{p.command}</pre>}
                            </section>
                        ))}
                        {s && <pre>{s.code}</pre>}
                    </article>
                );
            })}
        </main>
    );
}
