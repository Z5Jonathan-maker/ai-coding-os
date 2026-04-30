#!/bin/bash
# UserPromptSubmit hook: scan the user's prompt for credential patterns
# BEFORE Claude reads it. If a recognized secret pattern is found, block
# submission with a warning naming the pattern type (but never echoing
# the matched value back into the response).
#
# Patterns covered:
#   AWS access key  AKIA[0-9A-Z]{16}
#   GitHub PAT      ghp_[A-Za-z0-9]{36}
#   GitHub fine     github_pat_[A-Za-z0-9_]{82}
#   GitHub OAuth    gho_[A-Za-z0-9]{36}
#   GitLab PAT      glpat-[A-Za-z0-9_-]{20}
#   OpenAI key      sk-[A-Za-z0-9]{20,}  (also catches sk-proj-)
#   Slack token     xox[baprs]-[A-Za-z0-9-]{10,}
#   Stripe live     sk_live_[A-Za-z0-9]{20,}
#   Anthropic key   sk-ant-[A-Za-z0-9_-]{20,}
#   1P service acct ops_[A-Za-z0-9_-]{40,}
#   Generic JWT     eyJ[A-Za-z0-9_=-]+\.eyJ[A-Za-z0-9_=-]+\.[A-Za-z0-9_=-]+
#   Private keys    -----BEGIN (RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----
set -u

input=$(cat)
prompt=$(printf '%s' "$input" | python3 -c \
  'import json,sys; d=json.load(sys.stdin); print(d.get("prompt",""))' 2>/dev/null)
[ -z "$prompt" ] && exit 0

# Pass the prompt via env var (stdin is consumed by the script heredoc).
export _SECRET_GUARD_PROMPT="$prompt"
matches=$(python3 <<'PY'
import os, re
text = os.environ.get("_SECRET_GUARD_PROMPT", "")
patterns = [
    ("AWS access key",   r"\bAKIA[0-9A-Z]{16}\b"),
    ("GitHub PAT",       r"\bghp_[A-Za-z0-9]{36}\b"),
    ("GitHub fine PAT",  r"\bgithub_pat_[A-Za-z0-9_]{82}\b"),
    ("GitHub OAuth",     r"\bgho_[A-Za-z0-9]{36}\b"),
    ("GitLab PAT",       r"\bglpat-[A-Za-z0-9_-]{20}\b"),
    ("OpenAI key",       r"\bsk-[A-Za-z0-9]{20,}\b"),
    ("Slack token",      r"\bxox[baprs]-[A-Za-z0-9-]{10,}\b"),
    ("Stripe live key",  r"\bsk_live_[A-Za-z0-9]{20,}\b"),
    ("Anthropic key",    r"\bsk-ant-[A-Za-z0-9_-]{20,}\b"),
    ("1P service token", r"\bops_[A-Za-z0-9_-]{40,}\b"),
    ("JWT",              r"\beyJ[A-Za-z0-9_=-]+\.eyJ[A-Za-z0-9_=-]+\.[A-Za-z0-9_=-]+\b"),
    ("PEM private key",  r"-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----"),
]
hits = []
for name, pat in patterns:
    if re.search(pat, text):
        hits.append(name)
print(",".join(hits))
PY
)
unset _SECRET_GUARD_PROMPT

[ -z "$matches" ] && exit 0

# Block with a JSON decision; never echo the matched value.
python3 -c "
import json
msg = '[secret-guard] Your message contains what looks like a real secret: ' + '$matches' + '. ' + \\
      'Aborted before Claude saw it. ' + \\
      'If this is intentional (e.g. you want to revoke this token), ' + \\
      'rephrase the message to refer to it indirectly (e.g. \"the GitHub PAT in 1P item X\") ' + \\
      'and re-submit. If it leaked: rotate it now. Patterns found are not echoed.'
print(json.dumps({'decision': 'block', 'reason': msg}))
"
