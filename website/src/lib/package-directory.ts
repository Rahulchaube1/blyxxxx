import flightdeck from "./flightdeck.json";
import catalog from "./packages.json";
import type { PackageCategory } from "./package-categories";

export function packageDirectory(category?: PackageCategory) {
    const packages = catalog.packages
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
            documentation: "/packages/" + p.slug,
            flightdeck: false,
            guide: p.guide,
            example: p.example,
            search: [...new Set(
                [p.title, p.category, p.kind, p.group, p.description, p.contract, ...p.api.flat()]
                    .join(" ").toLowerCase().split(/\s+/),
            )].join(" "),
        }));
    if (category === "library") return packages;
    const workflows = flightdeck.map((tool) => ({
        slug: "fd_" + tool.slug.replaceAll("-", "_"),
        title: tool.slug, category: "framework", kind: "Flightdeck workflow",
        version: "0.1.0", group: tool.group, description: tool.description,
        logo: "/flightdeck/" + tool.slug + ".png",
        documentation: "/frameworks/flightdeck#" + tool.slug,
        flightdeck: true, guide: "", example: "",
        search: [tool.slug, tool.description, tool.group, ...tool.inputs, ...tool.outputs, "Flightdeck GPU Vulkan CPU"].join(" ").toLowerCase(),
    }));
    return [...packages, ...workflows];
}

export type DirectoryEntry = ReturnType<typeof packageDirectory>[number];
