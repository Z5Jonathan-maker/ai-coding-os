#!/usr/bin/env python3
"""W1 - Doctrine-vs-Code Gap Audit (DEV TOOLING, READ-ONLY).

For a given trading strategy, distills what the CODE actually does (queried from
codebase-memory-mcp) into short mechanism phrases, distills what the DOCTRINE (mentor
corpus + strategy vault notes) says the strategy should do, then uses Jina embeddings
to find doctrine phrases with no close coded counterpart (divergences) and coded
phrases with no doctrine support (possible undocumented behavior).

SAFETY: read-only analysis. Never reads/writes config.yaml, connectors, or anything
under the funded trading path. External calls: codebase-memory-mcp CLI (indexed read
queries), `rg` over doctrine text files, and the Jina embeddings API (read-only HTTP).
Writes are limited to this script (already on disk) and a markdown report under
vault/02-strategies/. Run with the fabric venv (stdlib-only; used for consistency):
/Users/leonardofibonacci/.claude/fabric/.venv/bin/python w1_doctrine_audit.py <Strategy>
"""
from __future__ import annotations

import json, math, re, subprocess, sys, time
from collections import OrderedDict
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import jina_fabric  # shared Jina embed/rerank layer (key + Cloudflare UA fix)

CBM_BIN = "/Users/leonardofibonacci/local/bin/codebase-memory-mcp"
CBM_PROJECT = "Users-leonardofibonacci-code-projects-mym-autotrader"
CBM_TIMEOUT = 20
# Scoped to the TRADING corpus only — the other ~24 learnings/mentor-* dirs are DoseCraft
# health/peptide brains and caused false-positive divergences (peptide text coincidentally
# sharing "quarter"/"daily"/"number" with the trading vocabulary). See gap-audit false-positives 2026-07-23.
_TRADING_MENTORS = ("algorithmic-io", "aligrithm", "ayubace", "mr-vein", "tmcycles", "trader-tapes", "tradingview-pine")
DOCTRINE_ROOTS = [Path("/Users/leonardofibonacci/code/projects/mym-autotrader/vault/02-strategies")] + [
    Path(f"/Users/leonardofibonacci/.claude/wiki/learnings/mentor-{m}") for m in _TRADING_MENTORS]
REPORT_DIR = Path("/Users/leonardofibonacci/code/projects/mym-autotrader/vault/02-strategies")
FORBIDDEN_PATH_HINTS = ("config.yaml", "/connectors/", "/live/")  # never analyze the funded path, even read-only

KEY_METHOD_NAMES = ["Place", "TightenStop", "OnBarUpdate", "OnExecutionUpdate",
                     "OnOrderUpdate", "OnStateChange", "RebuildDaily", "SeedDaily"]
METHOD_NAME_HINT_RE = re.compile(r"Place|Enter|Exit|Stop|Lock|Tighten|Trail|Breakeven|"
                                  r"Flatten|Invalidate|Seed|Rebuild|OnBar|OnExecution|OnOrder", re.I)
MAX_METHODS, MAX_SNIPPET_CHARS, SIM_THRESHOLD = 8, 30000, 0.5

