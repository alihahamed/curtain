# Handoff

State of the project at the end of the session on 2026-10-09, written so the
next session can pick up without re-deriving anything. Read `CLAUDE.md` for the
standing conventions and `design.md` for the house style; this file is the
situation.

## What the project is

**Curtain**, a page-transition component library for the Next.js App Router,
installed through a shadcn custom registry (`npx shadcn add <url>/r/<slug>.json`).
Each transition is a drop-in provider wrapped around `{children}` in
`app/layout.tsx`; existing `<Link>`s are intercepted automatically.

- Stack: Next.js 16.3, React 19.2, Tailwind v4, shadcn 4.19, GSAP 3.15,
  next-transition-router 0.2.11, Lenis, next-themes. Dev server is Ali's, on
  `:3000`.
- The eight-transition goal is met and passed. The work since has been the
  site: hero, navbar, search, install block, preview grid, testimonial ask,
  FAQ, footer, logo, listing page, and the full-screen stage.
- The install URL in `lib/transitions.ts` still points at
  `transitions-lib.vercel.app`, which is not deployed, and `metadataBase` says
  `curtain.dev`. **Neither domain is real yet** — clean-install tests use the
  dev server's `/r/` instead.

## Where it stands

**Shipped (10)** — in `registry.json`, built to `public/r/`, `ready: true`,
listed at `/transitions`: crayon, zipper, film-burn, riser, concertina,
dither, slate, spaces, tear, origin.

**Lab only (1)** — `push` (choreography, View Transitions, parallax 0.28,
420ms, `power3`). Built and verified, `ready: false`, not in the registry.
Ali never signed off; it is at `/lab/push`.

**Removed** — `fold-away`. Built, reworked, reverted (`8379929`). Lessons are
in `TRANSITIONS.md` under "Deliberately not doing".

**The site** — `app/(site)` carries the navbar; `app/(stage)` is the bare
full-screen transition page and has no chrome. Pages: `/` (home, the only one
with the footer), `/transitions` (listing: ASCII shader over the top 60%, a
staggered 4-up grid, a fixed filter island, view-transition filtering),
`/transitions/<slug>` (the stage: the demo full screen, an island, a docs
panel), `/docs` (one page, built from `content/docs-draft.md`), `/lab/<slug>`
(harness), `/brand` (logo judging).

**Preview pages** — all eleven now use `PreviewShell`, a small demo site also
called Curtain, in six layouts. Origin passes `fromLink`, which moves the href
onto the two buttons, because it opens the next page out of the element you
clicked.

**Assets** — logo in `logos/export/` (svg, pngs 16–2048), `app/icon.svg`
theme-aware, favicon, apple icon, and `public/og.png` rendered from
`logos/export/og.svg` with resvg. Regenerating the share image needs an Onest
TTF passed with `--use-font-file`; resvg finds no system font for it.

## Architecture

- `registry/transitions/transition-core.tsx` — overlay model. `createTransition({
  defaults, overlay, setup?, leave, enter, timeout? })`. Phases get
  `{ overlay, options, done }`; a phase may return a cleanup. Link interception
  via `TransitionRouter auto`. Reduced motion skips the animation.
- `registry/transitions/view-transition-core.tsx` — `createViewTransition({
  name, defaults, defs, prepare?, paint?, duration })`. Puts `vt-<name>` on
  `<html>` for the navigation so two installed transitions cannot both claim
  `::view-transition-old(root)`. Holds the snapshot open with a keep-alive
  animation. Playwright cannot capture these pseudo-elements.
- `components/` mirrors `registry/transitions/` (copy on every edit).
- `lib/transitions.ts` — one declaration per transition drives the card, the
  API table, Customize, `/lab`, and `ready`. `installCommand()` lives here.
- `app/preview/<slug>/{layout,page,b/page}.tsx` — bare two-page frame. The
  layout reads `usePreviewOptions()` (query string → props, held in state so
  it survives the in-frame navigation). `PreviewShell` takes `bg` and `fg`.
