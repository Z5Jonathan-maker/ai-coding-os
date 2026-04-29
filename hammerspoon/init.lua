-- Hammerspoon starter config — uncomment / extend what's useful.
-- Reload with ⌘⌥⌃ R after edits, or via the menu bar icon.

-- Reload hotkey: ⌘⌥⌃ R
hs.hotkey.bind({"cmd", "alt", "ctrl"}, "R", function()
  hs.reload()
  hs.alert.show("Hammerspoon reloaded")
end)

-- App launchers (fast app switching) — uncomment as you like
-- hs.hotkey.bind({"cmd","alt"}, "B", function() hs.application.launchOrFocus("Safari") end)
-- hs.hotkey.bind({"cmd","alt"}, "T", function() hs.application.launchOrFocus("Ghostty") end)
-- hs.hotkey.bind({"cmd","alt"}, "C", function() hs.application.launchOrFocus("Visual Studio Code") end)
-- hs.hotkey.bind({"cmd","alt"}, "S", function() hs.application.launchOrFocus("Slack") end)
-- hs.hotkey.bind({"cmd","alt"}, "N", function() hs.application.launchOrFocus("Notion") end)

-- Caffeinate toggle: ⌘⌥⌃ C — keep display awake
local caffeineMenu = hs.menubar.new()
local function setCaffeine(state)
  hs.caffeinate.set("displayIdle", state, true)
  if caffeineMenu then
    caffeineMenu:setTitle(state and "☕" or "")
  end
end
hs.hotkey.bind({"cmd","alt","ctrl"}, "C", function()
  setCaffeine(not hs.caffeinate.get("displayIdle"))
end)

-- Show config-loaded notification
hs.notify.new({title = "Hammerspoon", informativeText = "Config loaded"}):send()
