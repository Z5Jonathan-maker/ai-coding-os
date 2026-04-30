-- Hammerspoon config — productivity hotkeys (window management + app launchers + utilities)
-- Reload via ⌘⌥⌃ R or the menu bar icon.

-- =============== App launchers (⌘⌥⌃ letter) ===============
local function launchOrFocus(name)
  return function() hs.application.launchOrFocus(name) end
end

local hyper = {"cmd", "alt", "ctrl"}
hs.hotkey.bind(hyper, "T", launchOrFocus("Ghostty"))
hs.hotkey.bind(hyper, "B", launchOrFocus("Safari"))
hs.hotkey.bind(hyper, "E", launchOrFocus("Visual Studio Code"))
hs.hotkey.bind(hyper, "S", launchOrFocus("Slack"))
hs.hotkey.bind(hyper, "N", launchOrFocus("Notion"))
hs.hotkey.bind(hyper, "P", launchOrFocus("1Password"))
hs.hotkey.bind(hyper, "L", launchOrFocus("Claude"))

-- =============== Window management (⌘⌥ + arrow / number) ===============
local function moveWindow(rectFunc)
  return function()
    local win = hs.window.focusedWindow()
    if not win then return end
    local f = win:screen():frame()
    rectFunc(win, f)
  end
end

-- Halves
hs.hotkey.bind({"cmd", "alt"}, "Left",
  moveWindow(function(w, f) w:setFrame({x=f.x, y=f.y, w=f.w/2, h=f.h}) end))
hs.hotkey.bind({"cmd", "alt"}, "Right",
  moveWindow(function(w, f) w:setFrame({x=f.x+f.w/2, y=f.y, w=f.w/2, h=f.h}) end))
hs.hotkey.bind({"cmd", "alt"}, "Up",
  moveWindow(function(w, f) w:setFrame({x=f.x, y=f.y, w=f.w, h=f.h/2}) end))
hs.hotkey.bind({"cmd", "alt"}, "Down",
  moveWindow(function(w, f) w:setFrame({x=f.x, y=f.y+f.h/2, w=f.w, h=f.h/2}) end))

-- Fullscreen / center
hs.hotkey.bind({"cmd", "alt"}, "F",
  moveWindow(function(w, f) w:setFrame(f) end))
hs.hotkey.bind({"cmd", "alt"}, "C",
  moveWindow(function(w, f)
    local nf = {x=f.x+f.w*0.1, y=f.y+f.h*0.05, w=f.w*0.8, h=f.h*0.9}
    w:setFrame(nf)
  end))

-- Quadrants (⌘⌥ 1-4)
hs.hotkey.bind({"cmd", "alt"}, "1",
  moveWindow(function(w, f) w:setFrame({x=f.x, y=f.y, w=f.w/2, h=f.h/2}) end))
hs.hotkey.bind({"cmd", "alt"}, "2",
  moveWindow(function(w, f) w:setFrame({x=f.x+f.w/2, y=f.y, w=f.w/2, h=f.h/2}) end))
hs.hotkey.bind({"cmd", "alt"}, "3",
  moveWindow(function(w, f) w:setFrame({x=f.x, y=f.y+f.h/2, w=f.w/2, h=f.h/2}) end))
hs.hotkey.bind({"cmd", "alt"}, "4",
  moveWindow(function(w, f) w:setFrame({x=f.x+f.w/2, y=f.y+f.h/2, w=f.w/2, h=f.h/2}) end))

-- =============== Reload + caffeinate (⌘⌥⌃) ===============
hs.hotkey.bind(hyper, "R", function()
  hs.reload()
  hs.alert.show("Hammerspoon reloaded")
end)

local caffeineMenu = hs.menubar.new()
local function setCaffeine(state)
  hs.caffeinate.set("displayIdle", state, true)
  if caffeineMenu then caffeineMenu:setTitle(state and "☕" or "") end
end
hs.hotkey.bind(hyper, "K", function()
  setCaffeine(not hs.caffeinate.get("displayIdle"))
end)

-- =============== Lock screen (⌘⌥⌃ Q) ===============
hs.hotkey.bind(hyper, "Q", function()
  hs.caffeinate.lockScreen()
end)

-- =============== Pasteboard history (⌘⌥⌃ V) ===============
local pasteHistory = {}
local pasteWatcher = hs.pasteboard.watcher.new(function(content)
  if content and content ~= "" and (#pasteHistory == 0 or content ~= pasteHistory[1]) then
    table.insert(pasteHistory, 1, content)
    if #pasteHistory > 20 then table.remove(pasteHistory) end
  end
end)
pasteWatcher:start()

hs.hotkey.bind(hyper, "V", function()
  local choices = {}
  for i, item in ipairs(pasteHistory) do
    table.insert(choices, {
      text = string.sub(item, 1, 80),
      subText = "#" .. i,
      content = item,
    })
  end
  local chooser = hs.chooser.new(function(c)
    if c then
      hs.pasteboard.setContents(c.content)
      hs.eventtap.keyStrokes(c.content)
    end
  end)
  chooser:choices(choices)
  chooser:show()
end)

-- =============== IPC module so `hs -c '...'` works from terminal ===============
require("hs.ipc")
hs.ipc.cliInstall()

-- =============== Allow AppleScript control (for cc-bootstrap doctor / ad-hoc verification) ===============
-- Lets `osascript -e 'tell application "Hammerspoon" to execute lua code "..."'` work.
-- Without this, AppleScript probes return -50 errors.
hs.allowAppleScript(true)

-- =============== Notification on load ===============
hs.notify.new({title = "Hammerspoon", informativeText = "Config loaded — ⌘⌥⌃ R to reload"}):send()
