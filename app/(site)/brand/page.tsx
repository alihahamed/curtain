import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Logo concepts', robots: { index: false } }

type Concept = { n: number; title: string; blurb: string }

const dir = join(process.cwd(), 'logos', 'concepts')
const read = (file: string) => readFileSync(join(dir, file), 'utf8')

/** Our own SVG files from logos/, drawn inline so currentColor follows each panel. */
function Svg({ markup, className = '' }: { markup: string; className?: string }) {
  return <div className={`[&>svg]:block [&>svg]:size-full ${className}`} dangerouslySetInnerHTML={{ __html: markup }} />
}

const panels = [
  { label: 'Dark', bg: '#0a0a0a', fg: '#ffffff' },
  { label: 'Light', bg: '#f4f1ea', fg: '#000000' },
]

/**
 * A lab page for the logo, like the transition lab: every concept on the dark
 * and the light page, the text pure white or pure black to match, and the icon
 * on its own at favicon sizes. Not linked and not indexed.
 */
export default function Brand() {
  const concepts: Concept[] = JSON.parse(read('concepts.json'))
  return (
    <main className="mx-auto w-full max-w-6xl px-6 pt-28 pb-24">
      <h1 className="font-heading text-[clamp(2rem,1.4rem+2.4vw,3.25rem)] leading-[1.05] tracking-[-0.015em]">Logo concepts</h1>
      <p className="mt-3 max-w-[52ch] text-foreground/60">
        Five directions for the curtain mark. The word follows the theme, pure white on dark and pure black on light; pink is the only colour.
      </p>

      <div className="mt-14 flex flex-col gap-20">
        {concepts.map((c) => {
          const logo = read(`concept-${c.n}.svg`)
          const icon = read(`concept-${c.n}-icon.svg`)
          return (
            <section key={c.n}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-heading text-2xl">
                  {c.n}. {c.title}
                </h2>
                <span className="text-sm text-foreground/50">logos/concepts/concept-{c.n}.svg</span>
              </div>
              <p className="mt-2 max-w-[60ch] text-foreground/60">{c.blurb}</p>

              <div className="mt-6 grid gap-3 md:grid-cols-2">
                {panels.map((p) => (
                  <div key={p.label} className="overflow-hidden rounded-[16px] border border-border" style={{ background: p.bg, color: p.fg }}>
                    <Svg markup={logo} className="aspect-[2/1] w-full" />
                    <div className="flex items-end justify-between gap-4 border-t px-5 py-4" style={{ borderColor: `${p.fg}1a` }}>
                      <div className="flex items-end gap-5">
                        {[64, 32, 16].map((s) => (
                          <div key={s} className="flex flex-col items-center gap-1.5">
                            <div style={{ width: s, height: s }}>
                              <Svg markup={icon} className="size-full" />
                            </div>
                            <span className="text-[11px] opacity-50">{s}px</span>
                          </div>
                        ))}
                      </div>
                      <span className="text-xs opacity-50">{p.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </main>
  )
}
