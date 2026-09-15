import type { Metadata } from 'next'
import { transitions } from '@/lib/transitions'
import { SpecimenBand } from '@/components/site/specimen-band'
import { Mono, Rule } from '@/components/site/catalogue'

export const metadata: Metadata = {
  title: 'Catalogue',
  description:
    'Every shipped transition. Something covers the screen, the route swaps behind it, it leaves.',
}

export default function Gallery() {
  const shipped = transitions.filter((t) => t.ready)
  const native = shipped.filter((t) => t.dependencies.length === 0).length

  return (
    <main>
      <div className="mx-auto w-full max-w-6xl px-6 pt-24">
        <Rule />
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 py-2 text-muted-foreground">
          <Mono>catalogue</Mono>
          <Mono>{shipped.length} shipped</Mono>
          <Mono>{native} with no dependencies</Mono>
          <Mono>{shipped.length - native} on GSAP</Mono>
        </div>
        <Rule />

        <h1 className="mt-14 max-w-2xl text-5xl font-medium leading-[1.02] tracking-tight">
          Every transition in the set.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-snug text-muted-foreground">
          Each band is painted in the transition&rsquo;s own palette. Each one installs on its own
          and brings only its own dependencies.
        </p>
      </div>

      <div className="mt-14 border-t border-rule">
        {shipped.map((t, i) => (
          <SpecimenBand key={t.slug} t={t} index={i} />
        ))}
      </div>

      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        <Mono className="text-muted-foreground">
          end of catalogue · {shipped.length} transitions
        </Mono>
      </div>
    </main>
  )
}
