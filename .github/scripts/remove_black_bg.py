#!/usr/bin/env python3
from PIL import Image
from collections import deque
import argparse, glob, math, os

def rgb_dist(a,b):
    return math.sqrt((int(a[0])-int(b[0]))**2 + (int(a[1])-int(b[1]))**2 + (int(a[2])-int(b[2]))**2)

def median(vals):
    vals=sorted(vals)
    n=len(vals)
    return vals[n//2] if n%2 else (vals[n//2-1]+vals[n//2])/2

def process(path):
    im=Image.open(path).convert("RGBA")
    w,h=im.size
    px=im.load()

    # Estimate the background from corner patches, which are guaranteed outside the figure.
    patch=max(2, min(w,h)//16)
    samples=[]
    for y in list(range(patch))+list(range(h-patch,h)):
        for x in list(range(patch))+list(range(w-patch,w)):
            samples.append(px[x,y][:3])
    br=tuple(int(median([c[i] for c in samples])) for i in range(3))

    # Smooth-background flood fill. We only traverse dark pixels with low local
    # gradient so the fill stops at the character silhouette even where the
    # character itself contains near-black colours.
    def grad(x,y):
        c=px[x,y][:3]
        m=0.0
        for nx,ny in ((x-1,y),(x+1,y),(x,y-1),(x,y+1)):
            if 0<=nx<w and 0<=ny<h:
                m=max(m,rgb_dist(c,px[nx,ny][:3]))
        return m

    bg=[[False]*w for _ in range(h)]
    q=deque()
    for x in range(w):
        q.append((x,0)); q.append((x,h-1))
    for y in range(h):
        q.append((0,y)); q.append((w-1,y))

    while q:
        x,y=q.popleft()
        if bg[y][x]:
            continue
        c=px[x,y][:3]
        bright=max(c)
        # Permit gentle vignette variation but reject sharp character edges.
        if bright>118 or rgb_dist(c,br)>78 or grad(x,y)>34:
            continue
        bg[y][x]=True
        if x: q.append((x-1,y))
        if x+1<w: q.append((x+1,y))
        if y: q.append((x,y-1))
        if y+1<h: q.append((x,y+1))

    out=im.copy()
    op=out.load()
    removed=0
    for y in range(h):
        for x in range(w):
            r,g,b,a=op[x,y]
            if bg[y][x]:
                op[x,y]=(r,g,b,0)
                removed+=1

    out.save(path, "PNG", optimize=True)
    print(f"{path}: {w}x{h}, removed={removed}/{w*h} ({removed/(w*h):.1%}), bg={br}")

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("patterns", nargs="+")
    args=ap.parse_args()
    files=[]
    for p in args.patterns:
        files.extend(glob.glob(p))
    files=sorted(set(files))
    if not files:
        raise SystemExit("No files matched.")
    for f in files:
        process(f)

if __name__=="__main__":
    main()
