import Link from 'next/link'
import { transitions } from '@/lib/transitions'
import { Hero } from '@/components/site/hero'
import { InstallSteps } from '@/components/site/install-steps'
import { SpecimenBand } from '@/components/site/specimen-band'
import { RuleHeading, SpecTable } from '@/components/site/catalogue'

export default function Home() {
  const shipped = transitions.filter((t) => t.ready)
  const zeroDep = shipped.filter((t) => t.dependencies.length === 0)
  const featured = shipped.slice(0, 3)

  return (
    <main>
      <div className="mx-auto w-full max-w-6xl px-6 pt-6">
        <Hero count={shipped.length} zeroDep={zeroDep.length} />
      </div>

      <div className="mx-auto mt-20 w-full max-w-6xl px-6">
        <RuleHeading label="Integration" aside="three steps" />
        <div className="mt-5">
          <InstallSteps />
        </div>
      </div>

      {/* Bands run full bleed — the colour is the point, and a margin would cage it. */}
      <section className="mt-20">
        <div className="mx-auto w-full max-w-6xl px-6">
          <RuleHeading label="Latest" aside={`${shipped.length} in the catalogue`} />
        </div>
        <div className="mt-5 border-t border-rule">
          {featured.map((t, i) => (
            <SpecimenBand key={t.slug} t={t} index={i} />
          ))}
        </div>
        <div className="mx-auto w-full max-w-6xl px-6 pt-4">
          <Link
            href="/transitions"
            className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
          >
            See all {shipped.length} →
          </Link>
        </div>
      </section>

      <div className="mx-auto mt-20 mb-24 grid w-full max-w-6xl gap-12 px-6 sm:grid-cols-2">
        <div>
          <RuleHeading label="The set" />
          <SpecTable
            className="mt-5"
            rows={[
              ['transitions', shipped.length],
              ['no dependencies', `${zeroDep.length} of ${shipped.length}`],
              ['engines', 'GSAP · View Transitions'],
              ['licence', 'MIT'],
            ]}
          />
        </div>
        <div>
          <RuleHeading label="What you write" />
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
            One provider around your layout. Existing links are intercepted for you, new tabs and
            modified clicks are left alone, and a transition that fails to finish never traps
            anyone behind it. Reduced motion skips the animation entirely.
          </p>
          <Link
            href="/docs"
            className="mt-5 inline-block font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
          >
            Getting started →
          </Link>
        </div>
      </div>
    </main>
  )
}
