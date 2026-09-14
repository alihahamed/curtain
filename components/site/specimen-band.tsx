import Link from 'next/link'
import type { TransitionMeta } from '@/lib/transitions'
import { bandColor, inkOn } from './catalogue'

/**
 * One transition, as a full-bleed band painted in its own first accent.
 *
 * Cards with a thumbnail were the wrong shape for this library: a transition
 * has no single frame worth photographing, and ten identical rectangles say
 * nothing about ten different characters. A band gives each one the whole
 * width of the page in its own colour, the way a type foundry sets a face in
 * itself, and the remaining accents ride along as a colour bar.
 */
export function SpecimenBand({ t, index }: { t: TransitionMeta; index: number }) {
  const background = bandColor(t.accent)
  const color = inkOn(background)

  return (
    <Link
      href={`/transitions/${t.slug}`}
      className="group block border-b"
      // The divider is drawn in the band's own ink: a paper-toned hairline
      // disappears where two dark bands meet, and three of them sit together.
      style={{ background, color, borderBottomColor: `${color}26` }}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-12 sm:flex-row sm:items-end sm:justify-between sm:gap-12">
        <div className="min-w-0">
          <span className="font-mono text-[11px] tabular-nums opacity-55">
            {String(index + 1).padStart(2, '0')}
          </span>
          <h3 className="mt-1 text-4xl font-medium leading-none tracking-tight transition-transform duration-500 ease-out sm:text-5xl sm:group-hover:translate-x-1.5">
            {t.name}
          </h3>
          <p className="mt-3 max-w-md text-sm leading-snug opacity-70">{t.tagline}</p>
        </div>

        <div className="flex shrink-0 items-end gap-8">
          <dl className="font-mono text-[11px] uppercase tracking-[0.14em] opacity-70">
            <div className="flex justify-between gap-8">
              <dt>engine</dt>
              <dd>{t.engine}</dd>
            </div>
            <div className="mt-1.5 flex justify-between gap-8">
              <dt>deps</dt>
              <dd className="tabular-nums">{t.dependencies.length || 'none'}</dd>
            </div>
            <div className="mt-1.5 flex justify-between gap-8">
              <dt>runs</dt>
              <dd className="tabular-nums">{(t.duration / 1000).toFixed(2)}s</dd>
            </div>
          </dl>

          {/* The rest of the palette, as a registration bar. */}
          <div className="hidden sm:flex" aria-hidden>
            {t.accent.filter((c) => c !== background).map((c) => (
              <span key={c} className="size-6 border" style={{ background: c, borderColor: color }} />
            ))}
          </div>
        </div>
      </div>
    </Link>
  )
}
