#!/usr/bin/env python3
from PIL import Image
from rembg import remove, new_session
import argparse, glob

def process(path, session):
    src=Image.open(path).convert("RGBA")
    out=remove(
        src,
        session=session,
        alpha_matting=True,
        alpha_matting_foreground_threshold=235,
        alpha_matting_background_threshold=12,
        alpha_matting_erode_size=1,
        post_process_mask=True,
    )
    if not isinstance(out, Image.Image):
        from io import BytesIO
        out=Image.open(BytesIO(out)).convert("RGBA")
    else:
        out=out.convert("RGBA")
    if out.size != src.size:
        out=out.resize(src.size, Image.Resampling.LANCZOS)
    out.save(path, "PNG", optimize=True)
    a=out.getchannel("A")
    lo,hi=a.getextrema()
    zero=sum(1 for v in a.getdata() if v==0)
    print(f"{path}: {out.size[0]}x{out.size[1]}, alpha={lo}-{hi}, transparent={zero/(out.size[0]*out.size[1]):.1%}")

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
    session=new_session("u2netp")
    for f in files:
        process(f, session)

if __name__=="__main__":
    main()
