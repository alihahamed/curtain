# Docs draft

Working copy of every docs section before it goes on the site. Facts about the
library come from the code and the current docs page; facts about Ali come from
Ali. Nothing else is invented. Notes in (brackets) are for us, not the page.

---

## Introduction

Curtain is a set of page transitions for the Next.js App Router. Each one is a
component you add with the shadcn CLI and wrap around your layout. After that,
moving between pages looks like a sheet of paper tearing in half, a
clapperboard snapping shut, or a crayon drawing over the screen.

### Why I made it

I'm Ali. I like designing things properly, down to the parts most people never
look at. The small stuff is what gets me going, like a button that gives a little
when you press it, or a menu that unrolls instead of just appearing. When an app moves smoothly I find it genuinely satisfying, and when
it doesn't, I notice.

Page changes are where most sites stop trying. The old page vanishes, the new
one pops in, and for that moment the app no longer feels like one piece. I
wanted those moments to feel designed and to belong to the app they're in, and
I didn't want another set of fades that make every site look alike. So I built
the transitions I wanted on my own projects, and kept going until there were
enough to share.

### How the transitions are made

(Heading to settle. It carries the principles without calling them that.)

Each transition covers or moves the page, changes the route underneath, and
brings the new page in. What sets them apart is character, and most of the time goes into the
timing and into how heavy things feel as they move.

The code ends up in your project. The shadcn CLI copies each transition into
`components/`, so you can read it and change it, and there's no package to keep up to
date.

Setup is one component around your layout. Your links keep working as they
are, and there's nothing to configure first.

Motion should never cost anyone the page. If a visitor's system asks for less
motion, the animation is skipped and the page changes straight away. If an
animation fails to finish, the navigation goes ahead anyway, so a broken effect
can't leave someone stuck behind a covered screen.

---

## Installation

You need a Next.js app on the App Router with shadcn set up. If shadcn isn't
set up yet, run `init` first:

```bash
npx shadcn@latest init
```

Then add a transition (with bun, pnpm, npm and yarn tabs, like the home page):

```bash
npx shadcn@latest add https://curtain.dev/r/tear.json
```

This adds the transition, the core it runs on, and
`components/transitions.css`, a stylesheet every transition shares. Adding a
second transition replaces that file with one that covers both, so the order
you add them in doesn't matter.

Overlay transitions also install GSAP and next-transition-router, and Tear
installs three.js. Native transitions add no packages.

(Possible line, to verify first: the shadcn MCP server can install from custom
registries, so an agent can add a transition from the same URL.)

---

## Usage

Wrap the children of your root layout:

```tsx
// app/layout.tsx
import { TearTransition } from '@/components/tear'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <TearTransition>{children}</TearTransition>
      </body>
    </html>
  )
}
```

From then on, a plain left click on a link to another page of your site plays
the transition.

Every transition takes `duration` in seconds and `speed`, which divides it, so
`speed={2}` plays the whole thing twice as fast.

Transitions with a colour palette read it from custom properties in
`components/transitions.css`. Your changes there survive adding another
transition. Each transition's page lists its props and variables next to a
live preview you can adjust.

There are two kinds of transition. Overlay transitions draw something over the
page with GSAP, change the route behind it, then take it away; they have the
most character, and the next page starts loading only after the covering part
finishes. Native transitions use the browser's View Transitions API, so both
pages are on screen together and nothing extra loads, but the effect is limited
to moving two flat snapshots. Each transition's page says which kind it is.

---

## Accessibility

When a visitor's system asks for less motion, the animation is skipped and the
page changes immediately. You don't have to turn this on.

If an overlay transition never reports that it finished, the navigation
continues after a short timeout, so nobody is left behind a covered screen.

The overlay is marked decorative and never takes keyboard focus.

Only plain left clicks are animated. Middle clicks, clicks with command,
control, shift or alt held, links that open in a new tab, downloads and links
to other sites behave the way the browser normally handles them.

(To check before publishing: that Next.js still announces the new page to
screen readers with each engine. If it does, say so here.)

---

## Troubleshooting

If a transition doesn't play, check the link and the setup:

- The link has a `target` other than `_self`, or a `download` attribute.
- It points to another site, or to a hash on the current page.
- More than one transition is wrapped around the layout. Use one.
- It's a native transition in a browser without the View Transitions API, which
  means Chrome before 111, Safari before 18 or Firefox before 132. The page
  still changes, just without the effect.
- The app uses the Pages Router. Curtain works with the App Router only.

Back and forward don't animate. Moving through history skips the transition
with both kinds.

The page jumps when the transition starts. Transitions assume the page is
scrolled to the top, and scroll position isn't handled yet.

Navigation feels slow. An overlay transition waits for its covering part to
finish before loading the next page. In an app people click through all day,
use a native transition or raise `speed`.

---

## Writing your own

The overlay core works with any animation code. It gives you the overlay
element and waits for you to call `done` at the end of each phase:

```ts
export const MyTransition = createTransition({
  overlay: <svg>…</svg>,
  setup: (overlay) => { /* once, after mount */ },
  leave: ({ overlay, done }) => { /* before the route changes */ },
  enter: ({ overlay, done }) => { /* after the route changes */ },
})
```

(Then a short walk through one real transition, Zipper being the simplest,
showing its setup, leave and enter, plus a paragraph on the native core and its
`prepare` step.)

---

## Transitions

(A sidebar group listing every shipped transition, each linking to its page. No
prose.)

---

## License

Curtain is MIT licensed. You can use the transitions in anything, change them
and ship them, as long as the copyright notice stays with the code. The full
text is in the repository's LICENSE file.
