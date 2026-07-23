# Product demo video — reusable playbook

How the UniFi (uunifi.com) demo/pitch videos were built. Portable to any web
product. Two methods; pick by goal. Everything is local + free (no paid SaaS).

## Two methods (pick one)

| Method | What it is | When |
|---|---|---|
| **A. Remotion** (flagship) | Video built in **React code** — programmatic motion graphics, frame-by-frame control | Hero/pitch video, max polish ("Stripe/Linear tier"), conversion pieces with kinetic text |
| **B. Playwright capture** | Record the **real running app** in motion (scroll/clicks/animations) → cut with ffmpeg | Fast "authentic real-product" cut; good first pass |

Both render 1920×1080, muxed with CC0 music, then encoded to mp4 + webm + a webp poster and dropped into a click-to-play `<video>` on the landing.

---

## METHOD A — Remotion (the flagship)

Remotion = render React components to video. Because the app is React, you animate brand-accurate UI with real easing.

**1. Install** (in the project)
```
npm i -D remotion @remotion/cli @remotion/google-fonts
```

**2. Structure** (`src/remotion/`)
- `index.ts` → `registerRoot(RemotionRoot)`
- `Root.tsx` → one `<Composition id=… component=… durationInFrames fps width height />` per video
- `<Name>.tsx` → the actual video (a React component)
- `remotion.config.ts` → `Config.setVideoImageFormat("jpeg")`, concurrency

**3. Composition anatomy** (the core API)
- `useCurrentFrame()` — current frame (drives everything)
- `interpolate(frame, [inFrames], [outValues], {extrapolate:"clamp", easing})` — map frame → any value
- `spring({frame, fps, config:{damping,mass}})` — natural entrances
- `<Sequence from={f} durationInFrames={n}>` — place a scene on the timeline; `useCurrentFrame()` inside is **relative** to the scene
- `<Audio src={staticFile("music.mp3")} volume={f=>…} />` — music with a fade envelope
- `<Img src={staticFile("brand/logo.png")} />` — assets read from `public/`

**4. Motion techniques used**
- **Count-ups**: `interpolate(frame,[start,start+dur],[0,target])` + cubic ease, `.toLocaleString()`
- **Filling bars / rings**: animate `width %` or SVG `strokeDashoffset` with a spring
- **Kinetic text**: each line springs up (`translateY` + opacity), staggered by `delay`
- **Logo stinger**: `clipPath: inset(0 ${100-reveal}% 0 0)` wipe + scale spring
- **Device frame**: wrap cards in a fake browser chrome (3 dots + `app.…/url` bar) → reads as "real product"
- **Scene transitions**: per-scene `translateX` enter(+90→0)/exit(0→−90) with `Easing.inOut(cubic)` + opacity fade
- **Persistent branding**: logo bug (`<Img>` top-right), a full-width **progress bar** growing `0→100%` over total frames (completion bias)

**5. Render**
```
npx remotion render src/remotion/index.ts <CompId> out.mp4 --log=error
```
Re-renders are cheap (~few min) → iterate on copy/timing freely.

---

## METHOD B — Playwright real-app capture

```js
// node script, run with NODE_PATH=$(pwd)/node_modules node rec.js
const { chromium } = require('playwright');
const ctx = await (await chromium.launch({ headless:false })) // HEADED — see gotcha
  .newContext({ viewport:{width:1920,height:1080}, recordVideo:{dir:'/tmp/rec', size:{width:1920,height:1080}} });
const page = await ctx.newPage();
await page.goto(url, {waitUntil:'networkidle'});
await page.waitForTimeout(2000);            // let load animations play
await page.evaluate(/* smooth requestAnimationFrame scroll to bottom */);
const v = page.video(); await ctx.close(); await v.saveAs('seg.webm');
```
Then ffmpeg: trim each segment, overlay caption PNGs, crossfade (`xfade`), add intro/outro + music.

---

## MUSIC (free, license-clean)

