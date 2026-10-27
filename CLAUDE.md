# trwong03.github.io

Tyler Wong's personal portfolio (computer engineering, UMD). Static site on GitHub Pages:
no build step, no framework, no package.json. Push to `main` on
`https://github.com/trwong03/trwong03.github.io` and it deploys.

## Files
- `index.html`: the whole site, one page. Sections: hero (`#top`), `#projects`, `#experience`,
  `#publications`, `#skills`, `#contact`.
- `style.css`: all styles. Theme tokens on `:root`, light overrides under `:root[data-theme="light"]`.
- `theme.js`: loads in `<head>` before paint. Sets `data-theme` from localStorage `theme`,
  else from the system setting. Also follows `storage` events so the page and the demo iframe stay in sync.
- `main.js` (deferred): Pintos card page-map art, stat counters (IntersectionObserver),
  desktop side rail (ticks placed at each section's real offset), theme switch, report figure
  viewer (`.gallery`), click-to-zoom `<dialog class="zoom">` for `.photos img` and `.gallery img`.
- `portrait.jpg`: hero photo.
- `design-system/tyler-wong-portfolio/MASTER.md`: design source of truth (palette, type, motion, rules).
  Read it before any visual change.
- `demos/`: self-contained live demos, one folder each. `demos/README.md` explains how to add one.
  - `demos/password-mutator/`: runs `Password_Mutator.py` in the browser via Pyodide (jsDelivr, v0.26.4).
    Embedded in the projects grid as an iframe and linked with "Open".
  - `demos/face-detector/`: JS port of the team's classify math running their real config-7 cascade on a
    MIT CBCL face (data baked in from the ENEE408M team2 repo). Paint on the image to see which stage rejects it.
    Buttons have instant CSS hover/focus hints from `data-tip` (native `title` was too slow).
    The iframe in `index.html` loads `demos/face-detector/?v=2`; bump it when the demo changes.
- `images/efds/`: figures from the ENEE408M report, shown in the `.gallery` viewer (main.js) under the face card.
- `images/Bozopad_Complete_sm.jpg` (left) and `images/Bozopad_PCB_sm.jpg` (right): BOZOPAD card photos,
  downscaled from the `.png` originals (which nothing uses now).

## Conventions
- Cache-busting: CSS/JS links use `?v=N` (`index.html` uses `v=18` for `style.css`, `v=11` for `main.js`; the demos use `v=18` for `../../style.css` and `v=7` for
  `../../theme.js`). Bump N in every page that links a file you change.
- Project cards are `<article class="card">` in the `.bento` grid. Width classes (`span3`, `wide`)
  set the layout: flagship 6 / face detector demo + figure viewer 6 / password demo 6 / Pintos 3 + BOZOPAD 3 (two photos). Each card has its own inline SVG or CSS art.
- Every number in the HTML is already final. Animation only counts up to it, so the page reads right without JS.
- New rail sections need a `<nav class="rail">` link whose `href` matches the section id.

## Design rules (from MASTER.md, do not break)
- "Bench instrument" look, flat style: no glow, grain, shadows, cursor spotlight or inverted panels. Radii 4-8px.
- Palette: dark "sumi ink" / light "moss and paper", moss accent (CH1), terracotta `--accent-2`.
  Use the tokens, never raw hex.
- Fonts: Archivo (variable width/weight) and JetBrains Mono 400/500, from Google Fonts.
- `prefers-reduced-motion`: all motion off, content shown in its final state.
- Visible focus ring (2px accent outline, 3px offset). Touch targets >= 44px. Text contrast >= 4.5:1.
- No horizontal overflow at 390px. Max width 1120px, 16px gutter.
- No fade-up-on-scroll.

## Open items (as of 2026-10-27, last push `2c7df0b`)
- "View Resume" buttons (hero + contact) link to `#`. Add the resume PDF to the repo and point both at it.
- `images/Bozopad_Complete.png` / `images/Bozopad_PCB.png` (~700 KB) are unused; delete if not wanted.
- BOZOPAD card is taller than Pintos beside it, so Pintos has empty space at the bottom.
- Hover hints and zoom were not checked in a real browser; check both themes and 390px width.

## Content source
Site copy mirrors the resume. Resume sources live in the sibling folder `../Resumes/`
(latest: `twong_resume_v5.tex` / `twong_resume_v5.pdf`). When experience, projects or skills change,
update both.

## Testing
No test suite. Open `index.html` in a browser, or run `python -m http.server` from the repo root.
The Pyodide demo needs http because it uses `fetch("Password_Mutator.py")`, so `file://` won't work.
Check both themes, phone width (390px), and reduced motion.
