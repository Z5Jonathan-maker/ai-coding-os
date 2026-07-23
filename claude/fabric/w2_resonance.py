#!/usr/bin/env python3
"""W2 Failed-Research Resonance / self-heal check (DEV TOOLING, READ-ONLY).
Detects whether a strategy candidate resembles previously-FAILED research so
dead ideas aren't re-gauntletted. Stdlib only; writes nothing."""
from __future__ import annotations

import json
import re
import shutil
import subprocess
import sys
from pathlib import Path

CBM_BIN = "/Users/leonardofibonacci/local/bin/codebase-memory-mcp"
CBM_PROJECT = "Users-leonardofibonacci-code-projects-mym-autotrader"
SOURCES = [  # failed-research record; missing paths are skipped, never fatal
    "/Users/leonardofibonacci/code/projects/mym-autotrader/vault/03-failed-research/",
    "/Users/leonardofibonacci/.claude/wiki/logs/failure-log.md",
    "/Users/leonardofibonacci/.claude/wiki/decision-rules.md",
]
TIMEOUT = 5  # local tools; a few seconds is plenty

STOPWORDS = {"a", "an", "the", "on", "in", "of", "for", "with", "and", "or", "to", "is",
             "as", "at", "by", "using", "use", "based", "via", "new", "test"}
# Generic strategy vocabulary: overlap on these alone proves no resemblance.
GENERIC = {"filter", "gate", "gated", "swing", "entry", "entries", "exit", "strategy",
           "signal", "edge", "range", "mean", "reversion", "breakout", "trend", "day",
           "long", "short", "trade", "trades", "trading", "mechanical", "rule", "rules",
           # common trading vocabulary — overlap on these alone is not resemblance
           "regime", "cycle", "overnight", "session", "volatility", "vol", "momentum",
           "order", "flow", "price", "level", "levels", "zone", "zones", "position",
           "market", "markets", "futures", "crypto", "equity", "index", "book", "model",
           "daily", "hourly", "weekly", "close", "open", "high", "low", "bar", "bars",
           "win", "net", "forward", "backtest", "gauntlet", "fill", "fills", "cell",
           "cells", "family", "dead", "live", "real", "honest", "tape", "leg", "legs",
           "scalp", "runner", "target", "stop", "profit", "loss", "risk", "size"}


def extract_terms(candidate: str) -> list[str]:
    """Identifier-like lowercase tokens, minus stopwords and 1-char noise."""
    seen: set[str] = set()
    return [t for t in re.findall(r"[A-Za-z0-9_]+", candidate.lower())
            if len(t) >= 2 and t not in STOPWORDS and not (t in seen or seen.add(t))]


def structural_check(terms: list[str]) -> dict:
    """Query codebase-memory-mcp for co-occurring symbols. Soft-skip on ANY
    failure (not indexed, missing binary, timeout, bad JSON): the textual scan
    is authoritative; this check is supporting evidence only."""
    if not Path(CBM_BIN).exists():
        return {"status": "skipped", "detail": f"binary not found: {CBM_BIN}"}
    payload = json.dumps({"project": CBM_PROJECT, "query": " ".join(terms)})
    try:
        p = subprocess.run([CBM_BIN, "cli", "search_graph"], input=payload,
                           capture_output=True, text=True, timeout=TIMEOUT)
    except Exception as e:  # timeout, spawn failure, etc.
        return {"status": "skipped", "detail": f"subprocess failed: {e}"}
    # Verified: the "project not indexed" error JSON goes to STDERR next to the
    # mem.init log line, so hunt for a JSON object in stdout, then stderr.
    data = None
    for stream in (p.stdout or "", p.stderr or ""):
        try:
            data = json.loads(stream[stream.index("{"):])
            break
        except (ValueError, json.JSONDecodeError):
            continue
    if not isinstance(data, dict):
        return {"status": "skipped", "detail": "no parseable JSON from binary"}
    if "error" in data:
        return {"status": "skipped", "detail": f"index unavailable: {data['error']}"}
    nodes = data.get("results") or data.get("nodes") or []
    files = sorted({str(n.get("file") or n.get("path") or "")
                    for n in nodes if isinstance(n, dict)} - {""})
    detail = f"{len(nodes)} node(s) matched" if nodes else "indexed, no structural matches"
    return {"status": "ok", "detail": detail, "files": files[:10]}


