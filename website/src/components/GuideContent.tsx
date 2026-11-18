import Runner from "./Runner";
import { playLink } from "@/lib/site";
import type { Guide } from "@/lib/handbook";
import samples from "@/lib/samples.json";

export default function GuideContent({
    guide,
    print = false,
}: {
    guide: Guide;
    print?: boolean;
}) {
    const sample = samples.find((item) => item.id === guide.example);
    const exercise = guide.exercise;
    const Heading = print ? "h3" : "h2";
    const solution = (
        <>
            <p>{exercise.answer}</p>
            {exercise.edits?.map(([from, to]) => (
                <div key={from} className="solution-edit">
                    <p>Find</p>
                    <pre>
                        <code>{from}</code>
                    </pre>
                    <p>Replace with</p>
                    <pre>
                        <code>{to}</code>
                    </pre>
                </div>
            ))}
            {exercise.expected !== undefined && (
                <>
                    <p>Output after the change</p>
                    <pre>{exercise.expected.trimEnd()}</pre>
                </>
            )}
        </>
    );
    return (
        <>
            {guide.sections.map((section, i) => (
                <section
                    id={guide.slug + "-section-" + (i + 1)}
                    key={section.heading}
                >
                    <Heading>{section.heading}</Heading>
                    <p>{section.text}</p>
                    {section.command && (
                        <pre>
                            <code>{section.command}</code>
                        </pre>
                    )}
                    {section.table && (
                        <div className="table-box">
                            <table aria-label={section.heading}>
                                <thead>
                                    <tr>
                                        {section.table.columns.map((column) => (
                                            <th scope="col" key={column}>
                                                {column}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {section.table.rows.map((row) => (
                                        <tr key={row[0]}>
                                            {row.map((cell, j) =>
                                                j === 0 ? (
                                                    <th scope="row" key={j}>
                                                        {cell}
                                                    </th>
                                                ) : (
                                                    <td key={j}>{cell}</td>
                                                ),
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            ))}
            {sample && (
                <section>
                    <Heading>
                        {print ? "Worked program" : "Try the program"}
                    </Heading>
                    {print ? (
                        <>
                            <pre>
                                <code>{sample.code.trimEnd()}</code>
                            </pre>
                            <p>Expected output</p>
                            <pre>{sample.expected.trimEnd()}</pre>
                        </>
                    ) : (
                        <>
                            <Runner
                                code={sample.code}
                                filename={sample.file}
                                practiceOutput={exercise.expected}
                            />
                            <details className="lesson-disclosure">
                                <summary>Expected output</summary>
                                <pre>{sample.expected.trimEnd()}</pre>
                            </details>
                            <a href={playLink(sample.id)}>
                                Open in the full playground →
                            </a>
                        </>
                    )}
                </section>
            )}
            <section className="lesson-exercise">
                <Heading>Practice</Heading>
                <p>{exercise.prompt}</p>
                {print ? (
                    <>
                        <h4>Hint</h4>
                        <p>{exercise.hint}</p>
                        <h4>Solution</h4>
                        {solution}
                    </>
                ) : (
                    <>
                        <details className="lesson-disclosure">
                            <summary>Hint</summary>
                            <p>{exercise.hint}</p>
                        </details>
                        <details className="lesson-disclosure">
                            <summary>Worked solution</summary>
                            {solution}
                        </details>
                    </>
                )}
            </section>
        </>
    );
}
