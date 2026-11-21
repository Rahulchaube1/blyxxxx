import catalog from "./packages.json";

export function packageDirectory(frameworksOnly = false) {
    return catalog.packages
        .filter((item) => !frameworksOnly || item.kind.toLowerCase().includes("framework"))
        .map((p) => ({
            slug: p.slug,
            title: p.title,
            kind: p.kind,
            version: p.version,
            description: p.description,
            group: p.group,
            logo: p.logo,
            guide: p.guide,
            example: p.example,
            search: [...new Set(
                [p.title, p.kind, p.group, p.description, p.contract, ...p.api.flat()]
                    .join(" ").toLowerCase().split(/\s+/),
            )].join(" "),
        }));
}

export type DirectoryEntry = ReturnType<typeof packageDirectory>[number];
