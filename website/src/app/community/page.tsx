import { cache } from "react";
import Link from "next/link";
import { pageMetadata } from "@/lib/metadata";
import { notFound } from "next/navigation";
import { repository, website } from "@/lib/site";
import { boards, forumLink, isBoard, isPostId, type Board, type Post } from "./forum";
import { Composer, LiveUpdates } from "./composer";
import { getPage, getPost } from "./storage";
import "./community.css";

export const dynamic = "force-dynamic";
type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };
const readTopic = cache(getPost);
const communityDescription = "Ask questions about Blyx, propose changes, and share feedback with other language users.";

export async function generateMetadata({ searchParams }: Props) {
    const params = await searchParams;
    const board = params.board ?? "questions";
    const { topic, cursor } = params;
    if (!isBoard(board) || (topic !== undefined && !isPostId(topic)) ||
        (cursor !== undefined && (typeof cursor !== "string" || cursor.length > 2048))) return {};
    const url = board === "questions" && !topic && !cursor ? "/community" : forumLink(board, topic, cursor);
    const post = topic ? await readTopic(board, topic).catch(() => null) : null;
    const title = post?.title ?? (board === "questions" ? "Blyx community" : boards[board].label + " · Blyx Community");
    return pageMetadata(title, post?.body.trim().slice(0, 160) || (board === "questions" ? communityDescription : boards[board].prompt), website + url);
}

function Byline({ post }: { post: Post }) {
    const date = new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }).format(new Date(post.published));
    return <p className="byline"><strong>{post.name}</strong> <span title="Guest ID">#{post.tag}</span><span aria-hidden="true"> · </span><time dateTime={post.published}>{date} UTC</time></p>;
}

function Resources() {
    return (
        <aside className="forum-resources" aria-label="Community resources">
            <h2>Project resources</h2>
            <a href="https://discord.gg/ZPNWqNsvC">Join the Blyx Language Discord ↗</a>
            <a href="https://nest.blyx-lang.space/">Browse packages on Blyx Nest ↗</a>
            <a href={repository + "/issues"}>Report a compiler bug ↗</a>
            <a href={repository + "/tree/blyx-main/RFC"}>Language proposals ↗</a>
            <a href={repository + "/blob/blyx-main/CONTRIBUTING.md"}>Contribution guide ↗</a>
            <a href={repository + "/blob/blyx-main/CODE_OF_CONDUCT.md"}>Code of conduct ↗</a>
            <a href="mailto:conduct@blyx-lang.space">Report a community concern</a>
            <a href="https://buymeacoffee.com/rahulchaube">Support Blyx ↗</a>
        </aside>
    );
}

export default async function Community({ searchParams }: Props) {
    const params = await searchParams;
    const board = params.board ?? "questions", topic = params.topic, cursor = params.cursor;
    if (!isBoard(board) || (topic !== undefined && !isPostId(topic)) ||
        (cursor !== undefined && (typeof cursor !== "string" || cursor.length > 2048))) notFound();
    let parent: Post | null = null;
    let page: Awaited<ReturnType<typeof getPage>> | undefined;
    try {
        if (topic) parent = await readTopic(board, topic);
        if (!topic || parent) page = await getPage(board, topic, cursor);
    } catch (error) {
        console.error("Blyx community read failed", error instanceof Error ? error.name : "unknown");
        return <main className="wrap"><header className="page-head"><h1>Blyx community</h1><p>We couldn’t load these discussions. Please try again.</p><a href={forumLink(board, topic)}>Reload discussions</a></header></main>;
    }
    if (!page) notFound();
    return (
        <main className="wrap community">
            <header className="page-head">
                {topic ? <><Link href={forumLink(board)}>← Back to {boards[board].label.toLowerCase()}</Link><h1>{parent!.title}</h1></> :
                    <><h1>Blyx community</h1><p>Ask about a Blyx program, suggest a language change, or tell other developers what you learned.</p></>}
            </header>
            <div className="forum-layout"><div className="forum-main">
                {!topic && <nav className="forum-tabs" aria-label="Discussion boards">
                    {(Object.keys(boards) as Board[]).map(key => <Link href={forumLink(key)} key={key} aria-current={board === key ? "page" : undefined}>{boards[key].label}</Link>)}
                </nav>}
                {parent ? <article className="forum-original"><Byline post={parent} /><p className="post-body">{parent.body}</p></article> :
                    <div className="board-intro"><h2>{boards[board].label}</h2><p>{boards[board].prompt}</p></div>}
                <details className="forum-compose" key={board + (topic || "")}>
                    <summary>{topic ? "Write a reply" : "Start a discussion"}</summary>
                    <Composer board={board} topic={topic} serverTime={Date.now()} />
                </details>
                <section aria-label={topic ? "Replies" : "Discussions"}>
                    {topic && <h2 className="reply-heading">Replies</h2>}
                    {page.posts.length === 0 ? <div className="forum-empty">
                        <h3>{cursor ? "End of this page" : topic ? "No replies yet" : "No discussions yet"}</h3>
                        <p>{cursor ? "Return to the newest posts." : topic ? "Add your experience or a follow-up question." : "Start the first conversation on this board."}</p>
                    </div> :
                        <ol className="forum-posts">{page.posts.map(post => <li key={post.id} id={"post-" + post.id}>
                            {!topic && <h3><Link href={forumLink(board, post.id)}>{post.title}</Link></h3>}
                            <Byline post={post} />
                            {topic && <p className="post-body">{post.body}</p>}
                        </li>)}</ol>}
                    <nav className="forum-pages" aria-label="Discussion pages">
                        {cursor && <Link href={forumLink(board, topic)}>Newest {topic ? "replies" : "discussions"}</Link>}
                        {page.next && <Link href={forumLink(board, topic, page.next)}>Older {topic ? "replies" : "discussions"} →</Link>}
                    </nav>
                </section>
                {!cursor && <LiveUpdates />}
            </div><Resources /></div>
        </main>
    );
}
