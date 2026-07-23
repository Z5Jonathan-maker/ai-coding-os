#!/usr/bin/env python3
"""W3 - Trace-to-ADR Autopsy (DEV TOOLING, READ-ONLY w.r.t. the trading engine).

After gauntlet/backtest runs, correlate WHAT CODE CHANGED (git / codebase-memory-mcp
detect_changes) with WHAT BEHAVIOR CHANGED (recent engine/state run outputs), and
persist the finding as a durable "engine decision record": institutional memory of
engine changes, distinct from strategy results.

SAFETY: never opens anything under engine/ (incl. engine/state/, engine/forensics/),
config.yaml, or connectors/ in write mode — all engine reads are os.stat + read-only
open() with a byte cap. codebase-memory-mcp is only ever called with detect_changes
(read) and a best-effort ingest_traces; manage_adr is NEVER called for writes (the
in-graph ADR is maintained by self_heal.sh from adr-mym-autotrader.md; the "no_adr"
wipe hazard is self_heal's domain — W3 does not interfere). Persistence targets are
only: ~/.claude/fabric/engine-decision-log.md (append-only) and an optional mirrored
note under vault/15-architecture-decisions/ (docs area, not engine code). All external
calls are wrapped; any missing tool/dir/file degrades to a stderr warning, never a crash.

Run: python3 /Users/leonardofibonacci/.claude/fabric/w3_trace_adr.py   (stdlib-only)
"""
from __future__ import annotations

import json, os, re, subprocess, sys, time
from datetime import datetime, timezone
from pathlib import Path

CBM_BIN = "/Users/leonardofibonacci/local/bin/codebase-memory-mcp"
CBM_PROJECT = "Users-leonardofibonacci-code-projects-mym-autotrader"
CBM_TIMEOUT = 60
REPO = "/Users/leonardofibonacci/code/projects/mym-autotrader"
STATE_DIR = Path(REPO) / "engine" / "state"
FORENSICS_DIR = Path(REPO) / "engine" / "forensics"
DECISION_LOG = Path("/Users/leonardofibonacci/.claude/fabric/engine-decision-log.md")
VAULT_ADR_DIR = Path(REPO) / "vault" / "15-architecture-decisions"

WINDOW_H = 48                 # "recent" window for state files + commit/signal timing
SINCE_REF = "HEAD~10"         # code-change lookback for detect_changes / git fallback
TAIL_BYTES = 50 * 1024        # max bytes read from any jsonl (tail) or big json (head)
GIT_TIMEOUT = 30

# State files most likely to carry verdict/result/status signals, in priority order.
PRIORITY_FILES = ["gauntlet_reconcile_report.json", "gauntlet_errors.jsonl",
                  "brain_history.jsonl", "model_provenance.json", "k_ledger.json",
                  "forward_fills.jsonl", "beliefs.jsonl", "candidates.jsonl",
                  "gap_history.jsonl", "journal_hypotheses.jsonl",
                  "investigation_docket.jsonl", "corpus_intake_state.json"]

# Semantic hint tokens: filename-stem -> extra module/vocabulary tokens worth matching
# against changed code paths (a reconcile report is produced by calibration/cost logic,
# fills by execution/fill logic, etc.).
HINTS = {
    "gauntlet_reconcile_report": ["reconcile", "gauntlet", "calibration", "cost"],
    "gauntlet_errors":         ["gauntlet", "error"],
    "forward_fills":           ["fill", "execution"],
    "forward_snapshots":       ["forward", "snapshot"],
    "brain_history":           ["brain", "telemetry"],
    "model_provenance":        ["model", "provenance", "harvester"],
    "k_ledger":                ["ledger"],
    "beliefs":                 ["belief"],
    "candidates":              ["candidate", "generator", "factory"],
    "gap_history":             ["gap"],
}


def warn(msg): print(f"WARNING: {msg}", file=sys.stderr)


def cbm_call(tool, payload):
    """codebase-memory-mcp cli <tool>, JSON via stdin. Returns (dict|None, error|None)."""
    if not os.path.isfile(CBM_BIN) or not os.access(CBM_BIN, os.X_OK):
        return None, f"binary missing/not executable: {CBM_BIN}"
    try:
        p = subprocess.run([CBM_BIN, "cli", tool], input=json.dumps(payload),
                           capture_output=True, text=True, timeout=CBM_TIMEOUT)
    except Exception as e:
        return None, f"subprocess failed: {e}"
    for stream in (p.stdout or "", p.stderr or ""):  # JSON on stdout; log line on stderr
        idx = stream.find("{")
        if idx != -1:
            try:
                return json.loads(stream[idx:]), None
            except json.JSONDecodeError:
                continue
    return None, f"no parseable JSON from binary (rc={p.returncode})"


