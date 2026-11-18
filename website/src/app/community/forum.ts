export const boards = {
    questions: { label: "Questions", prompt: "Get help with Blyx code, tools, and examples." },
    suggestions: { label: "Suggestions", prompt: "Propose a change and describe the problem it would solve." },
    feedback: { label: "Feedback", prompt: "Tell us what worked or where you got stuck using Blyx." },
    general: { label: "General", prompt: "Talk about projects, experiments, and ideas with other Blyx users." },
} as const;

export type Board = keyof typeof boards;
export function isBoard(value: unknown): value is Board {
    return typeof value === "string" && Object.hasOwn(boards, value);
}

export function isPostId(value: unknown): value is string {
    return typeof value === "string" && /^\d{13}-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(value);
}

export function forumLink(board: Board, topic?: string, cursor?: string) {
    const query = new URLSearchParams({ board });
    if (topic) query.set("topic", topic);
    if (cursor) query.set("cursor", cursor);
    return "/community?" + query;
}

export type Post = {
    id: string;
    name: string;
    tag: string;
    body: string;
    title?: string;
    published: string;
};
