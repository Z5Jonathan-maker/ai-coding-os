#!/usr/bin/env bash
# W5 Morning Evidence Brief: writes today's autonomous evidence brief.
set -u
REPO="/Users/leonardofibonacci/code/projects/mym-autotrader"
VAULT="$REPO/vault"
FORENSICS="$REPO/forensics"
BRIEF_DIR="$VAULT/24-daily-briefs"
BRIEF="$BRIEF_DIR/$(date +%F).md"
CBM="$HOME/local/bin/codebase-memory-mcp"; DECISION_INDEX="$VAULT/08-decision-register/_INDEX.md"
# Drop leading logger lines before JSON emitted by codebase-memory-mcp.
strip_json_prefix() { awk '{x=$0; sub(/^[[:space:]]*/,"",x); if (seen || substr(x,1,1)=="{" || substr(x,1,1)=="[") {seen=1; print}}'; }
json_project_names() {
  if command -v python3 >/dev/null 2>&1; then
    python3 -c 'import json,sys; d=json.load(sys.stdin); [print(p["name"]) for p in d.get("projects", []) if p.get("name")]' 2>/dev/null
  elif command -v grep >/dev/null 2>&1; then
    grep -o '"name"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/.*"name"[[:space:]]*:[[:space:]]*"//;s/"$//'
  fi
}
summarize_changes() {
  project="$1"
  if command -v python3 >/dev/null 2>&1; then
    PROJECT_NAME="$project" python3 -c 'import json,os,sys; n=os.environ["PROJECT_NAME"]; d=json.load(sys.stdin); seen=set(); files=[]; [files.append(str(f)) or seen.add(str(f)) for f in (d.get("changed_files") or []) if str(f) not in seen]; c=d.get("changed_count", len(files)); sample=", ".join(files[:5]); more=f" (+{len(files)-5} more)" if len(files)>5 else ""; print(f"- {n}: {c} changed file(s)" + (f" — {sample}{more}" if sample else " — no changed files reported"))' 2>/dev/null
  else
    printf -- "- %s: detect_changes captured; install python3 for JSON summary\n" "$project"
  fi
}
snippet() { sed -n '/[^[:space:]]/{s/[[:space:]][[:space:]]*/ /g;s/^ *//;p;q;}' "$1" 2>/dev/null | cut -c1-160; }
recent_forensics() { find "$FORENSICS" \( -type d \( -name connectors -o -iname '*funded*' -o -iname '*live-trading*' \) -prune \) -o -type f \( -name '*.md' -o -name '*.json' \) ! -name config.yaml -mtime -1 -print 2>/dev/null; }
open_decisions() {
  awk -F'|' '
    function trim(x){gsub(/^[ \t]+|[ \t]+$/, "", x); return x}
    BEGIN { c=0 }
    /^\|/ && NF>=5 { d=trim($2); if (d=="Date" || d ~ /^-+$/) next; f=trim($3); dec=trim($4); s=trim($5); if (tolower(s) !~ /(resolved|closed|done|archive|archived|killed)/) { printf "- %s — %s [%s]\n", f, dec, s; c++ }; next }
    /^- \[[0-9][0-9][0-9][0-9]-/ { if (tolower($0) !~ /(resolved|closed|done|archive|archived)/) { print; c++ } }
    END { if (c==0) print "- no open decisions found in register" }' "$1"
}
mkdir -p "$BRIEF_DIR"
# 1. Codebase-memory change detection.
code_section="- no data: $CBM is missing or not executable"; code_has_data=0
if [ -x "$CBM" ]; then
  raw="$("$CBM" cli list_projects 2>&1)"
  status=$?
  projects="$(printf '%s\n' "$raw" | strip_json_prefix | json_project_names)"
  if [ "$status" -eq 0 ] && [ -n "$projects" ]; then
    code_section=""
    while IFS= read -r project; do
      [ -z "$project" ] && continue
      out="$("$CBM" cli detect_changes --project "$project" --since HEAD~5 2>&1)"
      json="$(printf '%s\n' "$out" | strip_json_prefix)"
      line="$(printf '%s\n' "$json" | summarize_changes "$project")"
      [ -z "$line" ] && line="- $project: detect_changes failed or returned no parseable JSON"
      code_section="${code_section}${line}"$'\n'
      code_has_data=1
    done <<< "$projects"
  else
    code_section="- no data: codebase-memory list_projects returned no parseable projects"
  fi
fi
# 2. New forensics verdicts.
verdict_section="- no data: forensics directory or find command unavailable"; verdict_count=0
if [ -d "$FORENSICS" ] && command -v find >/dev/null 2>&1; then
  verdict_section=""
  while IFS= read -r file; do
    [ -z "$file" ] && continue
    rel="${file#$FORENSICS/}"
    head="$(snippet "$file")"
    [ -n "$head" ] && verdict_section="${verdict_section}- ${rel} — ${head}"$'\n' || verdict_section="${verdict_section}- ${rel}"$'\n'
    verdict_count=$((verdict_count + 1))
  done < <(recent_forensics)
  [ "$verdict_count" -eq 0 ] && verdict_section="- no new verdicts in the last 24h"
fi
# 3. Open decisions from the directory-backed register.
if [ ! -f "$DECISION_INDEX" ] && [ -d "$VAULT" ] && command -v find >/dev/null 2>&1; then
  DECISION_INDEX="$(find "$VAULT" \( -type d \( -name connectors -o -iname '*funded*' -o -iname '*live-trading*' \) -prune \) -o -type f \( -name '_INDEX.md' -o -iname '*decision*register*.md' \) ! -name config.yaml -print 2>/dev/null | head -n 1)"
fi
decision_has_data=0
if [ -n "$DECISION_INDEX" ] && [ -f "$DECISION_INDEX" ]; then
  decision_section="$(open_decisions "$DECISION_INDEX")"
  decision_has_data=1
else
  decision_section="- no decision register found"
fi
# 4. Assemble the brief. Re-running overwrites today's file.
top_signal="No recent code-memory changes, forensic verdicts, or open decisions were found."
[ "$decision_has_data" -eq 1 ] && top_signal="No fresh verdict files were found, but the decision register still carries active constraints for today's work."
[ "$code_has_data" -eq 1 ] && top_signal="Codebase-memory has recent cross-project change signal; check changed paths for drift before prioritizing new experiments."
[ "$verdict_count" -gt 0 ] && top_signal="Recent forensics produced ${verdict_count} updated verdict file(s); review those before changing R&D direction."
{
  printf '# W5 Morning Evidence Brief - %s\n\n' "$(date +%F)"
  printf '## Code changes\n%s\n\n' "$code_section"
  printf '## New verdicts\n%s\n\n' "$verdict_section"
  printf '## Open decisions\n%s\n\n' "$decision_section"
  printf '## Top signal\n%s\n' "$top_signal"
} > "$BRIEF"
# 5. Final stdout line is machine-capturable.
printf '%s\n' "$BRIEF"
