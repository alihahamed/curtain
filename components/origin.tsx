'use client'

import { useEffect } from 'react'
import { createViewTransition } from './view-transition-core'
import './transitions.css'

/**
 * Origin.
 *
 * The next page opens out of the thing you clicked. A window the size and
 * shape of the link, in the link's own colour, grows to fill the screen while
 * the page inside it grows to full size. The two edges move together, so it
 * reads as the page swelling out of the button rather than a hole being cut.
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
  /** One colour for every opening, instead of the link's own. */
  fill?: string
}

const DEFAULTS: OriginOptions = {
  duration: 0.5,
  speed: 1,
  dim: 0.25,
  minScale: 0.35,
}

type Source = { x: number; y: number; w: number; h: number; radius: number; fill: string }

/** The link the current click landed on. Recorded in the capture phase, so it is set before the core's own click handler runs. */
let source: Source | null = null

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

    // The page is scaled about its top-left and clipped to the link's rectangle
    // in its own coordinates, so the link frames the page's top-left corner.
    const scale = Math.max(o.minScale, s.w / W, s.h / H)

    const root = document.documentElement.style
    root.setProperty('--origin-x', `${s.x}px`)
    root.setProperty('--origin-y', `${s.y}px`)
    root.setProperty('--origin-scale', String(scale))
    root.setProperty('--origin-right', `${W - s.w / scale}px`)
    root.setProperty('--origin-bottom', `${H - s.h / scale}px`)
    root.setProperty('--origin-radius', `${s.radius / scale}px`)
    root.setProperty('--origin-fill', o.fill ?? s.fill)
    root.setProperty('--origin-dim', String(1 - o.dim))
  },
})