1. **Source from GitHub CC0**: `SoundSafari/CC0-1.0-Music` (huge CC0-1.0 corpus; the `freepd.com` subfolder = Kevin MacLeod, true public domain — commercial OK, **no attribution**). Index: `madjin/awesome-cc0`.
2. **Pick by data, not by ear** (you can't audition): download ~6 candidates, analyze with **librosa** (`uv run --with librosa`): tempo (BPM), RMS energy, spectral centroid (brightness), onset strength (beat). Want mid-tempo + present energy + a beat = modern/produced; avoid low-energy = sleepy/cheesy.
3. **Build the bed** with ffmpeg: pick the most energetic 30/60s window (RMS argmax), `afade` in/out, `loudnorm=I=-14:TP=-1.5`.
4. Mux: `-map 0:v -map 1:a -c:v copy -c:a aac` (mp4) / `libopus` (webm). Or include in Remotion via `<Audio>` and it bakes in on render.

---

## ENCODE + EMBED

```
# mp4 already from render; make webm + poster
ffmpeg -i out.mp4 -c:v libvpx-vp9 -crf 32 -b:v 0 -row-mt 1 -c:a libopus out.webm
# poster = a clean product frame
ffmpeg -ss 28 -i out.mp4 -vframes 1 poster.png && cwebp -q 88 poster.png -o poster.webp
```
Player: a click-to-play `<video preload="none" poster=…>` with `<source webm>` + `<source mp4>`, a poster overlay + play button; set `muted=false` on click. `preload="none"` avoids the benign `ERR_ABORTED` console noise.

---

## CONVERSION STRUCTURE (the 60s "pitch" arc — reusable copy skeleton)

Sales psychology, not a feature list. Text slides between product proofs:
1. **Hook** — pain + curiosity gap ("You work hard for your money. Do you know where it's all going?"). No logo first.
2. **Contrast** — reframe the category ("Other apps show the past. We show what's ahead.").
3. **Brand promise** — logo + tagline.
4. **Benefit slide → product proof** ×N — each feature preceded by a *benefit* text slide ("Give first" → giving screen). Benefits sell, features tell.
5. **Emotional payoff** — stacked transformation ("Less anxiety. More generosity. A debt-free date. Peace with your money."). Future-pacing.
6. **Trust** — kill the objection ("Bank-level security. Never sold.").
7. **CTA + risk reversal** — "Start free. No card. Cancel anytime."
Triggers used: PAS, loss aversion, contrast, future pacing, identity/values, risk reversal, completion bias (the running progress bar).

---

## GOTCHAS (these cost time — skip the tax)

- **Homebrew ffmpeg has no `drawtext`** (no libfreetype). Render text as PNGs with **ImageMagick** (`magick … label:"text"`) and `overlay` them, or just do all text in Remotion.
- **Playwright headless renders blank app content** (framer-motion `initial opacity:0` / IntersectionObserver `whileInView` don't fire). Run **headed** (`headless:false`) + nudge-scroll to trigger reveals.
- **`node rec.js` can't resolve `playwright`** from /tmp — set `NODE_PATH=$(pwd)/node_modules`.
- **Veo/AI video pillarboxes** a 3:2 image into 16:9 with ~100px black bars — crop: `crop=1080:720:100:0`.
- **Remotion + Next build**: hooks in `.map()` callbacks fail ESLint `rules-of-hooks` (lift `useCurrentFrame()` out); avoid `as const` on spring-config defaults (TS literal-type error).
- **Pick music by librosa metrics**, never by track title — titles lie ("Hopeful" = cheesy corporate piano).

---

## TL;DR pipeline
real screens (Playwright) **or** coded scenes (Remotion) → 1080p render → CC0 music (GitHub + librosa-picked + loudnorm) muxed → mp4+webm+webp poster → click-to-play `<video preload=none>` on the landing. Conversion cut = hook → contrast → benefit-slide/proof ×N → payoff → trust → risk-reversal CTA.
