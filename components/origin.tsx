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
   * third the button frames a readable crop of the page's top-left corner.
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

/** Riser's curve. The slow start holds the window on the button for a beat before it swells. */
const EASE = [0.76, 0, 0.24, 1] as const
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
 * A rounded rectangle whose four sides bow outward by `bow` times their
 * length. Each side is one cubic; each corner is one cubic that picks up the
 * side's leaving tangent, so a bowed side and its corner stay one curve.
 * Twelve cubics whatever the numbers, so every keyframe interpolates with
 * the next.
 */
const pillow = (w: number, h: number, r: number, bow: number) => {
  const sides: { a: Pt; b: Pt; n: Pt }[] = [
    { a: [r, 0], b: [w - r, 0], n: [0, -1] },
    { a: [w, r], b: [w, h - r], n: [1, 0] },
    { a: [w - r, h], b: [r, h], n: [0, 1] },
    { a: [0, h - r], b: [0, r], n: [-1, 0] },
  ]
  const cubics = sides.map(({ a, b, n }) => {
    const len = Math.hypot(b[0] - a[0], b[1] - a[1])
    // Both controls pushed out by 4/3 of the bow puts the curve's midpoint at exactly the bow.
    const d = (bow * len * 4) / 3
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
  return `path("${d} Z")`
}

/**
 * The colour bridge. Kept above the page, captured as its own snapshot group,
 * and stacked over the incoming page. It runs the same geometry as the page
 * and fades out across the middle of the run, so the first frames are the
 * button's own colour swelling and the page condenses inside it.
 */
function Fill() {
  useEffect(() => {
    document.addEventListener('click', record, true)
    return () => document.removeEventListener('click', record, true)
  }, [])
  return <div className="origin-fill" aria-hidden />
}

export const OriginTransition = createViewTransition<OriginOptions>({
  name: 'origin',
  defaults: DEFAULTS,
  defs: <Fill />,
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
    start = { ...s, scale: Math.max(o.minScale, s.w / W, s.h / H) }

    const root = document.documentElement.style
    root.setProperty('--origin-fill', o.fill ?? s.fill)
    root.setProperty('--origin-dim', String(1 - o.dim))
  },

  ready: (o, seconds) => {
    if (!start) return
    const W = window.innerWidth
    const H = window.innerHeight
    const ease = bezier(EASE)
    const s = start

    // The page is scaled about its top-left and clipped in its own
    // coordinates, so the link frames the page's top-left corner and the
    // clip is the screen shape divided by the scale.
    const frames = Array.from({ length: STEPS + 1 }, (_, i) => {
      const p = ease(i / STEPS)
      const x = lerp(s.x, 0, p)
      const y = lerp(s.y, 0, p)
      const w = lerp(s.w, W, p)
      const h = lerp(s.h, H, p)
      const scale = lerp(s.scale, 1, p)
      const r = Math.min(lerp(s.radius, 0, p), w / 2, h / 2)
      const bow = o.bulge * Math.sin(Math.PI * p)
      return {
        offset: i / STEPS,
        transform: `translate(${fmt(x)}px, ${fmt(y)}px) scale(${fmt(scale)})`,
        clipPath: pillow(w / scale, h / scale, r / scale, bow),
      }
    })

    // The scale and the clip are separate animations on purpose. A path clip
    // cannot run on the compositor, and one effect carrying both would drag
    // the transform onto the main thread with it — the page would then be
    // re-rasterised every frame and its text would shimmer as it lands.
    // Apart, the transform is composited and rasterised once at full size.
    const motion = frames.map(({ offset, transform }) => ({ offset, transform }))
    const shape = frames.map(({ offset, clipPath }) => ({ offset, clipPath }))
    const fade = [
      { offset: 0, opacity: 1 },
      { offset: 0.3, opacity: 1 },
      { offset: 0.85, opacity: 0 },
      { offset: 1, opacity: 0 },
    ]

    const root = document.documentElement
    const timing = { duration: seconds * 1000, easing: 'linear', fill: 'both' as const }
    for (const pseudoElement of ['::view-transition-new(root)', '::view-transition-group(origin-fill)']) {
      root.animate(motion, { ...timing, pseudoElement })
      root.animate(shape, { ...timing, pseudoElement })
    }
    root.animate(fade, { ...timing, pseudoElement: '::view-transition-group(origin-fill)' })
  },
})
