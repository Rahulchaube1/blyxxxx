import data from "./guides.json";

export type GuideSection = {
    heading: string;
    text: string;
    command?: string;
    table?: { columns: string[]; rows: string[][] };
};
export type Guide = {
    slug: string;
    title: string;
    group: string;
    summary: string;
    example: string | null;
    sections: GuideSection[];
    exercise: {
        prompt: string;
        hint: string;
        answer: string;
        edits?: string[][];
        expected?: string;
    };
};
export const guides: Guide[] = data;
export const stages = [
    [
        "First steps",
        "Start in your browser. Write a greeting, calculate a result, and print it.",
    ],
    [
        "Language essentials",
        "Build small programs from bindings, decisions, functions and loops.",
    ],
    [
        "Numerical programming",
        "Use vectors to summarize data, fit a line and evaluate predictions.",
    ],
    [
        "Practical projects",
        "Build a sensor report, test edge cases and evaluate models with published Blyx libraries.",
    ],
    [
        "Local toolchain",
        "Move to a local project, diagnose a failure and build a native executable.",
    ],
    [
        "Language reference",
        "Look up syntax, operators, built-ins, commands and release limits.",
    ],
] as const;
