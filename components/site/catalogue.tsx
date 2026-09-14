import type { ReactNode } from 'react'

/**
 * Catalogue primitives.
 *
 * The site is a specimen catalogue: structure is drawn with hairline rules and
 * mono labels rather than cards and shadows, so the only colour on a page is
 * the colour a transition brought with it.
 */

/** Small mono label. Used for anything factual: counts, engines, durations, section names. */
export function Mono({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <span className={`font-mono text-[11px] uppercase tracking-[0.18em] ${className}`}>
      {children}
    </span>
  )
}

/** A hairline. */
export function Rule({ className = '' }: { className?: string }) {
  return <hr className={`border-0 border-t border-rule ${className}`} />
}

/**
 * A rule with a label sitting on it, the way a drawing sheet labels a section.
 * The label sits left, the rule runs to the right edge, anything extra sits
 * after it.
 */
export function RuleHeading({
  label,
  aside,
  className = '',
}: {
  label: ReactNode
  aside?: ReactNode
  className?: string
}) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <Mono className="shrink-0 text-muted-foreground">{label}</Mono>
      <Rule className="grow" />
      {aside && <Mono className="shrink-0 text-muted-foreground">{aside}</Mono>}
    </div>
  )
}

/** Key and value rows, ruled like a datasheet. */
export function SpecTable({
  rows,
  className = '',
}: {
  rows: [string, ReactNode][]
  className?: string
}) {
  return (
    <dl className={`border-t border-rule ${className}`}>
      {rows.map(([key, value]) => (
        <div
          key={key}
          className="flex items-baseline justify-between gap-6 border-b border-rule py-2.5"
        >
          <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            {key}
          </dt>
          <dd className="text-right font-mono text-[12px] tabular-nums">{value}</dd>
        </div>
      ))}
    </dl>
  )
}

const INK = '#1c1b1a'
const PAPER = '#f7f4ee'

const rgb = (hex: string) => {
  const n = Number.parseInt(hex.replace('#', ''), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255] as const
}

/**
 * Readable text colour for a band painted in one of a transition's own accents.
 * Half the palettes are near-black and half are near-white, so the band cannot
 * assume either. Relative luminance, the same maths WCAG uses for contrast.
 */
export function inkOn(hex: string) {
  const [r, g, b] = rgb(hex).map((channel) => {
    const s = channel / 255
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.4 ? INK : PAPER
}

/**
 * Which of a transition's accents to paint a band in.
 *
 * Not simply the first one. Six of the palettes lead with a near-white paper
 * tone, which on a paper page produces no band at all — the row dissolves into
 * the background. Picking purely by distance from the paper is no better: it
 * lands on the darkest accent every time and the catalogue becomes a wall of
 * black.
 *
 * So: the most chromatic accent wins, because that is the colour a person
 * would name if you asked them what the transition looks like. Palettes that
 * are genuinely all greys — slate, dither, riser, zipper — have no such colour,
 * and there the darkest accent is used, since a mid grey on paper reads as a
 * smudge rather than a band.
 */
export function bandColor(accents: string[]) {
  const chroma = (hex: string) => {
    const [r, g, b] = rgb(hex)
    return Math.max(r, g, b) - Math.min(r, g, b)
  }
  const lightness = (hex: string) => {
    const [r, g, b] = rgb(hex)
    return r + g + b
  }
  const vivid = accents.reduce((a, b) => (chroma(b) > chroma(a) ? b : a))
  if (chroma(vivid) >= 40) return vivid
  return accents.reduce((a, b) => (lightness(b) < lightness(a) ? b : a))
}
