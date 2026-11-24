"""Check the five released CLIs and time their CPU experiments. Requires NumPy."""
import argparse
import csv
import json
import math
import os
from pathlib import Path
import platform
import random
import statistics
import subprocess
import tempfile
import time

import numpy as np


def invoke(name, *args, success=True):
    path = binaries / (name + (".exe" if os.name == "nt" else ""))
    p = subprocess.run([str(path), *map(str, args)], capture_output=True, text=True, timeout=90)
    assert (p.returncode == 0) == success, (name, args, p.returncode, p.stderr)
    return p.stdout.strip()


def timed(name, *args):
    invoke(name, *args)
    samples = []
    for _ in range(7):
        start = time.perf_counter_ns()
        result = invoke(name, *args)
        samples.append((time.perf_counter_ns()-start)/1e6)
    return json.loads(result), {"samples_ms": samples, "median_ms": statistics.median(samples)}


def csv_values(values):
    return ",".join(format(x, ".17g") for x in values)


def pair_reference(temp):
    rng = np.random.default_rng(712)
    d, e, n = 5, 7, 9
    left, right = rng.normal(size=(n,d)), rng.normal(size=(n,e))
    targets = rng.normal(size=n)
    path = temp/"factors.txt"
    path.write_text("\n".join(f"{y:.17g};{csv_values(a)};{csv_values(b)}" for y,a,b in zip(targets,left,right)))
    weights = np.zeros((d,e))
    rate = .009
    for _ in range(4):
        for x,z,y in zip(left,right,targets):
            weights -= rate*(x @ weights @ z-y)*np.outer(x,z)
    ckpt = temp/"coefficients.txt"
    ckpt.write_text(invoke("linearfit","pair-fit",path,2,rate))
    resumed = invoke("linearfit","pair-fit",path,2,rate,ckpt)
    assert resumed == invoke("linearfit","pair-fit",path,4,rate)
    ckpt.write_text(resumed)
    coordinate_errors = [abs(float(invoke("linearfit","pair-weight",path,ckpt,i,j))-weights[i,j]) for i in range(d) for j in range(e)]
    prediction_errors = []
    for _ in range(12):
        x,z = rng.normal(size=d),rng.normal(size=e)
        val = float(invoke("linearfit","pair-predict",path,ckpt,csv_values(x),csv_values(z)))
        prediction_errors.append(abs(val-x@weights@z))
    assert max(coordinate_errors+prediction_errors) < 1e-12
    invoke("linearfit","pair-weight",path,ckpt,d,0,success=False)
    return {"samples":n,"completed_updates":4*n,"checked_weights":d*e,"unseen_pair_queries":len(prediction_errors),
            "max_weight_error":max(coordinate_errors),"max_prediction_error":max(prediction_errors),"restart_identical":True}


def expectation(angles, qubits, observed):
    # Independent oracle uses dense Kronecker rotation matrices and basis permutations.
    state = np.eye(1,2**qubits,dtype=float).ravel()
    for row in angles.reshape(-1,qubits):
        rot = np.ones((1,1))
        for angle in reversed(row):
            c,s = math.cos(angle/2),math.sin(angle/2)
            rot = np.kron(rot,[[c,-s],[s,c]])
        state = rot@state
        for control in range(qubits-1):
            perm = [k ^ (((k>>control)&1)<<(control+1)) for k in range(len(state))]
            state = state[perm]
    sign = np.array([1-2*((k>>observed)&1) for k in range(len(state))])
    return np.dot(sign, state**2)


def quantum_reference():
    rng = np.random.default_rng(192)
    errors, loss_errors = [], []
    for n in (1,2,3,4,5):
        for layers in (1,3):
            angles = rng.uniform(-2,2,size=n*layers)
            for ob in sorted({0,n-1}):
                val = float(invoke("blyxtorch","q-expect",n,ob,csv_values(angles)))
                loss_errors.append(abs(val-expectation(angles,n,ob)))
                got = np.array(json.loads(invoke("blyxtorch","q-grad",n,ob,csv_values(angles))))
                for i in range(len(angles)):
                    shift = np.zeros_like(angles); shift[i] = math.pi/2
                    expected = (expectation(angles+shift,n,ob)-expectation(angles-shift,n,ob))/2
                    errors.append(abs(got[i]-expected))
    assert max(errors+loss_errors) < 2e-12
    initial=[.3,-.7,.2,.6]; target=-.25
    curve=[]
    for step in (0,1,2,5,10,20,40):
        angles = initial if step == 0 else json.loads(invoke("blyxtorch","q-fit",2,1,csv_values(initial),target,.2,step))
        pred=expectation(np.array(angles),2,1)
        curve.append({"updates":step,"z":pred,"half_squared_error":.5*(pred-target)**2})
    assert curve[-1]["half_squared_error"] < 1e-6
    invoke("blyxtorch","q-grad",17,0,"0",success=False)
    qasm = invoke("blyxtorch","q-qasm",2,1,csv_values(initial))
    assert qasm.count("ry(") == 4 and qasm.count("cx q[0], q[1]") == 2 and "c[0] = measure q[1]" in qasm
    return {"gradients":len(errors),"expectations":len(loss_errors),"max_gradient_error":max(errors),
            "max_expectation_error":max(loss_errors),"training_curve":curve}


