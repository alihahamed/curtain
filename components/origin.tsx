'use client'

import { useEffect } from 'react'
import { createViewTransition } from './view-transition-core'
import './transitions.css'

/**
 * Origin.
 *
 * The next page opens out of the thing you clicked. A window the size, shape
 * and colour of the link grows to fill the screen while the page inside it
 * grows to full size. As it grows its sides bow outward and flatten again as
 * they meet the edges of the viewport, so it reads as the page swelling out of
 * the button rather than a hole being cut.
 *
 * Everything is read at click time — the rectangle, the corner radius and the
 * background colour of the link, walking up to the nearest painted surface
 * when the link itself is transparent. Nothing is configured in advance and a
 * theme change costs nothing.
 *
 *   // app/layout.tsx
 *   <OriginTransition>{children}</OriginTransition>
 *
 *   // one link that should open in another colour
 *   <Link href="/pricing" data-origin-fill="#0a0a0a">
 */
export type OriginOptions = {
  /** Seconds the page takes to open. */
  duration: number
  /** Divides the duration. Above 1 is faster. */
  speed: number
  /** How far the outgoing page darkens as it is covered, 0 to 1. */
  dim: number
  /**
   * The smallest the incoming page is drawn at the start, as a fraction of
   * full size. A small button at its true scale would frame a smear; at a
   * third the button frames a readable crop of the page's middle.
   */
  minScale: number
  /** How far the sides bow outward while the window grows, as a fraction of each side's length. 0 keeps them straight. */
  bulge: number
  /** One colour for every opening, instead of the link's own. */
  fill?: string
}

const DEFAULTS: OriginOptions = {
  duration: 0.8,
  speed: 1,
  dim: 0.25,
  minScale: 0.35,
  bulge: 0.12,
}

/** Riser's curve, for the window. The slow start holds it on the button for a beat before it swells. */
const EASE = [0.76, 0, 0.24, 1] as const
/**
 * The page inside runs its own curve and lands at LAND of the run. A page
 * drawn at a scale drifting between 0.98 and 1 for the last fifth of a slow
 * ease puts its text on a different sub-pixel phase every frame, and that
 * reads as jitter. This curve ends with a little velocity left, so the
 * content stops rather than crawls, while the window's edge and bulge keep
 * the slow settle to the end. By then the bulge is under one percent.
 */
const CONTENT_EASE = [0.76, 0, 0.35, 0.9] as const
const LAND = 0.85
const STEPS = 60
const KAPPA = 0.5523

type Source = { x: number; y: number; w: number; h: number; radius: number; fill: string }

/** The link the current click landed on. Recorded in the capture phase, so it is set before the core's own click handler runs. */
let source: Source | null = null
/** The geometry `prepare` settled on, for `ready` to animate. */
let start: Source & { scale: number } | null = null

const isClear = (c: string) => c === 'transparent' || /(?:,|\/)\s*0(?:\.0+)?\)$/.test(c)

/** The link's background, or the nearest painted surface behind it. */
const surfaceOf = (el: Element | null) => {
  for (let e = el; e; e = e.parentElement) {
    const c = getComputedStyle(e).backgroundColor
    if (!isClear(c)) return c
  }
  return '#ffffff'
}

const record = (e: MouseEvent) => {
  const a = (e.target as Element | null)?.closest?.('a')
  if (!a) {
    source = null
    return
  }
  const r = a.getBoundingClientRect()
  // Clamp to the viewport; a link half off-screen opens from its visible part.
  const x = Math.max(0, r.left)
  const y = Math.max(0, r.top)
  const w = Math.min(window.innerWidth, r.right) - x
  const h = Math.min(window.innerHeight, r.bottom) - y
  if (w <= 0 || h <= 0) {
    source = null
    return
  }
  source = {
    x,
    y,
    w,
    h,
    // A pill declares a near-infinite radius; the corner it actually draws is half its short side.
    radius: Math.min(parseFloat(getComputedStyle(a).borderTopLeftRadius) || 0, w / 2, h / 2),
    fill: a.dataset.originFill || surfaceOf(a),
  }
}

