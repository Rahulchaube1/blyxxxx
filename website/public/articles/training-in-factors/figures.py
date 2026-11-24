"""Redraw the article figures from measurements.json with Matplotlib."""
import json
from pathlib import Path
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.ticker import FixedLocator, FixedFormatter

base = Path(__file__).resolve().parent
data = json.loads((base / "measurements.json").read_bytes())
ink, teal, copper, grid = "#142e33", "#066d68", "#af592c", "#d6dfdc"
plt.rcParams.update({"font.family":"DejaVu Sans","font.size":12,"axes.labelcolor":ink,
    "text.color":ink,"xtick.color":ink,"ytick.color":ink,"axes.edgecolor":grid,
    "axes.spines.top":False,"axes.spines.right":False,"axes.titlelocation":"left",
    "axes.titleweight":"bold","axes.titlesize":16,"figure.facecolor":"white","axes.facecolor":"white"})
def finish(fig,name):
    fig.savefig(base / (name+".png"), dpi=165, bbox_inches="tight", pad_inches=.20)
    plt.close(fig)

fig, ax = plt.subplots(figsize=(8.4,4.55),layout="constrained")
pairs = data["pairs"]; x = list(range(len(pairs)))
ax.set_yscale("log",base=2)
for label,values,color,marker in [
        ("Dense matrix, calculated", [r["coefficients"]*8 for r in pairs], copper,"s"),
        ("Four pairs of input vectors", [r["stored_factor_values"]*8 for r in pairs], teal,"o")]:
    ax.plot(x,values,marker=marker,ms=7,lw=2.6,color=color,label=label)
ax.set_xticks(x,["32.8K","8.39M","2.15B","137B","2.20T"])
ax.set_xlabel("Number of matrix coefficients");ax.set_ylabel("FP64 payload (log scale)")
ax.yaxis.set_major_locator(FixedLocator([2**i for i in (10,20,30,40,44)]))
ax.yaxis.set_major_formatter(FixedFormatter(["1 KiB","1 MiB","1 GiB","1 TiB","16 TiB"]))
ax.set_ylim(2**9,2**47);ax.grid(axis="y",color=grid,linewidth=.8);ax.set_axisbelow(True)
ax.set_title("How much storage does the matrix require?",pad=13);ax.legend(frameon=False,loc="upper left",fontsize=10)
ax.annotate("96 MiB", (4,pairs[-1]["stored_factor_values"]*8),xytext=(-6,-20),textcoords="offset points",ha="right",color=teal,fontweight="bold")
finish(fig,"factor-storage")

fig, ax=plt.subplots(figsize=(8.4,4.55),layout="constrained")
rows=data["quantum_timings"]; widths=.23; shift=.18
for method,color,label,offset in [("adjoint",teal,"Adjoint sweep",-shift),("shift",copper,"Parameter shift",shift)]:
    pos=[i+offset for i in range(len(rows))]
    med=[r[method]["median_ms"] for r in rows]
    for loc,r in zip(pos,rows):
        times=r[method]["samples_ms"]
        ax.vlines(loc,min(times),max(times),color=color,linewidth=2)
        ax.scatter([loc+(j-3)*.016 for j in range(7)],times,s=18,color=color,alpha=.38)
    ax.scatter(pos,med,marker="_",s=230,lw=3,color=color,label=label)
ax.set_xticks(range(len(rows)),[str(r["qubits"]) for r in rows]);ax.set_xlim(-.55,3.55);ax.set_ylim(0,110)
ax.set_xlabel("Simulated qubits, three circuit layers");ax.set_ylabel("Wall time for four gradients (ms)")
ax.set_title("Two ways to differentiate the same circuit",pad=13);ax.grid(axis="y",color=grid,linewidth=.8);ax.set_axisbelow(True)
ax.legend(frameon=False,loc="upper left",fontsize=10)
finish(fig,"circuit-gradient")

fig,ax=plt.subplots(figsize=(8.4,3.85),layout="constrained")
states=data["operations"]["state_bytes_by_ranks"]
xs=list(range(len(states)));ys=[b/2**30 for b in states.values()]
ax.bar(xs,ys,color=[teal if n=="512" else "#83a9a5" for n in states],width=.58)
ax.axhline(64,color=copper,linestyle="--",lw=1.8)
for x,y in zip(xs,ys):ax.text(x,y+5,f"{y:.0f}",ha="center",fontsize=11)
ax.text(3.55,70,"64 GiB budget",ha="right",color=copper,fontsize=10)
ax.set_xticks(xs,list(states));ax.set_xlabel("Worker count");ax.set_ylabel("Model state / worker (GiB)")
ax.set_ylim(0,300);ax.grid(axis="y",color=grid,linewidth=.8);ax.set_axisbelow(True)
ax.set_title("A capacity estimate for 2⁴¹ parameters",pad=13)
finish(fig,"worker-memory")
