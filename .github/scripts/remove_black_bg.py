#!/usr/bin/env python3
from PIL import Image
from collections import deque
import argparse, glob, math, os

TOLERANCE = 12.0

def med(vals):
    vals=sorted(vals)
    n=len(vals)
    return vals[n//2] if n%2 else (vals[n//2-1]+vals[n//2])/2

def dist(a,b):
    return math.sqrt(sum((float(a[i])-float(b[i]))**2 for i in range(3)))

def estimate_bg(px, w, h, alpha):
    has_transparent = any(alpha[y][x] == 0 for y in range(h) for x in range(w))
    samples=[]
    if not has_transparent:
        for x in range(w):
            samples.append(px[x,0][:3]); samples.append(px[x,h-1][:3])
        for y in range(h):
            samples.append(px[0,y][:3]); samples.append(px[w-1,y][:3])
    else:
        xs=[]; ys=[]
        for y in range(h):
            for x in range(w):
                if alpha[y][x] > 0:
                    xs.append(x); ys.append(y)
        x0,x1=min(xs),max(xs); y0,y1=min(ys),max(ys)
        pw=max(2,min(5,(x1-x0+1)//8))
        ph=max(2,min(5,(y1-y0+1)//8))
        for yy0,xx0 in ((y0,x0),(y0,x1-pw+1),(y1-ph+1,x0),(y1-ph+1,x1-pw+1)):
            for yy in range(yy0,min(h,yy0+ph)):
                for xx in range(xx0,min(w,xx0+pw)):
                    if alpha[yy][xx] > 0:
                        samples.append(px[xx,yy][:3])
        if samples:
            lum=sorted(sum(c)/3 for c in samples)
            cutoff=lum[max(0,int(len(lum)*0.75)-1)]
            samples=[c for c in samples if sum(c)/3 <= cutoff]
    if not samples:
        return (0,0,0)
    return tuple(int(med([c[i] for c in samples])) for i in range(3))

def process(path):
    im=Image.open(path).convert("RGBA")
    w,h=im.size
    px=im.load()
    alpha=[[px[x,y][3] for x in range(w)] for y in range(h)]
    bg=estimate_bg(px,w,h,alpha)

    candidate=[[False]*w for _ in range(h)]
    for y in range(h):
        for x in range(w):
            if alpha[y][x] > 0 and dist(px[x,y][:3], bg) <= TOLERANCE:
                candidate[y][x]=True

    q=deque()
    # Full images: border seeds. Partly transparent images: background touching
    # existing transparency is also a seed.
    for x in range(w):
        if candidate[0][x]: q.append((x,0))
        if candidate[h-1][x]: q.append((x,h-1))
    for y in range(h):
        if candidate[y][0]: q.append((0,y))
        if candidate[y][w-1]: q.append((w-1,y))
    for y in range(h):
        for x in range(w):
            if not candidate[y][x]:
                continue
            if ((y>0 and alpha[y-1][x]==0) or (y+1<h and alpha[y+1][x]==0) or
                (x>0 and alpha[y][x-1]==0) or (x+1<w and alpha[y][x+1]==0)):
                q.append((x,y))

    bgmask=[[False]*w for _ in range(h)]
    while q:
        x,y=q.popleft()
        if bgmask[y][x] or not candidate[y][x]:
            continue
        bgmask[y][x]=True
        if x>0:q.append((x-1,y))
        if x+1<w:q.append((x+1,y))
        if y>0:q.append((x,y-1))
        if y+1<h:q.append((x,y+1))

    removed=0
    for y in range(h):
        for x in range(w):
            if bgmask[y][x]:
                r,g,b,a=px[x,y]
                px[x,y]=(r,g,b,0)
                removed+=1

    im.save(path,"PNG",optimize=True)
    print(f"{path}: bg={bg}, removed={removed}/{w*h} ({removed/(w*h):.1%})")

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("patterns",nargs="+")
    args=ap.parse_args()
    files=[]
    for p in args.patterns:
        files.extend(glob.glob(p))
    for f in sorted(set(files)):
        process(f)

if __name__=="__main__":
    main()
