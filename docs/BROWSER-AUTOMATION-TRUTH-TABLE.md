# BROWSER-AUTOMATION-TRUTH-TABLE.md

Browser automation is a product feature only when the active path is visible.
This system has multiple browser lanes, but they do not mean the same thing.

## Truth Table

| State | What Works | What Does Not Work | Verification |
|---|---|---|---|
| Official Kimi WebBridge extension active in normal Chrome | Real logged-in Chrome tabs, cookies, extension sessions, user browser state | Sites that reject synthetic events or require captchas/manual trust | `~/.kimi-webbridge/bin/kimi-webbridge status` shows `extension_connected=true` with non-shim extension version |
| Kimi WebBridge shim active | Remote browser proof, navigation, snapshots, basic click/fill through persistent headless Chrome profile | User's normal Chrome cookies/session; true official extension approval | `cc-kimi-webbridge-shim status` and `cc-browser-proof --url https://example.com` |
| Playwright fallback active | Clean browser smoke tests, public pages, deterministic CI-style checks | User login sessions unless a dedicated profile is authenticated | Playwright command/test passes against target URL |
| Chrome locked behind macOS loginwindow | Headless/shim routes may still work | Visible UI clicks, Computer Use, Accessibility clicks, normal Chrome extension approval | Window list shows `loginwindow` as on-screen owner |
| Official extension installed but disabled | Extension files exist; Chrome shows it in `chrome://extensions` | WebBridge does not control normal Chrome until user enables it | Chrome Secure Preferences shows Kimi extension but daemon status has `extension_connected=false` |

## Product Rule

Never say "browser automation is working" without naming which browser lane is
active. `cc-kimi-status`, `cc-browser-proof`, and the cockpit should report one
of:

- `official-extension`
- `shim`
- `playwright`
- `locked-session`
- `not-ready`

`cc-browser-proof --json` also returns a bounded proof packet with nonce
boundaries, origin, max/returned/content chars, truncation status, and
`screenshot_path` when a lane provides one. This is the reviewer-facing proof
contract; raw snapshots are implementation detail.

Authenticated replay fixtures are validated by `cc-browser-replay-check`. They
describe workflow steps, assertions, origin allowlists, and proof expectations,
but never store cookies, tokens, passwords, browser storage, or authorization
headers. Live replay still requires the official extension connected to the
user's approved Chrome session.

## Current Boundary

Chrome and macOS intentionally require user approval for externally installed
extensions and Accessibility-driven UI control. The product should guide that
approval cleanly; it should not pretend to bypass it.

## Public Setup Copy

Recommended user-facing language:

> Browser automation has two modes. The official Kimi WebBridge extension uses
> your normal Chrome session after you enable it. The fallback shim is useful for
> remote smoke tests and demos, but it uses its own browser profile and does not
> inherit your logged-in Chrome cookies.
