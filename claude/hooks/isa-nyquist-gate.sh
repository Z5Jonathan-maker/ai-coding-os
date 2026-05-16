#!/bin/bash
# PostToolUse soft-gate: when the Skill tool invokes `executing-plans`, warn
# (non-blocking) if .ai/ISA-*.md AND .ai/NYQUIST.md are not both present in
# the current working directory.
#
# Rationale: the ISA + Nyquist primitives shipped 2026-05-15 are documented
# as MANDATORY before /executing-plans on plans with ≥3 requirements OR any
# payment/auth/compliance work. Documentation alone doesn't enforce — this
# hook surfaces the gate as a visible WARNING in Claude's context, so the
# agent self-corrects (run /isa or /nyquist-gate first) without being hard-
# blocked. User can always override by just continuing.
#
# Inputs: PostToolUse hook receives JSON on stdin including the tool name,
# tool inputs, and cwd. We inspect tool_name == "Skill" and tool input
# .skill == "executing-plans".
#
# Behavior: emits hookSpecificOutput.additionalContext with a WARNING line
# when the gate condition is met. Never blocks (exit 0 always).
#
# Disable: set ISA_GATE_OFF=1 or `touch .ai/.isa-gate-off` in the project.
set -u

[ "${ISA_GATE_OFF:-0}" = "1" ] && exit 0

# Read PostToolUse JSON payload from stdin
input=$(cat 2>/dev/null)
[ -z "$input" ] && exit 0

command -v jq >/dev/null 2>&1 || exit 0

tool_name=$(printf '%s' "$input" | jq -r '.tool_name // .tool // ""' 2>/dev/null)
skill_arg=$(printf '%s' "$input" | jq -r '.tool_input.skill // .input.skill // ""' 2>/dev/null)
cwd=$(printf '%s' "$input" | jq -r '.cwd // ""' 2>/dev/null)

# Only fire on Skill calls to executing-plans
[ "$tool_name" = "Skill" ] || exit 0
[ "$skill_arg" = "executing-plans" ] || exit 0
[ -n "$cwd" ] || exit 0

# Per-project disable
[ -f "$cwd/.ai/.isa-gate-off" ] && exit 0

# Check for the two artifacts
isa_found=0
nyq_found=0
for f in "$cwd"/.ai/ISA-*.md; do
  [ -f "$f" ] && {
    isa_found=1
    break
  }
done
[ -f "$cwd/.ai/NYQUIST.md" ] && nyq_found=1

# If both present, all good — no warning
[ "$isa_found" = "1" ] && [ "$nyq_found" = "1" ] && exit 0

# Compose missing-list and emit WARNING via additionalContext
missing=""
[ "$isa_found" = "0" ] && missing="ISA (.ai/ISA-*.md)"
[ "$nyq_found" = "0" ] && {
  if [ -n "$missing" ]; then
    missing="$missing and NYQUIST (.ai/NYQUIST.md)"
  else
    missing="NYQUIST (.ai/NYQUIST.md)"
  fi
}

warn="[isa-nyquist-gate] /executing-plans invoked without $missing in $cwd/.ai/. "
warn="${warn}Per CLAUDE.md EXECUTION MODE CLASSIFIER, ALGORITHM-mode work requires "
warn="${warn}brainstorming → isa → writing-plans → nyquist-gate → executing-plans. "
warn="${warn}Consider running /isa or /nyquist-gate first. Set ISA_GATE_OFF=1 to silence; "
warn="${warn}touch .ai/.isa-gate-off in this project to silence per-project."

# Emit as PostToolUse additionalContext (non-blocking)
cat <<JSON
{"hookSpecificOutput":{"hookEventName":"PostToolUse","additionalContext":"$warn"}}
JSON

exit 0
