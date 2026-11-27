"use client";
import { useState } from "react";
type Tool = {slug:string;group:string;description:string;inputs:string[];outputs:string[];bird:string};
const repo = "https://github.com/Rahulchaube1/blyx-flightdeck/blob/v0.1.0/";
export default function Browser({tools}:{tools:Tool[]}) {
    const [query,setQuery]=useState("");
    const [group,setGroup]=useState("");
    const groups=[...new Set(tools.map(t=>t.group))];
    const matches=tools.filter(t=>(!group || t.group===group) && query.trim().toLowerCase().split(/\s+/).every(q=>[t.slug,t.description,t.group,...t.inputs,...t.outputs].join(" ").toLowerCase().includes(q)));
    return <section><div className="filters">
        <label>Find a workflow<input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Try attention, quantization or gradient" /></label>
        <label>Training task<select value={group} onChange={e=>setGroup(e.target.value)}><option value="">All tasks</option>{groups.map(g=><option key={g}>{g}</option>)}</select></label>
        <span role="status">{matches.length} workflows</span>
    </div><div className="grid package-grid">{matches.map(t=><article id={t.slug} className="card package-card" key={t.slug}>
        <div className="package-heading"><img className="package-logo" src={"/flightdeck/"+t.slug+".png"} width="64" height="64" alt="" loading="lazy" /><div><small>{t.group}</small><h2 style={{fontSize:"1.25rem",overflowWrap:"anywhere"}}>{t.slug}</h2></div></div><p>{t.description}</p>
        <details><summary>Tensor inputs and outputs</summary><p><strong>Inputs</strong> {t.inputs.join(", ")}</p><p><strong>Outputs</strong> {t.outputs.join(", ")}</p><p>Export two rows of width 64</p><code style={{overflowWrap:"anywhere"}}>flightdeck {t.slug} 2 64</code></details>
        <div className="actions"><a href={repo+t.slug.replaceAll("-","_")+".blyx"}>Read Blyx source</a></div></article>)}</div>
        {!matches.length && <p>No matching workflow. <button onClick={()=>{setQuery("");setGroup("");}}>Clear filters</button></p>}
    </section>;
}
