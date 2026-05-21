# FIVE-MINUTE-DEMO-TRANSCRIPT.md

Generated from:

```sh
cc-demo-five-minute \
  --browser-url 'data:text/html,<title>AI OS Demo</title><body>checked in transcript proof</body>' \
  --max-chars 1000
```

## Result

```text
# Five-Minute AI Coding OS Demo

Dotfiles: ~/dotfiles
Prompt: debug this repo and verify the safest next step
Browser URL: data:text/html,<title>AI OS Demo</title><body>checked in transcript proof</body>

## Product Readiness

Score: 14/14 checks (100%)
Status: product-ready

ok   Product Readiness
```

## Route Proof

```text
Prompt:    "debug this repo and verify the safest next step"
Forced:    (auto-detect)
Selected:  precision -> claude
Fallback:  precision/claude -> design/kimi -> cheap/deepseek

Receipt: {
  "classifier_output": "precision",
  "final_class": "precision",
  "platform": "claude",
  "fallback_chain": [
    {"class":"precision","platform":"claude","id":"tier3"},
    {"class":"design","platform":"kimi","id":"design"},
    {"class":"cheap","platform":"deepseek","id":"tier2"}
  ]
}

ok   Workflow Proof
```

## Repo Proof

```text
Repo: ~/dotfiles
Branch: main
Status: clean
Diff Review Surface: clean
```

## Browser Proof

```text
WebBridge: running=true extension_connected=true port=10086 version=v1.9.10
Browser proof content:
checked in transcript proof

ok   Browser Proof
```

## Cockpit Package Proof

```text
DONE  Packaged: ~/dotfiles/dist/ai-system-cockpit-0.1.0.vsix
Packaged: ~/dotfiles/dist/ai-system-cockpit-0.1.0.vsix

ok   Cockpit Package Proof
```

## Summary

```text
passed=4 failed=0
```
