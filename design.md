# Design

The rules the site is built to. Short on purpose; it grows as decisions are made.

## Type

- Headings are set in Bricolage Grotesque, at medium (500) or semibold (600) and nothing else.
- Everything that is not a heading is set in Onest at medium (500). No regular, no light, no bold in running text.
- No monospace anywhere, including code samples and labels. Where a label needs to read as a label, spacing and size do the work.
- Sentence case throughout. No title case, no all-caps titles, no tracked-out caps labels.
- Headings are never coloured. They are the foreground colour, full stop.
- Optical sizing is on for Bricolage, so display sizes and text sizes get the drawings made for them.

## Copy

- No numbered lists that stand in for thought. If something is a sequence, the prose says so.
- Plain sentences over labels with colons.

## Voice

- Short and dry. A tooltip is two or three words, a caption is one line, a heading is a plain statement.
- Humour is a nudge, not a joke: "Lights on", "Stars welcome", "Copy, paste, curtain up."
- No idioms standing in for a point, no sales words, no numbered lists, no em dashes in interface copy.
- Say what the thing does before saying why it is good.

## Colour

- Dark by default. The page is near-black, `#0a0a0a`.
- The transitions carry the colour; the page around them stays quiet.
- One accent, `#ff0055`, taken from Ali's desktop scheme. It marks state, never content: focus rings, the selected row in search, text selection. As a fill it is solid with white on it, never a tint; hover goes a shade deeper. Headings, body and links stay in the foreground colour.

## Surfaces

- Nested rounded corners are concentric. The outer radius is the inner radius plus the padding between them. When the padding is large, the layers are separate surfaces and the maths is dropped.
- Borders separate, shadows lift. A card, button, dropdown or popover gets a layered shadow only when it needs depth. A focus ring is a border, never a shadow.
- Shadows are transparent and quiet enough to sit on any background. No shadow is an opaque grey.
- Images get a neutral inset outline so their edges do not blur into the page. One pixel, black or white at ten percent alpha, never tinted with the palette.

## Alignment

- Icons are centred by eye, not by geometry. Arrows, triangles and asymmetric glyphs get a small offset. Fix the SVG first; a pixel of margin is the fallback.
- Headings and short titles use balanced wrapping. Captions, descriptions and list items use pretty wrapping. Long prose and code get neither.
- Numbers that change, such as counters, timers and durations, are tabular so nothing shifts around them.
- Font smoothing is antialiased at the root. Already on.

## Motion in the interface

This is about the site's own controls. The transitions themselves have their own rules.

- Interactive state changes use CSS transitions, so they can retarget when the pointer changes its mind mid-motion. Keyframes are for one-shot entrances and loading only.
- Enter is opacity, a small vertical move and optionally blur. Exit is shorter and quieter than enter, around 150ms.
- Press is a scale to 0.96 on tactile buttons, and it can be turned off where the movement would distract.
- Icon swaps cross-fade with opacity, scale and blur. Nothing pops between visible and hidden.
- Transitions name their properties. `transition: all` does not appear in the codebase.
- `will-change` is used only to fix a measured first-frame stutter on transform, opacity or filter. Never `will-change: all`.

## Touch

- Every interactive control has at least a 40 by 40 pixel hit area, 44 where the layout allows. A small icon gets its area from a pseudo-element, and expanded areas never overlap.

## Checking a polish pass

Before a UI change lands, walk this once: nested corners are concentric, icons sit centred by eye, shadows and borders are each doing their own job, headings do not wrap awkwardly, changing numbers are tabular, images have outlines where they need them, enter and exit are split and subtle, buttons press without exaggeration, no `transition: all` or `will-change: all`, small controls still hit easily.

## Chrome

