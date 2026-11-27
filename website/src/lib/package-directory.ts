import flightdeck from "./flightdeck.json";
import workbench from "./workbench.json";
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
            flightdeck: false, workbench: false, repository: "", downloadVersion: "",
            guide: p.guide,
            example: p.example,
            search: [...new Set(
                [p.title, p.category, p.kind, p.group, p.description, p.contract, ...p.api.flat()]
                    .join(" ").toLowerCase().split(/\s+/),
            )].join(" "),
        }));
    const additions = workbench.filter((p) => !category || p.kind === category).map((p) => ({
        ...p, category: p.kind, version: "0.1.0", logo: "/workbench/" + p.slug + ".png?v=" + (p.art ?? p.version),
        documentation: "https://nest.blyx-lang.space/packages/" + p.slug + ".html",
        flightdeck: false, workbench: true, guide: "", example: "",
        search: [p.slug, p.title, p.kind, p.group, p.description, "workbench"].join(" ").toLowerCase(),
    }));
    if (category === "library") return [...packages, ...additions];
    const workflows = flightdeck.map((tool) => ({
        slug: "fd_" + tool.slug.replaceAll("-", "_"),
        title: tool.slug, category: "framework", kind: "Flightdeck workflow",
        version: "0.1.1", group: tool.group, description: tool.description,
        logo: "/flightdeck/" + tool.slug + ".png?v=" + tool.art,
        documentation: "/frameworks/flightdeck#" + tool.slug,
        flightdeck: true, workbench: false, repository: "", downloadVersion: "", guide: "", example: "",
        search: [tool.slug, "fd_" + tool.slug.replaceAll("-", "_"), tool.description, tool.group, ...tool.inputs, ...tool.outputs, "Flightdeck GPU Vulkan CPU"].join(" ").toLowerCase(),
    }));
    return [...packages, ...workflows, ...additions];
}

export type DirectoryEntry = ReturnType<typeof packageDirectory>[number];