def infra(temp):
    rng = random.Random(2889)
    p=2**41
    ranks=[128,256,512,1024,2048]
    memory={str(r):int(invoke("albatross","state",p,r,0,3,2,2,12)) for r in ranks}
    assert all(val == (16*p)//int(r) for r,val in memory.items())
    assert int(invoke("albatross","min-ranks",p,3,2,2,12,80*2**30,16*2**30,4096))==512
    for stage in range(4):
        for rank in (0,1,2):
            local=11//3+(rank<11%3)
            expected=sum((local if stage>=s else 11)*width for s,width in ((3,2),(2,2),(1,12)))
            assert int(invoke("albatross","state",11,3,rank,stage,2,2,12))==expected
    invoke("albatross","state",2**63-1,1,0,0,2,2,12,success=False)
    # Reassemble an actual sharded payload for random unaligned windows.
    data = rng.randbytes(307*4)
    for k,start in enumerate(range(0,len(data),31*4)): (temp/f"{k}.bin").write_bytes(data[start:start+31*4])
    cases=0
    for _ in range(32):
        first=rng.randrange(308); count=rng.randrange(0,308-first)
        args=(307,4,31,first,count)
        piece=json.loads(invoke("kinglet","range",*args,0))
        restored=b""
        for part in range(piece["parts"]):
            s=piece if part==0 else json.loads(invoke("kinglet","range",*args,part))
            raw=(temp/f"{s['shard']}.bin").read_bytes()
            restored+=raw[s["first_byte"]:s["last_byte"]+1]
        assert restored==data[first*4:(first+count)*4]; cases+=1
    a=json.loads(invoke("kinglet","range",p,2,2**30,2**40-2,5,0))
    b=json.loads(invoke("kinglet","range",p,2,2**30,2**40-2,5,1))
    assert (a["shard"],a["length"],b["shard"],b["length"])==(1023,4,1024,6)
    assert json.loads(invoke("kinglet","range",2**63-1,1,2**63-1,2**63-2,1,0))["last_byte"]==2**63-2
    invoke("kinglet","range",4,2,4,3,2,0,success=False)
    keys=[7,31,2**41-1,2**53-1]
    arrays=[[],[]]; reference={}
    for k in keys:
        nums=[rng.uniform(-10,10) for _ in range(13)]
        for j,x in enumerate(nums): arrays[j%2].append((k,x))
        reference[k]=math.fsum(nums)/127
    paths=[]
    for i,rows in enumerate(arrays):
        path=temp/f"worker{i}.csv"; paths.append(path)
        path.write_text("".join(f"{k},{v:.17g}\n" for k,v in rows))
    reduced=dict((int(k),float(v)) for k,v in csv.reader(invoke("chaffinch","reduce",127,*paths).splitlines()))
    assert reference.keys()==reduced.keys()
    delta=max(abs(reduced[k]-v) for k,v in reference.items())
    assert delta<1e-14
    paths[0].write_text("7,10000000000000000\n7,1\n")
    paths[1].write_text("7,-10000000000000000\n")
    assert invoke("chaffinch","reduce",4,*paths)=="7,0.25"
    paths[0].write_text("9007199254740993,1\n")
    invoke("chaffinch","reduce",4,*paths,success=False)
    return {"state_bytes_by_ranks":memory,"min_ranks":512,"matched_slices":cases,
            "large_slice":[a,b],"sparse_coordinates":keys,"gradient_sum_rows":52,"max_reduction_error":delta}


if __name__ == "__main__":
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--bin",type=Path,required=True);parser.add_argument("--out",type=Path,required=True)
    options=parser.parse_args();binaries=options.bin.resolve()
    with tempfile.TemporaryDirectory() as tmp:
        temp=Path(tmp)
        results={"machine":platform.platform(),"cpu":platform.processor(),"numpy":np.__version__,
                 "python":platform.python_version(),"method":"One warm-up then seven fresh CPU processes. Wall time includes startup and output. Quantum timings include four gradient evaluations per process.","pair_reference":pair_reference(temp),"quantum_reference":quantum_reference(),"operations":infra(temp)}
    results["pairs"]=[]
    for power in (8,12,16,19,21):
        row,timing=timed("pair-study","factors",power)
        assert row["updates"]==48 and abs(row["half_mse"]-.234375/(4**12))<1e-14
        results["pairs"].append({**row,**timing})
    results["dense_parity"]=[json.loads(invoke("pair-study","dense",i)) for i in (4,6,8)]
    results["quantum_timings"]=[]
    for qubits in (4,6,8,10):
        adj,ta=timed("quantum-study","adjoint",qubits,3,4)
        shift,ts=timed("quantum-study","shift",qubits,3,4)
        err=max(abs(a-b) for a,b in zip(adj,shift))
        assert err<2e-12
        results["quantum_timings"].append({"qubits":qubits,"angles":3*qubits,"adjoint":ta,"shift":ts,"max_error":err})
    options.out.write_text(json.dumps(results,ensure_ascii=False,indent=2,default=float)+"\n",encoding="utf8")
    print("Verified the five executables and wrote",options.out)
