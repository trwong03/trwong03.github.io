# Tyler Wong portfolio — design master

## Direction
Bench instrument: the page reads like a lab bench at night — warm instrument-panel black, oscilloscope
channel colours (CH1 moss, CH2 terracotta), datasheet mono for readouts. Reacting against the generic
"dev portfolio" of centered type on a flat dark background.

## Palette
Calm, muted pairings in the spirit of Sanzo Wada's *A Dictionary of Color Combinations*, chosen by the user (2026-10-21):
light "moss and paper", dark "sumi ink", terracotta as the second accent.

| Token | Dark (sumi ink) | Light (moss and paper) |
|---|---|---|
| --bg | #232220 | #eee8da |
| --surface | #2b2a27 | #f7f3ea |
| --surface-2 | #33322e | #e5decd |
| --text | #ece6d8 | #2e2b26 |
| --muted | #a59e90 | #6b6457 |
| --line | #3d3b37 | #d8d0be |
| --accent (moss, CH1) | #9daa62 | #5e6b2f |
| --accent-2 (terracotta) | #c98a68 | #93553a |

Theme: `theme.js` sets `data-theme` before paint (saved choice, else system); the switch beside the name saves the choice, and the demo iframe follows via the `storage` event. No JS = dark.

All text pairs >= 4.5:1. Terracotta carries the details (stat numbers, bullets, tags, timeline dots, side rail); moss keeps the name, buttons and switch. Light accent-2 darkened to #93553a so it passes 4.5:1 on --bg (4.77:1).

## Type
- Display + interface: Archivo (400–800, width axis 100–125 for display).
- Readouts, dates, tags: JetBrains Mono 400/500.
- h1 clamp(56px, 11vw, 132px) / h2 clamp(32px, 5vw, 52px) / body 16–18px.

## Space
Base 8px. Sections 96px apart desktop, 64px mobile. Max width 1120px, 16px gutter.

## Motion level
6 — line-masked hero type, counters, live scope trace, belt. No fade-up-on-scroll.

## Density
Medium-high: a bento of projects, each with its own art.

## Visual devices
Flat style (user request, 2026-10-21): no glow, grain, shadows, cursor spotlight or inverted panels; radii 4–8px.
Hero is type-only by user request: oversized name, tagline and intro; no oscilloscope.
1. Bento project grid, flagship cell accented
2. Card art per project (block diagram, page map, entropy bars, keycaps)
3. Counters on the stats strip
4. Line-masked hero name reveal
5. Live Password Mutator demo (real Python via Pyodide)

## Rules that must not move
- prefers-reduced-motion: all motion off, content in final state.
- Visible focus ring (2px accent outline, 3px offset).
- Touch targets >= 44px.
- Text contrast >= 4.5:1.
- No horizontal overflow at 390px.
