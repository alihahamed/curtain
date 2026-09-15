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

- The navigation is one floating box, 640px at most, 16px from the top, with a border and a blurred background and no shadow. Its corners are concentric with the controls inside: 14 outside, 6px padding, 8 on the controls.
- Transitions and docs are visible links on wide screens. Below the tablet width they move into a panel that rolls out of the bottom of the same box, so the box grows rather than a second thing appearing.
- Search is a native dialog over a filtered list. It fades and settles in over 220ms and leaves in 150ms; a cross in the corner closes it. It opens on the platform's command or control key with K, on the slash key when not typing, and from the bar, where it is an icon on a grey fill and nothing else. No key hint in the bar; the dialog itself teaches escape.
- The GitHub control reads GitHub with the mark, and the star count sits after it as a small badge on the same grey fill. The count is fetched on the server once an hour and left out when GitHub does not answer. Never a zero.
- The theme toggle is one control, sun or moon cross-faded. Dark is the default and the choice is remembered.

## Open

- The footer is out until the site has a shape to hang it on.
- Light theme: the paper palette exists in the stylesheet but is not the default and is not a decision yet.
