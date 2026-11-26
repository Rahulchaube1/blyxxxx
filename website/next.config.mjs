import { readFileSync } from "node:fs";
const legacy = JSON.parse(
    readFileSync(new URL("./legacy-book.json", import.meta.url), "utf8"),
);
const docs = "https://doc.blyx-lang.space";
const nestOrigin = "https://rahulchaube1.github.io/blyx-nest";
const book = process.env.NEXT_PUBLIC_BLYX_EDITION === "docs";
const config = {
    reactStrictMode: true,
    images: { unoptimized: true },
    turbopack: {},
    async rewrites() {
        if (book) return [];
        const nestHost = [{ type: "host", value: "nest\\.blyx-lang\\.space" }];
        return {
            beforeFiles: [
                { source: "/nest/:path+", destination: nestOrigin + "/:path+" },
                { source: "/", has: nestHost, destination: nestOrigin + "/index.html" },
                { source: "/:path+", has: nestHost, destination: nestOrigin + "/:path+" },
            ],
        };
    },
    async redirects() {
        const redirect = (source, destination) => ({
            source,
            destination,
            permanent: true,
        });
        const rules = Object.entries(legacy).map(([path, slug]) =>
            redirect(path, slug ? docs + "/guide/" + slug : docs + "/"),
        );
        if (!book) rules.push({ source: "/nest", destination: "/nest/index.html", permanent: false });
        rules.push(
            ...[
                "/learn/book",
                "/title-page.html",
                "/guide",
                "/toc.html",
                "/stable/book",
                "/book",
            ]
                .filter((p) => !(p in legacy))
                .map((p) => redirect(p, docs + "/")),
        );
        rules.push(
            redirect("/stable/book/:chapter.html", docs + "/:chapter.html"),
            redirect("/index.html", "/"),
            redirect("/ecosystem", book ? "https://www.blyx-lang.space/packages" : "/packages"),
            redirect("/funding", book ? "https://www.blyx-lang.space/#sponsor" : "/#sponsor"),
            redirect(
                "/playground",
                book ? "https://www.blyx-lang.space/play" : "/play",
            ),
            redirect(
                "/playground/index.html",
                book ? "https://www.blyx-lang.space/play" : "/play",
            ),
            redirect("/print.html", docs + "/guide/print"),
        );
        if (book)
            rules.push(
                redirect("/docs", "/"),
                redirect("/packages/:slug", "https://www.blyx-lang.space/packages/:slug"),
                redirect("/packages.json", "https://www.blyx-lang.space/packages.json"),
                redirect("/articles/:path*", "https://www.blyx-lang.space/articles/:path*"),
                ...[
                    "learn",
                    "download",
                    "examples",
                    "play",
                    "compiler",
                    "benchmarks",
                    "blog",
                    "community",
                    "security",
                    "packages",
                    "frameworks",
                    "frameworks/logos",
                    "libraries",
                    "libraries/logos",
                    "roadmap",
                    "about",
                    "adoption",
                    "vscode",
                ].map((p) =>
                    redirect("/" + p, "https://www.blyx-lang.space/" + p),
                ),
            );
        else
            rules.push(redirect("/guide/:slug", docs + "/guide/:slug"));
        return rules;
    },
};
export default config;
