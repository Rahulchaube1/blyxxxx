import catalog from "@/lib/packages.json";
import { website } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
    return Response.json({
        schemaVersion: catalog.schemaVersion,
        compiler: catalog.compiler,
        license: catalog.license,
        packages: catalog.packages.map((p) => ({
            name: "blyx-" + p.slug,
            version: p.version,
            commit: p.commit,
            repository: p.repository,
            release: p.release,
            module: p.module + ".blyx",
            description: p.description,
            cli: p.cli ? p.slug : null,
            logo: website + p.logo,
            documentation: website + "/packages/" + p.slug,
            playground: website + "/play?example=" + p.example,
        })),
    });
}
