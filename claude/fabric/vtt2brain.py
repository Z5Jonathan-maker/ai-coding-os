#!/usr/bin/env python3
"""Clean WebVTT auto-subtitles into plain transcript text for a mentor brain (ripgrep-able).
Auto-subs are noisy: timing cues, inline <tags>, and heavy rolling-window duplication (each
cue repeats the prior line plus a few new words). This strips all that into readable prose.

Usage: vtt2brain.py <vtt_dir> <out_brain_dir> ["Brain Title"]
"""
import re, sys
from pathlib import Path

_TAG = re.compile(r"<[^>]+>")
_WS = re.compile(r"\s+")


def clean_vtt(text: str) -> str:
    lines = []
    for ln in text.splitlines():
        ln = ln.strip()
        if not ln or ln == "WEBVTT" or "-->" in ln:
            continue
        if ln.startswith(("Kind:", "Language:", "NOTE")) or re.fullmatch(r"\d+", ln):
            continue
        ln = _WS.sub(" ", _TAG.sub("", ln)).strip()
        if ln:
            lines.append(ln)
    # rolling-window dedup: drop a line if it's contained in the running tail (auto-sub overlap)
    out, tail = [], ""
    for ln in lines:
        low = ln.lower()
        if low and low not in tail:
            out.append(ln)
            tail = (tail + " " + low)[-400:]   # sliding window of recent text
    return " ".join(out)


def main(vtt_dir: str, out_dir: str, title: str = "Transcripts"):
    vd, od = Path(vtt_dir), Path(out_dir)
    od.mkdir(parents=True, exist_ok=True)
    idx, total_words = [], 0
    for vtt in sorted(vd.glob("*.vtt")):
        txt = clean_vtt(vtt.read_text(encoding="utf-8", errors="ignore"))
        wc = len(txt.split())
        if wc < 40:
            continue
        name = re.sub(r"\.en[^.]*$", "", vtt.stem)
        (od / f"{name}.txt").write_text(txt, encoding="utf-8")
        idx.append(f"- {name} ({wc} words)")
        total_words += wc
    (od / "_INDEX.md").write_text(
        f"# {title}\n\n{len(idx)} transcripts, {total_words:,} words.\n\n" + "\n".join(idx) + "\n",
        encoding="utf-8")
    print(f"wrote {len(idx)} transcripts ({total_words:,} words) to {od}")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2], sys.argv[3] if len(sys.argv) > 3 else "Transcripts")