# Generic NT8/trading-code -> plain-English mechanism vocabulary (not Area61-specific,
# so this reflex generalizes to other strategies in the same repo).
MECH_RULES = [
    (r"TightenStop\s*\(", "monotonic stop-tightening: stop only moves favorably, validated against live bid/ask"),
    (r"lock\w*\s*=\s*true|Lock(Trig|To|Frac)\b", "profit lock: past a favorable-extension trigger (LockTrig), stop walks to a locked fraction/level (LockTo/LockFrac)"),
    (r"\bbreakeven\b|lockBE", "breakeven lock: stop moved to entry (dead breakeven) under a defined condition (e.g. after TP1)"),
    (r"Tp1(Pts|Hit)?\b[\s\S]{0,400}Tp2[\s\S]{0,400}Tp3|SetProfitTarget", "multi-leg take-profit ladder (TP1/TP2/TP3) with a separate signal per leg"),
    (r"QfStep|quarter.?figure|round.?number", "fade quarter-figure / round-number price zones as the core level definition"),
    (r"\bFvg\b|fair.?value.?gap", "fair-value-gap (FVG) confluence required in the fade direction"),
    (r"\bvwap\b", "VWAP-direction confluence gate"),
    (r"MtfGate|mh4\b|mh1\b|4H/1H", "multi-timeframe (4H/1H/30M) trend gate pinned to period-open prices"),
    (r"UseSwingTrend|trendState", "swing-trend state filter on candidate direction"),
    (r"React(Min|Lookback)|\breact\[", "reaction-map filter: only trade zones with a minimum historical reaction over a lookback window"),
    (r"invalidated\s*=\s*true|Invalidate", "zone invalidation: candidate dropped if price closes beyond zone plus tolerance before entry"),
    (r"WinStart|WinEnd", "time-of-day entry window gate"),
    (r"MaxDailyLoss|EmergencyTradeLoss", "daily loss cap / emergency single-trade loss circuit breaker"),
    (r"MaxConsecLosses", "consecutive-loss circuit breaker"),
    (r"FlattenHHmm", "forced flatten at a fixed time of day"),
    (r"MaxTradesPerDay", "hard cap on trades per day"),
    (r"lastFireDate|lastFireZone|DEDUP GUARD|RefireGuardSec", "dedup/refire guard: suppress same-zone re-fire same day plus a wall-clock cooldown"),
    (r"EtHHmm|EtDate|EtOffsetMin", "ET-anchored session clock (not raw host/CT clock) for all time-of-day logic"),
    (r"UnitQty|EnterLong|EnterShort", "fixed position size per leg, entries submitted long/short via EnterLong/EnterShort"),
    (r"SetStopLoss", "server-side hard stop-loss orders (price-based), not synthetic/soft stops"),
    (r"AllQfZones|IsLarge", "optional restriction to only 'large' quarter-figure zones vs. all zones"),
    (r"State\s*==\s*State\.Realtime", "realtime-only guards (skip during historical replay) to prevent replay-induced duplicate fires"),
]
MECH_RULES = [(re.compile(p, re.I), phrase) for p, phrase in MECH_RULES]
COMMENT_VOCAB = re.compile(r"\b(lock|gate|guard|tighten|invalidat\w+|fade|breakeven|trend|window|"
                            r"flatten|dedup|monoton\w+|ladder|confluence|refire)\b", re.I)
STOPWORDS = set("a an and are as at be by for from has have if in into is it its of on once only or "
                 "than that the their this to via was were will with without not no per each every "
                 "before after under over same across between both".split())
GENERIC = {"trade", "trades", "trading", "strategy", "code", "logic", "mechanism", "system", "rule",
           "rules", "point", "points", "value", "direction", "current", "update", "state", "method",
           "function", "class", "signal", "level", "levels", "price", "prices", "gate", "gated",
           "window", "trigger", "fraction", "size", "hard", "live", "position", "zone", "zones",
           "stop", "target", "session", "cap", "fixed", "entry", "entries", "exit", "fired", "fire",
           "guard", "clock", "time", "times", "condition", "defined", "candidate", "against",
           "during", "beyond", "short", "large", "based", "moved", "moves", "closes", "dropped",
           "enter", "optional", "separate", "single", "submitted", "validated", "period", "pinned",
           "plus", "prevent", "filter", "definition", "core", "minimum", "historical", "host",
           "induced", "duplicate", "restriction", "orders", "stops", "walks", "favorable",
           "favorably", "past", "raw", "skip", "soft"}


def warn(msg): print(f"WARNING: {msg}", file=sys.stderr)


def cbm_call(tool, payload):
    """Call codebase-memory-mcp cli <tool>. Returns (dict, None) or (None, error_str)."""
    try:
        p = subprocess.run([CBM_BIN, "cli", tool], input=json.dumps(payload),
                            capture_output=True, text=True, timeout=CBM_TIMEOUT)
    except Exception as e:
        return None, f"subprocess failed: {e}"
    for stream in (p.stdout or "", p.stderr or ""):  # JSON is on stdout; log line is on stderr
        idx = stream.find("{")
        if idx == -1:
            continue
        try:
            return json.loads(stream[idx:]), None
        except json.JSONDecodeError:
            continue
    return None, f"no parseable JSON from binary (rc={p.returncode})"


def find_strategy(strategy):
    """One retry on an empty first hit: each CLI call cold-reloads the ~500MB graph from
    disk (observed 2026-07-23), and a query landing mid-reload/mid-reindex can transiently
    return total=0 for a strategy that IS indexed. A second, slower call clears it."""
    for attempt in range(2):
        data, err = cbm_call("search_graph", {"project": CBM_PROJECT, "query": strategy})
        if err:
            return None, f"search_graph call failed: {err}"
        if isinstance(data, dict) and "error" in data:
            hint = f" available_projects={data.get('available_projects')}" if "available_projects" in data else ""
            return None, f"codebase-memory error: {data['error']}.{hint} (checked project={CBM_PROJECT})"
        results = (data or {}).get("results") or []
        if results:
            return results, None
        if attempt == 0:
            warn("search_graph returned 0 nodes on first attempt; retrying once (known transient reload flakiness)")
            time.sleep(2)
    return None, (f"search_graph returned 0 nodes for query={strategy!r} in project={CBM_PROJECT} "
                  f"(twice) - verify the identifier and/or the project name.")


