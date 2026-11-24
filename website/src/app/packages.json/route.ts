import { condaSource, sourceCollectionArchive } from "@/lib/source-channel";
import catalog from "@/lib/packages.json";
import { website } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
    return Response.json({
        schemaVersion: catalog.schemaVersion,
        compiler: catalog.compiler,
        license: catalog.license,
        packages: catalog.packages.map((p) => {
            const conda = condaSource(p);
            return {
                name: p.name ?? "blyx-" + p.slug,
                kind: p.category,
                version: p.version,
                commit: p.commit,
                repository: p.repository,
                release: p.release,
                module: p.module + ".blyx",
                conda,
                ...(conda && { sourceCollection: { archive: sourceCollectionArchive, directory: "share/blyx/" + p.slug } }),
                description: p.description,
                cli: (p.cli || p.collection?.libraries.length) ? p.slug : null,
                ...(p.collection && {
                    family: p.collection.family,
                    libraries: p.collection.libraries.map((lib) => lib.slug),
                    sourceDownload: p.repository + "/archive/refs/tags/v" + p.version + ".zip",
                    sourceBundle: website + "/downloads/blyx-ecosystem-source.zip",
                    sourceBundleVersion: "0.1.0",
                }),
                logo: website + p.logo,
                ...(p.workflow && {
                    project: { title: p.workflow.title, source: p.workflow.source, tutorial: "https://doc.blyx-lang.space/guide/" + p.guide },
                    downloads: p.workflow.downloads,
                    checksums: p.workflow.checksums,
                }),
                ...(p.editor && { editor: p.editor }),
                ...(p.projects && { projects: p.projects.map((project) => ({
                    title: project.title, source: project.source, playground: website + "/play?example=" + project.id,
                })) }),
                documentation: website + "/packages/" + p.slug,
                playground: website + "/play?example=" + p.example,
            };
        }),
    });
}
