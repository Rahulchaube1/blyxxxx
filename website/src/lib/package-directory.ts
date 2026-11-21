import catalog from "./packages.json";
import type { PackageCategory } from "./package-categories";

export function packageDirectory(category?: PackageCategory) {
    return catalog.packages
        .filter((item) => !category || item.category === category)
        .map((p) => ({
            slug: p.slug,
            title: p.title,
            kind: p.kind,
            category: p.category,
            version: p.version,
            description: p.description,
            group: p.group,
            logo: p.logo,
            guide: p.guide,
            example: p.example,
            search: [...new Set(
                [p.title, p.category, p.kind, p.group, p.description, p.contract, ...p.api.flat()]
                    .join(" ").toLowerCase().split(/\s+/),
            )].join(" "),
        }));
}

export type DirectoryEntry = ReturnType<typeof packageDirectory>[number];