def scan_source(src: str, terms: list[str]) -> list[dict]:
    """Line-scan one file/dir for key terms (rg preferred, Python fallback).
    Never raises; returns [{source, line, excerpt}]."""
    hits = []
    if shutil.which("rg"):
        try:  # -w whole-ish word; rc 1 = no matches (normal), rc 2 = error
            p = subprocess.run(["rg", "-n", "-i", "-w", "--no-heading",
                                "|".join(terms), src],
                               capture_output=True, text=True, timeout=TIMEOUT)
            out = p.stdout if p.returncode in (0, 1) else ""
            for ln in out.splitlines():
                m = re.match(r"^(.*?):(\d+):(.*)$", ln)
                if m:
                    hits.append({"source": m.group(1), "line": int(m.group(2)),
                                 "excerpt": m.group(3).strip()[:300]})
            return hits
        except Exception:
            pass  # rg failed mid-call — fall through to the Python scan
    pat = re.compile(r"\b(" + "|".join(re.escape(t) for t in terms) + r")\b", re.I)
    root = Path(src)
    for f in [f for f in (sorted(root.rglob("*")) if root.is_dir() else [root]) if f.is_file()]:
        try:
            for n, text in enumerate(f.read_text(errors="replace").splitlines(), 1):
                if pat.search(text):
                    hits.append({"source": str(f), "line": n, "excerpt": text.strip()[:300]})
        except OSError:
            continue  # unreadable file — skip, never fatal
    return hits


def main() -> None:
    candidate = sys.argv[1] if len(sys.argv) > 1 else ""
    terms = extract_terms(candidate)
    if not candidate.strip() or not terms:
        print(json.dumps({"verdict": "UNCERTAIN", "candidate": candidate, "key_terms": terms,
                          "matches": [], "structural_check": {"status": "skipped", "detail": "no candidate given"},
                          "recommendation": "Usage: w2_resonance.py \"<candidate description>\""}, indent=2))
        return
    distinctive = [t for t in terms if t not in GENERIC]
    structural = structural_check(terms)
    existing = [s for s in SOURCES if Path(s).exists()]  # skip missing silently
    raw = [h for s in existing for h in scan_source(s, terms)]

    # Score each hit by DISTINCTIVE candidate terms in its excerpt — shared
    # mechanism, not shared filler, is what resemblance means. A term is
    # "anchored" if it names the entry (filename token or markdown heading);
    # one anchored term outweighs an incidental prose hit like "concept".
    scored = []
    for h in raw:
        shared = [t for t in distinctive
                  if re.search(rf"\b{re.escape(t)}\b", h["excerpt"], re.I)]
        if shared:
            # RESEMBLES_FAILED requires 2+ distinctive terms co-occurring in the SAME hit — a
            # single shared term (even in a heading) cried wolf on nearly every candidate.
            strong = len(shared) >= 2
            scored.append({**h, "strong": strong, "_n": len(shared),
                           "why": f"shares distinctive term(s): {', '.join(shared)}"})
    scored.sort(key=lambda h: -h["_n"])
    per_file: dict[str, int] = {}
    matches = []  # cap 5/source so one file can't drown the report
    for h in scored:
        if per_file.get(h["source"], 0) < 5:
            per_file[h["source"]] = per_file.get(h["source"], 0) + 1
            matches.append(h)

    # Verdict — conservative: UNCERTAIN unless evidence is concrete either way.
    # RESEMBLES_FAILED needs 2+ distinctive shared terms or 1 anchored term.
    if any(h["strong"] for h in matches):
        verdict = "RESEMBLES_FAILED"
        rec = ("Candidate shares concrete mechanism/indicator terms with a previously-failed "
               "research entry — review the cited file(s) before spending a gauntlet run; "
               "only proceed with genuinely new evidence.")
    elif not existing:
        verdict = "UNCERTAIN"
        rec = "No failed-research sources were readable; cannot rule out resemblance — treat with caution."
    elif matches:
        verdict = "UNCERTAIN"
        rec = "Only weak/generic term overlap found; not citable as a failed-research match, but not clean enough to call novel."
    else:
        # NOVEL holds even if the structural check skipped — per spec it only
        # gates NOVEL "if it ran"; the text scan is authoritative.
        verdict = "NOVEL"
        rec = "No meaningful overlap with the failed-research record; candidate looks novel — standard gauntlet still applies."

    cited = [{"source": h["source"], "line": h["line"], "excerpt": h["excerpt"], "why": h["why"]}
             for h in matches[:15]]
    print(json.dumps({"verdict": verdict, "candidate": candidate, "key_terms": terms,
                      "matches": cited, "structural_check": structural,
                      "recommendation": rec}, indent=2))


if __name__ == "__main__":
    main()
