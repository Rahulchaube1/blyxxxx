import type { MetadataRoute } from "next";
import guides from "@/lib/guides.json";
import catalog from "@/lib/packages.json";
import { docs, website, bookEdition } from "@/lib/site";
export default function sitemap(): MetadataRoute.Sitemap {
    const urls = bookEdition
        ? [docs + "/", docs + "/guide/print", ...guides.map((g) => docs + "/guide/" + g.slug)]
        : [
              "",
              "learn",
              "docs",
              "play",
              "examples",
              "download",
              "vscode",
              "benchmarks",
              "packages",
              "frameworks",
              "libraries",
              ...catalog.packages.map((p) => "packages/" + p.slug),
              "blog",
              "about",
              "security",
              "compiler",
              "roadmap",
              "community",
          ].map((s) => website + "/" + s);
    return urls.map((url) => ({ url }));
}