def select_methods(results, strategy):
    """Class node (best name match, else first Class) + up to MAX_METHODS of its methods,
    prioritizing KEY_METHOD_NAMES then anything matching the entry/exit/lock name hints."""
    class_node = next((r for r in results if r.get("label") == "Class" and
                        (r.get("name", "").lower() == strategy.lower() or
                         r.get("qualified_name", "").endswith("." + strategy))), None) \
        or next((r for r in results if r.get("label") == "Class"), None)
    methods = [r for r in results if r.get("label") == "Method"]
    if class_node:
        scoped = [m for m in methods if m.get("qualified_name", "").startswith(class_node["qualified_name"] + ".")]
        methods = scoped or methods
    by_name = OrderedDict((m["name"], m) for m in methods)
    selected = [by_name[n] for n in KEY_METHOD_NAMES if n in by_name]
    chosen = {m["qualified_name"] for m in selected}
    for m in methods:
        if len(selected) >= MAX_METHODS:
            break
        if m["qualified_name"] not in chosen and METHOD_NAME_HINT_RE.search(m.get("name", "")):
            selected.append(m); chosen.add(m["qualified_name"])
    return class_node, selected[:MAX_METHODS]


def fetch_snippets(methods):
    fetched, total_chars = [], 0
    for m in methods:
        if total_chars >= MAX_SNIPPET_CHARS:
            break
        data, err = cbm_call("get_code_snippet", {"project": CBM_PROJECT, "qualified_name": m["qualified_name"]})
        if err or not isinstance(data, dict) or "source" not in data:
            warn(f"get_code_snippet failed for {m['qualified_name']}: {err or data}")
            continue
        fp = data.get("file_path", "")
        if any(bad in fp for bad in FORBIDDEN_PATH_HINTS):
            warn(f"skipped forbidden path per constraint: {fp}")
            continue
        fetched.append({"name": m["name"], "qualified_name": m["qualified_name"], "file_path": fp,
                         "start_line": data.get("start_line"), "end_line": data.get("end_line"),
                         "source": data["source"]})
        total_chars += len(data["source"])
    return fetched


def distill_coded_mechanisms(snippets):
    """Rule-matched vocabulary phrases (curated, controlled English -> used to drive the
    doctrine search) plus up to 10 domain-flavored inline comments (dedup'd by prefix) as a
    fallback net for mechanisms the fixed rules miss. Comment phrases are reported alongside
    the curated ones but are NOT fed into term extraction: raw source comments carry too much
    generic English (e.g. "keep", "survive", "arm") that false-positive-matches unrelated
    corpora (mentor corpora is 700MB+ of peptide/biohacking content) when ripgrepped."""
    combined = "\n".join(s["source"] for s in snippets)
    curated = [phrase for rx, phrase in MECH_RULES if rx.search(combined)]
    comments, seen, extra = [], {p[:40].lower() for p in curated}, 0
    for line in combined.splitlines():
        line = line.strip()
        if not line.startswith("//"):
            continue
        text = line.lstrip("/").strip()
        if len(text) < 15 or not COMMENT_VOCAB.search(text):
            continue
        text = re.sub(r"^[A-Z0-9\-]+\s+FIX\s*\(?[^)]*\)?:?\s*", "", text)[:140].rstrip(".")  # strip "H115 FIX (...):" tags
        key = text[:40].lower()
        if key in seen:
            continue
        seen.add(key); comments.append(text); extra += 1
        if extra >= 10:
            break
    return curated, comments


def extract_terms(strategy, phrases):
    """Search-term vocabulary for the doctrine ripgrep. min length 5 + STOPWORDS/GENERIC:
    the mentor corpus is 700MB+ of unrelated (peptide/biohacking) prose, so short/common
    English words (day, open, long, loss...) produce thousands of false-positive hits."""
    text = strategy + " " + " ".join(phrases)
    text = re.sub(r"(?<=[a-z0-9])(?=[A-Z])", " ", text)  # split PascalCase/camelCase for search terms
    tokens = re.findall(r"[a-zA-Z][a-zA-Z0-9]{4,}", text.lower())
    return sorted({t for t in tokens if t not in STOPWORDS and t not in GENERIC})