/** Cubic bezier easing, solved for y at time t. */
const bezier = ([x1, y1, x2, y2]: readonly [number, number, number, number]) => {
  const at = (a: number, b: number, t: number) => 3 * a * (1 - t) ** 2 * t + 3 * b * (1 - t) * t ** 2 + t ** 3
  return (t: number) => {
    let lo = 0
    let hi = 1
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2
      if (at(x1, x2, mid) < t) lo = mid
      else hi = mid
    }
    return at(y1, y2, (lo + hi) / 2)
  }
}

type Pt = [number, number]
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const fmt = (n: number) => (Math.round(n * 100) / 100).toString()

/**
 * A rounded rectangle whose four sides bow outward, top right bottom left,
 * by the amounts in `bows`. Each side is one cubic; each corner is one cubic
 * that picks up the side's leaving tangent, so a bowed side and its corner
 * stay one curve. Twelve cubics whatever the numbers, so every keyframe
 * interpolates with the next.
 */
const pillow = (x: number, y: number, w: number, h: number, r: number, bows: number[]) => {
  const sides: { a: Pt; b: Pt; n: Pt }[] = [
    { a: [x + r, y], b: [x + w - r, y], n: [0, -1] },
    { a: [x + w, y + r], b: [x + w, y + h - r], n: [1, 0] },
    { a: [x + w - r, y + h], b: [x + r, y + h], n: [0, 1] },
    { a: [x, y + h - r], b: [x, y + r], n: [-1, 0] },
  ]
  const cubics = sides.map(({ a, b, n }, i) => {
    // Both controls pushed out by 4/3 of the bow puts the curve's midpoint at exactly the bow.
    const d = (bows[i] * 4) / 3
    const c1: Pt = [lerp(a[0], b[0], 1 / 3) + n[0] * d, lerp(a[1], b[1], 1 / 3) + n[1] * d]
    const c2: Pt = [lerp(a[0], b[0], 2 / 3) + n[0] * d, lerp(a[1], b[1], 2 / 3) + n[1] * d]
    return { a, b, c1, c2 }
  })
  const unit = (from: Pt, to: Pt): Pt => {
    const l = Math.hypot(to[0] - from[0], to[1] - from[1]) || 1
    return [(to[0] - from[0]) / l, (to[1] - from[1]) / l]
  }
  let d = `M ${fmt(cubics[0].a[0])} ${fmt(cubics[0].a[1])}`
  cubics.forEach((s, i) => {
    d += ` C ${fmt(s.c1[0])} ${fmt(s.c1[1])} ${fmt(s.c2[0])} ${fmt(s.c2[1])} ${fmt(s.b[0])} ${fmt(s.b[1])}`
    const next = cubics[(i + 1) % 4]
    const out = unit(s.c2, s.b)
    const into = unit(next.a, next.c1)
    const k = r * KAPPA
    d += ` C ${fmt(s.b[0] + out[0] * k)} ${fmt(s.b[1] + out[1] * k)} ${fmt(next.a[0] - into[0] * k)} ${fmt(next.a[1] - into[1] * k)} ${fmt(next.a[0])} ${fmt(next.a[1])}`
  })
  return `${d} Z`
}

/** Listens for the click. Renders nothing — anything live in the DOM would paint a frame before the snapshot. */
function Recorder() {
  useEffect(() => {
    document.addEventListener('click', record, true)
    return () => document.removeEventListener('click', record, true)
  }, [])
  return null
}

