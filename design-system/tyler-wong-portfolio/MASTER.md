# Tyler Wong portfolio — design master

## Direction
Bench instrument: the page reads like a lab bench at night — warm instrument-panel black, oscilloscope
channel colours (CH1 amber, CH2 cyan), datasheet mono for readouts. Reacting against the generic
"dev portfolio" of centered type on a flat dark background.

## Palette
| Token | Dark | Light (datasheet paper) |
|---|---|---|
| --bg | #12110f | #f3efe6 |
| --surface | #1a1916 | #fbf8f1 |
| --surface-2 | #22201c | #ece6d8 |
| --text | #ece7dc | #1d1b17 |
| --muted | #a39d90 | #5f594e |
| --line | #34312b | #d9d1c0 |
| --accent (CH1) | #f2b544 | #9a5a00 |
| --accent-2 (CH2) | #5cc8dc | #00718a |

Contrast-risky: accent as small text on light paper (keep >= 4.5:1, #9a5a00 passes); accent-2 never for body text.

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
1. Live, playable oscilloscope in hero (pointer + arrow keys tune it)
2. Bento project grid, flagship cell accented
3. Card art per project (block diagram, page map, entropy bars, keycaps)
4. Skills belt (marquee)
5. Counters on the stats strip
6. Line-masked hero name reveal

## Rules that must not move
- prefers-reduced-motion: all motion off, content in final state.
- Visible focus ring (2px accent outline, 3px offset).
- Touch targets >= 44px.
- Text contrast >= 4.5:1.
- No horizontal overflow at 390px.
