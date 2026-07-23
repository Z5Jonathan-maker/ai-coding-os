#!/usr/bin/env python3
"""W2 batch pre-filter — run the failed-research resonance check over a batch of UNIQUE
generator hypotheses BEFORE they burn gauntlet runs.

Design: this is DECOUPLED from the live engine on purpose. It reads hypotheses (a file, stdin,
or a glob of note files), dedupes them, runs w2_resonance.py on each, and writes a resonance
report. It NEVER imports or edits the engine — the discovery loop / operator points it at
whatever hypothesis source exists and reads the report before committing gauntlet runs. That
keeps w2's slow per-hypothesis check (ripgrep + codebase-memory) OFF the per-candidate hot path.

Usage:
  printf 'hyp one\\nhyp two\\n' | w2_prefilter.py --stdin
  w2_prefilter.py --file /path/to/hypotheses.txt
  w2_prefilter.py --glob '/…/vault/07-opportunity-pipeline/*.md'   # first heading of each note
"""
import argparse, json, re, subprocess, sys
from datetime import date
from pathlib import Path

W2 = Path.home() / ".claude/fabric/w2_resonance.py"
REPORT_DIR = Path("/Users/leonardofibonacci/code/projects/mym-autotrader/vault/07-opportunity-pipeline")
_JSON = re.compile(r"\{.*\}", re.S)


def load(args):
    raw = []
    if args.file:
        raw += Path(args.file).read_text(encoding="utf-8").splitlines()
    if args.stdin:
        raw += sys.stdin.read().splitlines()
    for g in args.glob or []:
        for p in Path().glob(g):
            for line in p.read_text(encoding="utf-8", errors="ignore").splitlines():
                if line.startswith("#"):
                    raw.append(line.lstrip("# ").strip()); break
    seen = {}
    for h in (x.strip() for x in raw):
        if h:
            seen.setdefault(" ".join(h.lower().split()), h)   # dedupe case/space-insensitive
    return list(seen.values())


def check(hyp):
    try:
        p = subprocess.run([sys.executable, str(W2), hyp], capture_output=True, text=True, timeout=150)
        m = _JSON.search(p.stdout)       # w2_resonance prints JSON; tolerate any leading log noise
        return json.loads(m.group(0)) if m else {"verdict": "ERROR", "candidate": hyp}
    except Exception as e:
        return {"verdict": "ERROR", "candidate": hyp, "error": str(e)[:80]}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--file"); ap.add_argument("--stdin", action="store_true")
    ap.add_argument("--glob", action="append")
    a = ap.parse_args()
    hyps = load(a)
    if not hyps:
        print("no hypotheses (use --file / --stdin / --glob)", file=sys.stderr); return 1
    results = [check(h) for h in hyps]
    flagged = [r for r in results if r.get("verdict") == "RESEMBLES_FAILED"]
    novel = [r["candidate"] for r in results if r.get("verdict") == "NOVEL"]
    lines = [f"# W2 Pre-Filter — {date.today().isoformat()}", "",
             f"Checked {len(hyps)} unique hypotheses — {len(flagged)} RESEMBLE failed research, "
             f"{len(novel)} clear.", "", "## Flagged (review before spending a gauntlet run)", ""]
    for r in flagged:
        lines.append(f"### ⚠ {r.get('candidate','?')}")
        for m in r.get("matches", [])[:2]:
            lines.append(f"- {m.get('source','?')}: {str(m.get('excerpt',''))[:120]}")
        lines.append("")
    lines += ["## Clear to test (NOVEL)", ""] + [f"- {n}" for n in novel]
    if REPORT_DIR.exists():
        out = REPORT_DIR / f"w2-prefilter-{date.today().isoformat()}.md"
        out.write_text("\n".join(lines) + "\n", encoding="utf-8")
        print(f"report: {out}", file=sys.stderr)
    print(json.dumps({"checked": len(hyps), "resembles_failed": len(flagged), "novel": len(novel)}))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
