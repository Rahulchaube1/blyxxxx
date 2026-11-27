import samples from "@/lib/samples.json";
export const dynamic = "force-static";
export const dynamicParams = false;
export function generateStaticParams() { return samples.map(s => ({ id:s.id })); }
export async function GET(_request: Request, { params }: {params: Promise<{id:string}>}) {
    const {id}=await params;
    const example=samples.find(s=>s.id===id);
    if (!example) return new Response(null,{status:404});
    return new Response(example.code,{headers:{"Content-Type":"text/plain; charset=utf-8","Content-Disposition":'attachment; filename="'+encodeURIComponent(example.id)+'.blyx"'}});
}