- The navigation is one floating box, 640px at most, 16px from the top, with a border, a solid page-colour background and no shadow. Its corners are concentric with the controls inside: 14 outside, 6px padding, 8 on the controls.
- Transitions and docs are visible links on wide screens. Below the tablet width they move into a panel that rolls out of the bottom of the same box, so the box grows rather than a second thing appearing.
- Search is a native dialog over a filtered list. It fades and settles in over 220ms and leaves in 150ms; a cross in the corner closes it. It opens on the platform's command or control key with K, on the slash key when not typing, and from the bar, where it is an icon on a grey fill and nothing else. No key hint in the bar; the dialog itself teaches escape.
- The GitHub control reads GitHub with the mark, and the star count sits after it as a small badge on the same grey fill. The count is fetched on the server once an hour and left out when GitHub does not answer. Never a zero.
- Every link and control in the bar is pure black on light and pure white on dark, at full opacity; the rest of the page keeps its softer foreground.
- The theme toggle is one control, sun or moon cross-faded. Dark is the default and the choice is remembered.
- The bar has one marker behind the wordmark and the links. It follows the pointer on a spring curve and settles back on the current page when the pointer leaves. The wordmark's letters lift in turn on hover. Icons that swap rotate a little as they cross-fade. The bar drops in ahead of the headline.
- Every control in the bar has a tooltip, below it, two or three words with a small dry joke: Front row, The good stuff, Actually short, Skip the scrolling, Stars welcome, Lights on or off. Never a sentence, never a pun that needs a second read.
- The install block is the hero's call to action, in the bar's box: manager tabs with a marker that slides on a spring, the command in Onest with a little tracking, a copy control. Switching managers draws the new command across the line; copying sweeps the accent through the text and holds the button pink for a beat. The transition name turns over every two seconds, rolling up out of the line, and holds still while the pointer or focus is on the block so what you see is what you copy. The caption under it is "Copy, paste, curtain up."

## Home page

- Under the hero, six transitions as cards, three across, two on a tablet, one on a phone: a bordered card, the preview inset in its own rounded window, the name and a copy control under it. The grid is the page's black. The field belongs to the hero and fades out over its last 320px, in either theme, with the mask on a wrapper that never moves (parallax would otherwise slide the faded edge out of the clip), so it reads as the hero running out rather than a second surface starting. The first row peeks above the fold.
- Nothing pins and nothing fades on scroll. The field drifts up slower than the page and grows a little as the hero leaves, and the card columns arrive at slightly different speeds. On GSAP ScrollTrigger; reduced motion scrolls plainly.
- A card's preview is the real thing in a frame, playing on its own, at 1:1, never scaled, since a scaled frame brings back sub-pixel hairlines, loaded once when first near the viewport and kept, paused while off screen so returning to it never reloads it. The copy control opens a menu of the four package managers on hover.
- After the grid, in order: an ask in place of testimonials (no card, just a large "Your words could sit right here." over a drifting wall of question-mark tiles at 35% opacity, inert and faded on every edge, a button to post on X at @AhmedAli8177), the tools it is built on (Next.js, GSAP, Tailwind CSS) as brand marks in their own colours (Next.js in the foreground, since it is monochrome) with their names between dashed rules, then the FAQ. Each rises 48px as it comes in, once, with no fade.
- As the grid scrolls away the card columns part at different speeds, the middle one fastest.
- The FAQ is the beui bouncy accordion: rows in one rounded group that split apart around the open one on a spring. Its answers come from the docs and nowhere else. If the docs do not say it, the FAQ does not either.

## Footer

- A row of three: the name with who made it under it, the three links, and the X, GitHub and back-to-top controls.
- Below everything, the wordmark at display size, cut at its middle like a curtain half raised and fading into the page. Its letters rise out of the clip one after another at their own pace once it is in view, and sink back when it leaves so it plays again (tied to scroll it was either too fast or invisible, since the wordmark is only on screen for the page's last stretch), and each lifts and takes the accent under the pointer.
- Links draw an underline from the left on hover; the icons tip and grow a little; the back-to-top arrow nudges up.

## Logo

- The mark is a curtain on a rod with ball finials and rings, two fold lines cut into each drape, and a scalloped hem, parted in the middle. One colour only: pure white on dark, pure black on light, never the accent. The name is Curtain, capital C, everywhere it appears as a name (titles, copy, labels, the demo site); only URLs, package paths and code stay lowercase. The wordmark is in Bricolage Grotesque SemiBold drawn as paths.
- Sources live in logos/export. The favicon follows the tab's theme (app/icon.svg); favicon.ico and the Apple icon are the white mark on the near-black page colour.

## Open

- Light theme: the paper palette exists in the stylesheet but is not the default and is not a decision yet.