def git(*args):
    """Read-only git. Returns stdout or None."""
    try:
        p = subprocess.run(["git", "-C", REPO, *args], capture_output=True, text=True,
                           timeout=GIT_TIMEOUT)
    except Exception as e:
        warn(f"git {' '.join(args)} failed: {e}")
        return None
    if p.returncode != 0:
        warn(f"git {' '.join(args)} rc={p.returncode}: {(p.stderr or '')[:200]}")
        return None
    return p.stdout


# ---------------------------------------------------------------- step 1: behavior
def read_tail(path, nbytes=TAIL_BYTES, head=False):
    """Last (or first, for whole-doc JSON) nbytes of a file, read-only."""
    try:
        with open(path, "rb") as f:
            size = f.seek(0, 2)
            f.seek(0 if head or size <= nbytes else size - nbytes)
            return f.read().decode("utf-8", "replace")
    except OSError as e:
        warn(f"could not read {path}: {e}")
        return ""


def last_jsonl_obj(text):
    for line in reversed(text.strip().splitlines()):
        line = line.strip().lstrip("\ufeff")
        if not line.startswith("{"):
            continue
        try:
            return json.loads(line)
        except json.JSONDecodeError:
            continue  # tail cut may split the first line
    return None


def tokens(text):
    return {t for t in re.findall(r"[a-z0-9]{2,}", text.lower())
            if t not in ("json", "jsonl", "py", "md", "engine", "state", "the", "and",
                 # too generic to be name-overlap evidence (would false-match any
                 # docs/history/report path in a commit)
                 "history", "report", "data", "docs", "k")}


def signal_from(path):
    """Extract a short verdict-style signal + module keywords from one state file."""
    name, mtime = path.name, path.stat().st_mtime
    stem = path.stem
    kw = tokens(stem.replace("_", " ")) | set(HINTS.get(stem, []))
    sig = {"file": str(path), "name": name, "mtime": mtime, "keywords": sorted(kw)}
    text = read_tail(path, head=name.endswith(".json"))
    if name.endswith(".json"):
        try:  # small JSON: whole doc; big JSON: raw_decode just the "summary" object
            doc = json.loads(text)
            summ = doc.get("summary") if isinstance(doc, dict) else None
            sig["signal"] = json.dumps(summ if summ else doc)[:400]
        except json.JSONDecodeError:
            m = re.search(r'"summary"\s*:\s*', text)
            if m:
                try:
                    summ, _ = json.JSONDecoder().raw_decode(text, m.end())
                    sig["signal"] = json.dumps(summ)[:400]
                except json.JSONDecodeError:
                    sig["signal"] = "(summary unparseable)"
            else:
                sig["signal"] = "(JSON head unparseable)"
    else:  # jsonl: last object + cheap aggregate for error logs
        obj = last_jsonl_obj(text)
        if name == "gauntlet_errors.jsonl":
            rows = [l for l in text.strip().splitlines() if l.strip().startswith("{")]
            kinds, mods = {}, set()
            for l in rows[-200:]:
                try:
                    r = json.loads(l)
                except json.JSONDecodeError:
                    continue
                kinds[r.get("error_type", "?")] = kinds.get(r.get("error_type", "?"), 0) + 1
                kw.add(r.get("family", ""))
                mods |= {Path(p).stem for p in re.findall(r'File "([^"]+)"', r.get("traceback", ""))}
            kw |= {k for k in mods if k} | {k for k in kw if k}
            sig["keywords"] = sorted(kw)
            sig["signal"] = (f"{len(rows)} recent error rows; types={kinds}; "
                             f"latest_ts={(obj or {}).get('timestamp')}")[:400]
        elif obj:
            sig["signal"] = json.dumps(obj)[:400]
        else:
            sig["signal"] = "(no parseable jsonl rows)"
    return sig


def collect_signals():
    """Recent (<=WINDOW_H) state/forensics outputs, prioritized, byte-capped."""
    signals = []
    cutoff = time.time() - WINDOW_H * 3600
    if not STATE_DIR.is_dir():
        warn(f"state dir missing: {STATE_DIR}")
    else:
        recent = [p for p in STATE_DIR.iterdir()
                  if p.suffix in (".json", ".jsonl") and p.stat().st_mtime >= cutoff]
        order = {n: i for i, n in enumerate(PRIORITY_FILES)}
        recent.sort(key=lambda p: (order.get(p.name, 99), -p.stat().st_mtime))
        for p in recent[:12]:  # prioritized handful + a few extra; never exhaustive
            try:
                signals.append(signal_from(p))
            except Exception as e:
                warn(f"signal extraction failed for {p.name}: {e}")
    if FORENSICS_DIR.is_dir():
        reps = [p for p in FORENSICS_DIR.iterdir()
                if p.suffix in (".md", ".json") and p.stat().st_mtime >= cutoff]
        for p in reps[:4]:
            try:
                signals.append({"file": str(p), "name": p.name, "mtime": p.stat().st_mtime,
                                "keywords": sorted(tokens(p.stem.replace("_", " "))),
                                "signal": read_tail(p, 4000)[:400]})
            except Exception as e:
                warn(f"forensics read failed for {p.name}: {e}")
    else:
        warn(f"forensics dir missing: {FORENSICS_DIR}")
    return signals


