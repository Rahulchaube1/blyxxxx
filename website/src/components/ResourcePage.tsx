export type Resource = {
    heading: string;
    body: string;
    label: string;
    href: string;
};
export default function ResourcePage({
    title,
    intro,
    sections,
    children,
}: {
    title: string;
    intro: string;
    sections: Resource[];
    children?: React.ReactNode;
}) {
    return (
        <main className="wrap">
            <header className="page-head">
                <h1>{title}</h1>
                <p>{intro}</p>
            </header>
            {children}
            <div className="prose">
                {sections.map((s) => (
                    <section key={s.heading}>
                        <h2>{s.heading}</h2>
                        <p>{s.body}</p>
                        <a href={s.href}>{s.label} →</a>
                    </section>
                ))}
            </div>
        </main>
    );
}