- `app/(site)/lab/[slug]` — `Harness`: iframe of the preview, "Play a
  navigation" (clicks the link inside the frame), live controls, "open full
  size". The listing at `/transitions` filters on `ready`.
- `app/(stage)/transitions/[slug]` — `TransitionStage`: the preview in an
  iframe at full size, an island (docs, play, customise, copy, prev/next) and
  a props popover. It plays by clicking the frame's own link, never
  `router.push`, which would bypass both cores. No autoplay.
- `registry.json` → `npx shadcn build` → `public/r/*.json`. The shared
  `transitions.css` is embedded in every bundle, so a CSS change means a
  rebuild of all of them.

## Per-transition notes worth knowing

**concertina** (`registry/transitions/concertina.tsx`) — reverse-engineered
from accordion.net.au (Barba + GSAP; the bow is two painted arc images over a
flat slat row, no 3D; `loaderMiddle` is a real slat sized by `width`; a white
`.main-overlay` inside the page container is the veil; leave `power4.inOut`,
outro `power3.inOut`, ~847ms; shuffle `loadDuration/1.25`).
- One law: `bite(p) = slotTop(bow) * p` positions the arcs, cuts the slats,
  anchors the page's crop. Everything paints from `p` in `paint()`.
- The page is **found, not wrapped**: element siblings of the overlay in
  `<body>` (skipping SCRIPT/STYLE/LINK/TEMPLATE/NEXT-ROUTE-ANNOUNCER). Lifted
  with `position: relative; z-index: 101` for the duration and restored with
  `clearProps`. Its crop is a `path()` carrying the arc curve (a sub-span of
  a quadratic is a quadratic; control from `mid = (P0 + 2C + P2)/4`). It is
  cropped, never scaled — a scale left a white frame.
- The page's stand-in is **one of the row's slats**, widened by `width` (so
  the flex row reflows and neighbours are pushed apart), not `scaleX`. It
  rides the row's shuffle for free. `centreSlat()`/`slotAt()` read the row's
  travel off the computed transform — GSAP's cache answered 0 for 73px.
- Row: 41 slats, 3vw + 0.5vw gaps (`PITCH` 4vw), window `span` 60vw sized to
  whole pixels (`sizeWindow`) — a fractional `overflow: hidden` edge drew a
  full-height hairline. Slats run 100vh → 45vh on leave, full height across
  the shuffle, arcs alone shape the expansion.
- Slot per page = hash of pathname (`slotFor`), so a page always lands on the
  same bar. Shuffle happens in `enter`, where `location` is the destination.
- Veil is linear in `p` both directions (mirror). Two other curves were tried
  and both were wrong in opposite ways; see commits `fe33065`, `2c6a183`,
  `47457f6`.
- Defaults: `bow 17`, `duration 1.0`, `spread 6`, `span 60`, `slats 41`.
  Meta estimate 2800ms.
- Known limit: the page crop assumes the page element is viewport-sized and
  unscrolled. Their site pins `top: -scrollY`; ours does not handle scroll.

**dither** (`registry/transitions/dither.tsx`) — from teletech.events (a
fixed 32×32 grid of divs, random pop in over 0.5s, then a hard navigation;
their cells are 57×28 rectangles). Ours is a **canvas** painted from one
fill level; tiled Bayer order (`matrix` 2/4/8, default 4); `cells` 32 across
with rows from the aspect ratio so cells are square; `duration 0.5`,
`hold 0.2`, linear; cells pop, nothing fades. `prepare()` measures on every
leave. Verified the 16 tile positions light in matrix order 0→15 and clear
15→0. A module-level `rig` holds the canvas state.

**push** — `::view-transition-new(root)` travels in, old travels the same
way at `parallax` × distance; `brightness()` for the dim (opacity would
cross-dissolve with the page already rendered behind). `parallax 0.28`,
`420ms`, `cubic-bezier(0.2, 0, 0, 1)`.

**zipper** — closes upward now (`19fc0a6`): travel, `parting()`, slider art
(wide mouth up) and the slider's exit all flipped together; the pull tab
still hangs down. `sliderYFor()` is the single source for slider position.