# ---------------------------------------------------------------- step 2: code changes
def collect_commits():
    """Per-commit metadata (hash/ts/subject/files) via git; detect_changes changed_files
    via CBM merged in when available. Git is the authoritative per-commit source."""
    commits, changed_files, cbm_status = [], [], "skipped"
    data, err = cbm_call("detect_changes", {"project": CBM_PROJECT, "since": SINCE_REF})
    if err or not isinstance(data, dict) or "error" in (data or {}):
        cbm_status = f"failed: {err or data.get('error')}"
        warn(f"detect_changes unavailable ({cbm_status}); falling back to git only")
    else:
        changed_files = data.get("changed_files") or []
        cbm_status = f"ok ({len(changed_files)} files)"
    out = git("log", "-10", "--format=%H%x09%ct%x09%s", "--name-only")
    if out:
        cur = None
        for line in out.splitlines():
            if "\t" in line:
                h, ts, subj = line.split("\t", 2)
                cur = {"hash": h[:8], "ts": int(ts), "subject": subj, "files": []}
                commits.append(cur)
            elif line.strip() and cur is not None:
                cur["files"].append(line.strip())
    else:
        warn("git log unavailable; no per-commit data")
    return commits, changed_files, cbm_status


# ---------------------------------------------------------------- step 3: correlate
def correlate(signals, commits):
    """Pair each behavior signal with plausible code changes. Evidence = (a) file/module
    name-token overlap, (b) timing proximity (commit ts near signal mtime). Confidence:
    strong = name+time, weak = exactly one, none = nothing plausible. No fabrication."""
    cutoff = time.time() - WINDOW_H * 3600
    autopsy = []
    for sig in signals:
        kw = set(sig["keywords"])
        best, closest_time_only = [], None
        for c in commits:
            ftoks = set()
            for f in c["files"]:
                parts = re.split(r"[/_\-.]", f)
                ftoks |= tokens(" ".join(parts))
            overlap = sorted(kw & ftoks)
            name_hit = bool(overlap)
            dt = abs(sig["mtime"] - c["ts"])
            time_hit = c["ts"] >= cutoff or dt <= WINDOW_H * 3600
            entry = {"commit": c["hash"], "subject": c["subject"][:90],
                     "overlap": overlap[:8], "hours_apart": round(dt / 3600, 1)}
            if name_hit:
                entry["confidence"] = "strong" if time_hit else "weak"
                best.append(entry)
            elif dt <= 2 * 3600:
                # Time-only: on an actively-committed repo EVERY signal is near some
                # commit, so listing all of them is noise, not evidence. Keep just the
                # single closest commit, explicitly labeled as time-proximity only.
                if closest_time_only is None or dt < closest_time_only["_dt"]:
                    closest_time_only = {**entry, "_dt": dt}
        if closest_time_only:
            closest_time_only.pop("_dt")
            closest_time_only["confidence"] = "weak"
            closest_time_only["note"] = "time-proximity only, no module overlap"
            best.append(closest_time_only)
        best.sort(key=lambda b: (b["confidence"] != "strong", -len(b["overlap"]), b["hours_apart"]))
        autopsy.append({"signal_file": sig["name"], "signal": sig["signal"],
                        "candidates": best[:3],
                        "verdict": ("no clear cause found" if not best else
                                    f"{len(best)} candidate change(s); best={best[0]['confidence']}")})
    return autopsy