def ripgrep_doctrine(terms, roots):
    existing = [r for r in roots if r.exists()]
    missing = [str(r) for r in roots if not r.exists()]
    for r in missing:
        warn(f"doctrine root missing, skipped: {r}")
    if not terms or not existing:
        return [], missing
    pattern = "|".join(re.escape(t) for t in terms[:60])
    cmd = ["rg", "-n", "-i", "-w", "--no-heading", "-g", "*.md", "-g", "*.txt",
           "-g", "!*-gap-audit-*.md", pattern] + [str(r) for r in existing]
    try:
        p = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
    except Exception as e:
        warn(f"ripgrep failed: {e}")
        return [], missing
    if p.returncode not in (0, 1):
        warn(f"ripgrep rc={p.returncode}: {(p.stderr or '')[:200]}")
        return [], missing
    hits = []
    for line in p.stdout.splitlines():
        m = re.match(r"^(.*?):(\d+):(.*)$", line)
        if m:
            hits.append({"source": m.group(1), "line": int(m.group(2)), "excerpt": m.group(3).strip()[:220]})
    return hits, missing


MIN_TERM_OVERLAP = 3  # below this, a hit is more likely incidental than genuine doctrine


def build_doctrine_phrases(hits, terms, limit=60):
    """Dedup by excerpt text; DROP hits sharing fewer than MIN_TERM_OVERLAP distinct terms with
    the distilled mechanism vocabulary (single-term overlap is too easily incidental in a large,
    mostly-unrelated corpus), then rank survivors by overlap count (more shared vocabulary =
    more likely to be describing the same mechanism), table-shaped rows tie-broken last."""
    dedup = OrderedDict((h["excerpt"].lower(), h) for h in hits)
    term_set = set(terms)
    scored = []
    for h in dedup.values():
        # excerpt text only — the source FILE PATH must not count toward overlap (a filename
        # like "how-to-figure-out-what-diet..." would otherwise inflate every line in that
        # file regardless of what the line itself says).
        toks = set(re.findall(r"[a-z0-9]+", h["excerpt"].lower()))
        overlap = len(toks & term_set)
        if overlap >= MIN_TERM_OVERLAP:
            scored.append((-overlap, 1 if h["excerpt"].count("|") >= 4 else 0, h["source"], h))
    scored.sort(key=lambda t: t[:3])
    return [h for *_, h in scored[:limit]]


