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
              "demos",
              "demos/tap-tempo",
              "articles/tap-tempo",
              "download",
              "vscode",
              "benchmarks",
              "packages",
              "frameworks",
              "frameworks/logos",
              "frameworks/flightdeck",
              "articles/flightdeck",
              "articles/workbench",
            "articles/vector-distance",
              "libraries",
              "libraries/logos",
              ...catalog.packages.map((p) => "packages/" + p.slug),
              "articles",
              "articles/blyx-direct",
              "articles/blyxtorch-portable-training",
              "articles/training-in-factors",
              "blog",
              "about",
              "adoption",
              "security",
              "compiler",
              "roadmap",
              "community",
          ].map((s) => website + "/" + s);
    return urls.map((url) => ({ url }));
}
