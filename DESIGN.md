# SceneDrive Egypt — design spec (read before touching any component)

Concept: **"Chaos on set, precision on screen."** Raw behind-the-scenes phone footage plays inside an on-set monitor UI; the finished, cinematic version fills the screen behind it. Scroll *cuts* between shots, it never seeks a video. The site extends SceneDrive's existing Instagram identity: black ground, red diagonal slash, white car cutouts, condensed uppercase type.

Audience: Egyptian producers, line producers, ad agencies, directors. Secondary: car lovers. Single conversion: WhatsApp booking.

## Tokens (all in `src/app/globals.css`, use them, never raw hex in components)

```
--ink #0b0b0d   page ground          --ink-2 #141416 raised   --ink-3 #1d1d21 hover
--line #2a2a2f  hairlines            --paper #f1ede6 text     --paper-dim #a9a49b secondary
--paper-mute #6f6b64 captions        --red #d8232f accent     --red-deep #8f1219 scenes ground
--amber #f2b544 HUD / eyebrow        --rec #ff3b30 REC dot    --ok #9ad4a3 "real footage" tag
```

Single dark theme, deliberate (cinema). No light mode.

## Type (loaded via `next/font/google` in `src/app/[locale]/layout.tsx`, exposed as CSS vars)

- `--font-display` Barlow Condensed 700/800, uppercase, `line-height: .95`, `letter-spacing: .01em`. Headlines, car names, beat titles, stats.
- `--font-body` Barlow 400/500/600. Running text 16px / 1.5. Lead 20px `--paper-dim`.
- `--font-mono` IBM Plex Mono 400/500. Timecode, eyebrows, labels, spec strips, tags. Eyebrows: 12px, `letter-spacing .14em`, uppercase, amber, with a 28px red rule before.
- `--font-arabic` Alexandria 400–800 across the Arabic edition, including Latin car names and technical UI.

Scale: h1 `clamp(64px, 11vw, 148px)`, h2 `clamp(38px, 5.4vw, 64px)`, h3 26px, body 16, small 14, mono 12–13.

## Layout

- `.wrap` max-width 1180px, padding 0 28px. Sections `padding: 96px 0` desktop, 64px mobile, hairline `border-top: 1px solid var(--line)`.
- Grid + gap for siblings, never stacked margins. Wide content scrolls in its own container. `tabular-nums` on numbers.
- Repeated things compose as one object: bay cards, credit rows, beat tiles share edges and inner padding.
- Not everything is a card. Hairlines and type hierarchy first; border/fill only for the one thing that must lift (bay cards, the monitor).

## Signature elements

- **Slash**: `.slash` = 14px wide red bar `skewX(-18deg)`, used as h1 prefix, section transition wipe, primary button shape (button has a slash on its left edge).
- **Monitor UI**: 2px `#3b3b40` border, 6px radius, black, HUD in mono 12px: blinking REC dot, `TC 00:00:00:00`, `A-CAM`. Tag top-left in amber: `MONITOR · RAW FROM SET`.
- **Letterbox stage**: 2.39:1 on desktop, 4:5 on mobile. Subtle grain overlay (CSS repeating-radial-gradient, opacity .18, `mix-blend-mode: overlay`).
- **Tags**: mono 10px uppercase bordered chips. `REAL` in `--ok`.

## Motion rules

- Scroll never seeks video. Scroll selects which looping `<video muted playsinline loop>` is active and applies `scale(1 → 1.08)` on the active layer. Frame-by-frame scrub only on the H2 roll sequence (`/media/seq/h2_roll/NNN.webp`).
- Only the active video plays; neighbours preloaded (`preload="metadata"`), others paused. Use IntersectionObserver for every video outside the hero.
- GSAP + ScrollTrigger (`gsap` package, register plugin client-side). Lenis on desktop only, disabled on touch. `prefers-reduced-motion`: no pinning, poster frames, no autoplay loops.
- Hover on bay cards: reel plays, spec strip lights amber. Transitions 200–350ms ease-out. No parallax on text.

## Copy voice

Short, producer language, active. "We put the car in the scene." "Supercars. Classics. SUVs." "More cars than any set needs. One call." No exclamation marks. Never "leverage", "solutions", "experience". All strings live in `src/i18n/en.ts`; see the binding copy rules below.

## Content sources

- `src/data/site.ts` contact + wordmark strings.
- `src/data/fleet.ts` cars (id, make, model, category, seenIn, reel, card, photo).
- `src/data/productions.ts` credits with media mapping.
- `public/media/v/<code>_<idx>.mp4|.jpg` every Instagram clip (<=720p, audio). `public/media/loop/<name>.mp4|.jpg` muted hero loops. `public/media/p/` photos 1600px, `public/media/t/` thumbs 480px. `public/media/seq/h2_roll/NNN.webp` roll frames.

## Component contract

Each section lives in `src/components/<Name>/<Name>.tsx` + `<Name>.module.css`, default export. Server sections take `{locale, t}`; client sections call `useT()`. Client components only where interaction requires it (`"use client"`). Shared: `src/components/ui/` (Eyebrow, SlashButton, MonitorFrame, VideoLoop, Tag). Do not restyle another section's files. Accessibility: focus-visible rings (2px amber offset 2px), alt text on every image, buttons are `<button>`, keyboard-operable sliders.

## Copy rules the owner set (binding)

- Never say crash, wreck, rollover, write off, total the car. The offer is "cars for any cinematic scene you need". The H2 desert take stays as footage, described as a take, a shot, a scene.
- No car counts anywhere. Say "more cars than any set needs" and "we can source more".
- No tags like "Crash OK" on cars. No labels calling anything AI-generated.
- English edition has zero Arabic characters. Arabic edition is its own route (/ar), RTL, Alexandria throughout, production titles from `titleAr`, car and brand names stay Latin.
- Generated video plates, 3D models and AI upscales were rejected by the owner (cars drift from the real ones). Only real footage and stills. Generated **key art** images (Nano Banana Pro from the real car photos) were approved: `public/media/art/*.jpg`, used for lineup panels, the hero title card and the OG image.
- Slash cards for cars come from background-removed real photos composed by `raw/make_cards.py` (Higgsfield remove_background + PIL).

## i18n

- Dictionaries: `src/i18n/en.ts` (source of truth, `Dictionary = typeof en`) and `src/i18n/ar.ts`. Client components use `useT()` from `src/i18n/LocaleProvider.tsx`; server components receive `{locale, t}` from `src/app/[locale]/page.tsx`.
- Routes: `/` (rewritten to `/en`) and `/ar`. `<html lang dir>` set in `src/app/[locale]/layout.tsx`. RTL rules: logical CSS properties; image-math controls (wipes, compare sliders) force `dir="ltr"` on the stage only.