**film-burn** — the scoping bug: `.vt-film-burn ::view-transition-old(root)`
(with a space) matches nothing. Fixed in `cff76c5`.

**riser** — 700ms, `tilt 18`, `perspective 800`, CSS-driven, no `paint`.

**crayon** — `.crayon svg` scoping; the old `.transition-overlay svg` rule
forced every later transition's svg to full size and was still in the built
bundles until `3bf5f83`.

## Methodology that paid off, and traps that bit

- Reverse-engineer a site by reading its inline/JS source **and** sampling
  it frame by frame with `gsap.globalTimeline.timeScale(0.1–0.2)`. Fit eases
  numerically against `power3`/`power4` rather than eyeballing — the eye was
  wrong twice. For hard-navigating sites, stash samples in `sessionStorage`
  on `pagehide` and read them on the next page.
- Sampling windows shorter than the transition produced two false "the
  expansion never runs" readings. Compute the length at the chosen speed.
- A hand-frozen frame verifies maths, not wiring: the arc-sign bug looked
  perfect frozen and was wrong live.
- `elementFromPoint` is blind inside the overlay (`pointer-events: none`).
  Scan rects geometrically instead.
- GSAP snaps `clip-path` when current (px) and target (vh/vw) units differ;
  drive it from a number in `onUpdate`. `gsap.getProperty` can disagree with
  the DOM; read `getComputedStyle().transform`.
- Python `str.replace` on lines that differ only by indentation matches the
  substring inside the longer line and silently edits the wrong phase.
- Perf from headless Chrome is not Ali's machine. Riser measured *worse* per
  frame than fold-away and felt premium; what mattered was one gesture in
  ~0.7s versus five events over 2.1s.
- `next build` while `next dev` runs is fine, but delete `.next/types`
  afterwards. Kill throwaway servers by port.

## Session commit log (newest first, this session)

```
df29190 Move origin onto the demo shell too
5d13b40 Move riser and film burn onto the demo shell
dc41abb Point the metadata at the share image
0acf0ab Draw the share image
0ccb063 Add a typecheck script
74bf53d Remove the specimen band
947f2ef Remove the old preview frame
0874b6f Stage: no navbar, no autoplay, no theme toggle, a plainer props list
d91f5b0 A transition's page is now the transition, full screen
2245e49 Animate the catalogue filter
522615c Listing: wider grid, island fixed in place
49fc136 ASCII field over the listing, footer on the home page only
74f9ac4 Transitions listing: a staggered grid and a floating filter island
a3c69db Rebuild the transitions listing as a live grid
3d00f4c Smooth scrolling with Lenis
2c8c188 Draft the docs content, section by section
0de3e42 License the library under MIT
3d83ed2 Capitalise Curtain across the site
273e37b Ship the curtain logo: finials and rings, capital C
```

`git log` has the rest; the house style for messages is in there too.

## Open items, in priority order

1. **Docs content.** `content/docs-draft.md` is written and waiting on Ali's
   read. Two bracketed notes in it are facts to verify before they go on the
   page: whether the shadcn MCP server installs from custom registries, and
   whether Next.js still announces the route to screen readers with each
   engine. The live `/docs` page is the older, shorter version.
2. **Domain and install URL.** `lib/transitions.ts` and `metadataBase` name two
   different hosts, neither deployed. One decision fixes both.
3. **push** — still waiting on Ali's sign-off at `/lab/push`; then promote with
   the two-commit pattern.
4. **`TRANSITIONS.md` "Shipped" table** lists two; it is ten.
5. Clean-install tests for the six added since dither.

## How to drive it

- Lab: `localhost:3000/lab/<slug>`. Stage: `/transitions/<slug>`. Preview:
  `/preview/<slug>` and `/b`; `?speed=0.2` (and any prop) in the query.
- `npm run typecheck` before committing; after a production `next build`,
  clear `.next/types` or `tsc` reads the stale route types.
- The Playwright browser window is the one Ali screenshots from; navigating it
  opens the page for him. Note `browser_run_code_unsafe` wants an
  `async (page) => { ... }` function, not bare statements.
