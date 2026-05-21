# FRESH-CLONE-VERIFY.md

Fresh-clone verification proves the public setup doctor works outside the active
checkout and does not mutate a new home directory.

## Command Shape

```sh
tmp_root=$(mktemp -d)
git clone --depth=1 https://github.com/Z5Jonathan-maker/dotfiles.git "$tmp_root/dotfiles"
HOME="$tmp_root/home" DOTFILES_DIR="$tmp_root/dotfiles" "$tmp_root/dotfiles/install.sh" --dry-run
find "$tmp_root/home" -maxdepth 4 -mindepth 1 -print
rm -rf "$tmp_root"
```

## Verified Result

Date: 2026-05-21

```text
fresh_clone_rc=0
required_missing=0 optional_missing=1 personal_missing=1
Status: first-run-ready
Temp root writes: none
```

Expected optional misses in a clean temp home:

- `cc-router` clone is optional unless the evaluator wants the full local
  router development checkout.
- VS Code extensions are optional until the real installer is run.
- Kimi WebBridge under the temp home is optional.