def cosine(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    na, nb = math.sqrt(sum(x * x for x in a)), math.sqrt(sum(x * x for x in b))
    return dot / (na * nb) if na and nb else 0.0


def keyword_sim(a, b):
    """Fallback similarity when Jina is degraded: Jaccard overlap of meaningful tokens."""
    ta = {t for t in re.findall(r"[a-z0-9]{3,}", a.lower()) if t not in STOPWORDS}
    tb = {t for t in re.findall(r"[a-z0-9]{3,}", b.lower()) if t not in STOPWORDS}
    return len(ta & tb) / len(ta | tb) if ta and tb else 0.0


def compute_gap(coded_phrases, doctrine_hits):
    """Doctrine phrases with low max-similarity to any coded phrase = divergences (doctrine
    teaches it, code may not implement it). Coded phrases with low max-similarity to any
    doctrine phrase = undocumented_code (possible over-engineering / undocumented behavior)."""
    doctrine_texts = [h["excerpt"] for h in doctrine_hits]
    if not coded_phrases or not doctrine_texts:
        return [], [], "skipped:empty-input"
    vectors, status = jina_fabric.embed(coded_phrases + doctrine_texts)
    if status == "ok" and vectors:
        code_vecs, doc_vecs = vectors[:len(coded_phrases)], vectors[len(coded_phrases):]
        sim, jina_status = (lambda i, j: cosine(doc_vecs[i], code_vecs[j])), "ok"
    else:
        warn(f"Jina embeddings unavailable ({status}); falling back to keyword-overlap similarity")
        sim, jina_status = (lambda i, j: keyword_sim(doctrine_texts[i], coded_phrases[j])), f"degraded:{status}"

    divergences = []
    for i, h in enumerate(doctrine_hits):
        sims = [sim(i, j) for j in range(len(coded_phrases))]
        best_j = max(range(len(sims)), key=lambda j: sims[j])
        if sims[best_j] < SIM_THRESHOLD:
            divergences.append({"doctrine_phrase": doctrine_texts[i], "doctrine_source": f"{h['source']}:{h['line']}",
                                 "best_code_match": coded_phrases[best_j], "similarity": round(sims[best_j], 4)})
    divergences.sort(key=lambda d: d["similarity"])

    undocumented = []
    for j, phrase in enumerate(coded_phrases):
        best = max((sim(i, j) for i in range(len(doctrine_texts))), default=0.0)
        if best < SIM_THRESHOLD:
            undocumented.append({"coded_phrase": phrase, "best_doctrine_similarity": round(best, 4)})
    return divergences, undocumented, jina_status


def verdict_for(divergences, undocumented, jina_status):
    if jina_status == "skipped:empty-input":
        return "INCONCLUSIVE: no coded mechanisms and/or no doctrine text found to compare"
    tag = "OK" if jina_status == "ok" else "DEGRADED(keyword-fallback)"
    if not divergences and not undocumented:
        return f"ALIGNED [{tag}]: no doctrine phrase fell below similarity {SIM_THRESHOLD} to the coded mechanisms"
    return f"GAPS_FOUND [{tag}]: {len(divergences)} doctrine divergence(s), {len(undocumented)} undocumented coded mechanism(s)"


def write_report(result, doctrine_hits):
    if not REPORT_DIR.exists():
        warn(f"report dir missing, skipped markdown report: {REPORT_DIR}")
        return None
    path = REPORT_DIR / f"{result['strategy']}-gap-audit-{date.today().isoformat()}.md"
    lines = [f"# Doctrine-vs-Code Gap Audit - {result['strategy']}", "",
              f"Date: {date.today().isoformat()}", f"Class: {result['class_qualified_name']}",
              f"Methods analyzed: {', '.join(result['methods_analyzed']) or '(none)'}",
              f"Jina status: {result['jina_status']}", f"Verdict: {result['verdict']}", "",
              "## Coded Mechanisms (from code)"]
    lines += [f"- {p}" for p in result["coded_mechanisms"]] or ["- (none distilled)"]
    lines += ["", "## Doctrine Phrases Searched (top matches)"]
    lines += [f"- `{h['source']}:{h['line']}` - {h['excerpt']}" for h in doctrine_hits[:30]] or ["- (no doctrine hits)"]
    lines += ["", "## Divergences (doctrine teaches it, low code similarity)"]
    lines += [f"- **{d['doctrine_phrase']}** (`{d['doctrine_source']}`, sim={d['similarity']}) "
              f"- closest code match: _{d['best_code_match']}_" for d in result["divergences"]] or ["- none found"]
    lines += ["", "## Undocumented Code (mechanism in code, no doctrine support found)"]
    lines += [f"- {u['coded_phrase']} (best doctrine similarity {u['best_doctrine_similarity']})"
              for u in result["undocumented_code"]] or ["- none found"]
    try:
        path.write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")
        return path
    except OSError as e:
        warn(f"could not write report to {path}: {e}")
        return None


def main(argv):
    if not argv:
        print(json.dumps({"error": "usage: w1_doctrine_audit.py <StrategyIdentifier>"}))
        return 2
    strategy = argv[0]
    base = {"strategy": strategy, "class_qualified_name": None, "methods_analyzed": [],
            "coded_mechanisms": [], "doctrine_phrases": [], "divergences": [], "undocumented_code": []}

    results, err = find_strategy(strategy)
    if err:
        print(json.dumps({**base, "jina_status": "skipped:no-code-found", "verdict": f"NOT_FOUND: {err}"}, indent=2))
        return 1

    class_node, methods = select_methods(results, strategy)
    snippets = fetch_snippets(methods)
    if not snippets:
        print(json.dumps({**base, "class_qualified_name": class_node["qualified_name"] if class_node else None,
                           "jina_status": "skipped:no-snippets",
                           "verdict": "NOT_FOUND: class/methods matched but no code snippets could be fetched"}, indent=2))
        return 1

    curated_phrases, comment_phrases = distill_coded_mechanisms(snippets)
    coded_phrases = curated_phrases + comment_phrases
    terms = extract_terms(strategy, curated_phrases)  # curated vocabulary only — see distill_coded_mechanisms docstring
    hits, missing_roots = ripgrep_doctrine(terms, DOCTRINE_ROOTS)
    doctrine_hits = build_doctrine_phrases(hits, terms)
    divergences, undocumented, jina_status = compute_gap(coded_phrases, doctrine_hits)
    verdict = verdict_for(divergences, undocumented, jina_status)

    result = {**base, "class_qualified_name": class_node["qualified_name"] if class_node else None,
              "methods_analyzed": [s["name"] for s in snippets], "coded_mechanisms": coded_phrases,
              "doctrine_phrases": [h["excerpt"] for h in doctrine_hits], "divergences": divergences,
              "undocumented_code": undocumented, "jina_status": jina_status,
              "doctrine_roots_missing": missing_roots, "verdict": verdict}
    write_report(result, doctrine_hits)
    print(json.dumps(result, indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