export const OriginTransition = createViewTransition<OriginOptions>({
  name: 'origin',
  defaults: DEFAULTS,
  defs: <Recorder />,
  duration: (o) => o.duration / o.speed,

  prepare: (o) => {
    const W = window.innerWidth
    const H = window.innerHeight
    // No link under the click — keyboard, or a programmatic navigation — opens from the centre.
    const side = Math.min(W, H) * 0.2
    const s: Source = source ?? {
      x: (W - side) / 2,
      y: (H - side) / 2,
      w: side,
      h: side,
      radius: side * 0.12,
      fill: surfaceOf(document.body),
    }
    // Room for the bows: the page has to reach beyond the window on every side.
    const fit = 1 + 2 * o.bulge
    start = { ...s, scale: Math.max(o.minScale, (s.w / W) * fit, (s.h / H) * fit) }

    const root = document.documentElement.style
    root.setProperty('--origin-fill', o.fill ?? s.fill)
    root.setProperty('--origin-dim', String(1 - o.dim))
  },

  ready: (o, seconds) => {
    if (!start) return
    const W = window.innerWidth
    const H = window.innerHeight
    const ease = bezier(EASE)
    const contentEase = bezier(CONTENT_EASE)
    const s = start

    // The window is the shape on screen. The page is scaled about its centre,
    // which travels from the link's centre to the screen's, so there is page
    // beyond the window on every side for the bows to look onto; each bow is
    // held to the room it has so the window never looks past the page's edge.
    const c0: Pt = [s.x + s.w / 2, s.y + s.h / 2]
    const frames = Array.from({ length: STEPS + 1 }, (_, i) => {
      const t = i / STEPS
      const p = ease(t)
      const pc = t >= LAND ? 1 : Math.max(p, contentEase(t / LAND))
      const w = lerp(s.w, W, p)
      const h = lerp(s.h, H, p)
      const wx = lerp(c0[0], W / 2, p) - w / 2
      const wy = lerp(c0[1], H / 2, p) - h / 2
      const r = Math.min(lerp(s.radius, 0, p), w / 2, h / 2)
      // Rounded before the room is measured, so the bows are held against the
      // page as it is actually drawn — two decimals of scale is 4px of page.
      const scale = Math.round(lerp(s.scale, 1, pc) * 1e5) / 1e5
      const tx = Math.round((lerp(c0[0], W / 2, pc) - (W * scale) / 2) * 100) / 100
      const ty = Math.round((lerp(c0[1], H / 2, pc) - (H * scale) / 2) * 100) / 100
      const bow = o.bulge * Math.sin(Math.PI * p)
      const room = [wy - ty, tx + W * scale - (wx + w), ty + H * scale - (wy + h), wx - tx]
      const bows = [bow * w, bow * h, bow * w, bow * h].map((b, k) => Math.max(0, Math.min(b, room[k])))
      return {
        offset: t,
        transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
        window: pillow(wx, wy, w, h, r, bows),
      }
    })

    // Two layers over a coloured backdrop, and neither mixes a composited
    // transform with a main-thread clip. The outgoing page sits on top with
    // the window cut out of it — a clip in screen coordinates on a layer that
    // never moves, so a late main-thread frame delays the edge and moves
    // nothing. Under it the incoming page is only scaled and faded, both on
    // the compositor, rasterised once at full size so its text does not
    // shimmer. Behind both, the image pair's background is the link's colour:
    // it shows through the window while the page is still transparent, and
    // the page condenses out of it. Nothing live in the DOM, nothing to flash.
    const motion = frames.map(({ offset, transform }) => ({ offset, transform }))
    const hole = frames.map(({ offset, window }) => ({
      offset,
      clipPath: `path(evenodd, "M 0 0 H ${W} V ${H} H 0 Z ${window}")`,
    }))
    const arrive = [
      { offset: 0, opacity: 0 },
      { offset: 0.3, opacity: 0 },
      { offset: 0.85, opacity: 1 },
      { offset: 1, opacity: 1 },
    ]

    const root = document.documentElement
    const timing = { duration: seconds * 1000, easing: 'linear', fill: 'both' as const }
    root.animate(motion, { ...timing, pseudoElement: '::view-transition-new(root)' })
    root.animate(arrive, { ...timing, pseudoElement: '::view-transition-new(root)' })
    root.animate(hole, { ...timing, pseudoElement: '::view-transition-old(root)' })
  },
})