# ---------------------------------------------------------------- step 4: persist
def append_decision_log(now, signals, commits, cbm_status, autopsy, ingest_note):
    header = ("# Engine Decision Log (W3 trace-to-ADR autopsy)\n\n"
              "Append-only institutional memory of ENGINE changes (code<->behavior correlations),\n"
              "distinct from strategy results. Written by ~/.claude/fabric/w3_trace_adr.py.\n")
    L = [f"\n## {now} - autopsy run", "",
         f"- code-change source: codebase-memory-mcp detect_changes [{cbm_status}] + git log -10",
         f"- {ingest_note}", "", "### State/report files inspected"]
    for s in signals:
        mt = datetime.fromtimestamp(s["mtime"]).strftime("%Y-%m-%d %H:%M")
        L.append(f"- `{s['name']}` (mtime {mt}): {s['signal'][:220]}")
    L += ["", "### Commits considered"]
    L += [f"- `{c['hash']}` {datetime.fromtimestamp(c['ts']).strftime('%m-%d %H:%M')} "
          f"{c['subject'][:90]} ({len(c['files'])} files)" for c in commits] or ["- (none)"]
    L += ["", "### Autopsy correlations"]
    for a in autopsy:
        L.append(f"- **{a['signal_file']}** -> {a['verdict']}")
        for b in a["candidates"]:
            L.append(f"  - [{b['confidence']}] `{b['commit']}` {b['subject']} "
                     f"| overlap={b['overlap']} | {b['hours_apart']}h apart")
    strong = sum(1 for a in autopsy for b in a["candidates"] if b["confidence"] == "strong")
    weak = sum(1 for a in autopsy for b in a["candidates"] if b["confidence"] == "weak")
    L += ["", f"**TL;DR:** {len(signals)} state files, {len(commits)} commits, "
              f"{strong} strong / {weak} weak correlation(s).", ""]
    try:
        existed = DECISION_LOG.exists()
        with open(DECISION_LOG, "a", encoding="utf-8") as f:  # append-only, never truncate
            if not existed:
                f.write(header)
            f.write("\n".join(L))
        return str(DECISION_LOG)
    except OSError as e:
        warn(f"could not append decision log: {e}")
        return None


def mirror_vault(now, autopsy):
    """Best-effort dated note in the vault docs area. Dated note (not a numbered ADR):
    this is an auto-generated correlation report, not a human architecture decision,
    so it must not consume ADR-00N numbering per ADR-000's template intent."""
    if not VAULT_ADR_DIR.is_dir():
        warn(f"vault ADR dir missing, mirror skipped: {VAULT_ADR_DIR}")
        return None
    path = VAULT_ADR_DIR / f"engine-decision-autopsy-{now[:10]}.md"
    L = ["---", "tags:", "  - engine-decision", "  - auto-generated",
         "status: informational", "type: engine-decision-record", "---",
         f"# Engine Decision Autopsy - {now}", "",
         "Auto-generated by `~/.claude/fabric/w3_trace_adr.py` (W3 trace-to-ADR). "
         "Canonical full record: `~/.claude/fabric/engine-decision-log.md`.", "",
         "## Correlations"]
    for a in autopsy:
        L.append(f"- **{a['signal_file']}** -> {a['verdict']}")
        for b in a["candidates"][:2]:
            L.append(f"  - [{b['confidence']}] `{b['commit']}` {b['subject']} (overlap={b['overlap']})")
    try:
        path.write_text("\n".join(L).rstrip() + "\n", encoding="utf-8")
        return str(path)
    except OSError as e:
        warn(f"vault mirror write failed: {e}")
        return None


def main():
    now = datetime.now(timezone.utc).astimezone().strftime("%Y-%m-%d %H:%M %Z")
    signals = collect_signals()
    commits, changed_files, cbm_status = collect_commits()
    autopsy = correlate(signals, commits)

    # Best-effort trace ingestion; schema is undocumented, so one attempt, log result.
    traces = [{"run_id": s["name"], "timestamp": datetime.fromtimestamp(
                   s["mtime"], timezone.utc).isoformat(),
               "result": s["signal"][:200], "notes": "w3 autopsy signal"} for s in signals[:8]]
    data, err = cbm_call("ingest_traces", {"project": CBM_PROJECT, "traces": traces})
    ingest_note = ("ingest_traces: schema unknown / skipped" if err else
                   f"ingest_traces response: {json.dumps(data)[:200]}"
                   if isinstance(data, dict) and "error" not in data else
                   f"ingest_traces: schema unknown / skipped ({(data or {}).get('error')})")
    if err:
        warn(f"ingest_traces failed (non-fatal): {err}")

    log_path = append_decision_log(now, signals, commits, cbm_status, autopsy, ingest_note)
    vault_path = mirror_vault(now, autopsy)

    tiers = {"strong": 0, "weak": 0}
    for a in autopsy:
        for b in a["candidates"]:
            tiers[b["confidence"]] += 1
    print(json.dumps({
        "run": now, "state_files_inspected": len(signals),
        "commits_considered": len(commits),
        "detect_changes_status": cbm_status,
        "correlations": {**tiers, "signals_with_no_clear_cause":
                         sum(1 for a in autopsy if not a["candidates"])},
        "ingest_traces": ingest_note,
        "written": {"decision_log": log_path, "vault_mirror": vault_path},
        "engine_writes": 0}, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
