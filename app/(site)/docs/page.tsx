import type { Metadata } from 'next'
import Link from 'next/link'
import { transitions } from '@/lib/transitions'
import { CodeBlock } from '@/components/site/code-block'
import { Mono, Rule, RuleHeading } from '@/components/site/catalogue'

export const metadata: Metadata = {
  title: 'Getting started',
  description:
    'Install a transition with the shadcn CLI, wrap your layout, and you are done. The two engines, what gets intercepted, and the known limits.',
}

/** One page. The library is small enough that a sidebar of stubs would be furniture. */
export default function Docs() {
  const shipped = transitions.filter((t) => t.ready)
  const native = shipped.filter((t) => t.dependencies.length === 0)

  return (
    <main className="mx-auto w-full max-w-3xl px-6 pt-6 pb-24">
      <Rule />
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 py-2 text-muted-foreground">
        <Mono>getting started</Mono>
        <Mono>one page</Mono>
        <Mono>{shipped.length} transitions</Mono>
      </div>
      <Rule />

      <h1 className="mt-14 text-5xl font-medium leading-[1.02] tracking-tight">Getting started.</h1>
      <p className="mt-6 text-lg leading-snug text-muted-foreground">
        Every transition is a provider you wrap around your layout. There is no configuration step,
        no context to thread, and no change to your links.
      </p>

      <section className="mt-16">
        <RuleHeading label="01 — Install" />
        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
          Each transition is its own registry item. Installing one brings that transition, the core
          it runs on, and the shared stylesheet. Nothing else is pulled in.
        </p>
        <div className="mt-5">
          <CodeBlock code="npx shadcn@latest add https://curtain.dev/r/zipper.json" />
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Files land in <code className="font-mono text-[12px]">components/</code>, including{' '}
          <code className="font-mono text-[12px]">transitions.css</code>, which is shared by every
          transition. Installing a second one overwrites that stylesheet with a superset, so the
          order you install in does not matter.
        </p>
      </section>

      <section className="mt-16">
        <RuleHeading label="02 — Wrap your layout" />
        <div className="mt-5">
          <CodeBlock
            label="app/layout.tsx"
            code={`import { ZipperTransition } from '@/components/zipper'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ZipperTransition>{children}</ZipperTransition>
      </body>
    </html>
  )
}`}
          />
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          That is the whole integration. Your existing links are intercepted automatically.
        </p>
      </section>

      <section className="mt-16">
        <RuleHeading label="03 — The two engines" aside="pick by feel" />
        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
          Every transition runs on one of two cores, and which one decides how it behaves more than
          any prop does.
        </p>

        <div className="mt-6 grid gap-px border border-rule bg-rule sm:grid-cols-2">
          <div className="bg-background p-5">
            <Mono className="text-muted-foreground">Overlay · transition-core</Mono>
            <p className="mt-3 text-sm leading-relaxed">
              Something is drawn over the page, the route swaps behind it, then it leaves. The
              overlay is yours to animate, so these carry the most character. They run on GSAP and
              the route does not begin loading until the leave phase finishes.
            </p>
            <p className="mt-3 font-mono text-[11px] text-muted-foreground">
              {shipped.length - native.length} of {shipped.length} · gsap, next-transition-router
            </p>
          </div>
          <div className="bg-background p-5">
            <Mono className="text-muted-foreground">Native · view-transition-core</Mono>
            <p className="mt-3 text-sm leading-relaxed">
              The browser snapshots the outgoing page and both pages are on screen at once, so the
              effect can cut from one to the other. No dependencies and nothing to load, but the
              effect is limited to what can be done to two flat snapshots.
            </p>
            <p className="mt-3 font-mono text-[11px] text-muted-foreground">
              {native.length} of {shipped.length} · no dependencies
            </p>
          </div>
        </div>

        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
          Never both in one transition, and never two installed at once claiming the same
          navigation. Each native transition scopes its own stylesheet, so two of them cannot
          collide, but only one provider should wrap your layout.
        </p>
      </section>

      <section className="mt-16">
        <RuleHeading label="04 — What gets intercepted" />
        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
          A plain left click on a same-origin link, and nothing else. These are all left alone and
          behave exactly as the browser intends:
        </p>
        <ul className="mt-5 space-y-2 text-sm leading-relaxed text-muted-foreground">
          <li>— Middle clicks, and clicks held with command, control, shift or alt.</li>
          <li>
            — Links with a <code className="font-mono text-[12px]">target</code> other than{' '}
            <code className="font-mono text-[12px]">_self</code>, and links with{' '}
            <code className="font-mono text-[12px]">download</code>.
          </li>
          <li>— External links, and hashes pointing at the page you are already on.</li>
        </ul>
      </section>

      <section className="mt-16">
        <RuleHeading label="05 — Conventions" aside="true of all of them" />
        <ul className="mt-5 space-y-3 text-sm leading-relaxed text-muted-foreground">
          <li>
            <span className="text-foreground">Speed.</span> Every transition takes{' '}
            <code className="font-mono text-[12px]">duration</code> in seconds and{' '}
            <code className="font-mono text-[12px]">speed</code> as a divisor, so{' '}
            <code className="font-mono text-[12px]">speed={'{'}2{'}'}</code> halves the run without
            you rebalancing anything.
          </li>
          <li>
            <span className="text-foreground">Reduced motion.</span> When the visitor asks for
            reduced motion the animation is skipped and the navigation happens instantly. You do
            not opt in.
          </li>
          <li>
            <span className="text-foreground">Failsafe.</span> If an overlay transition never
            reports finishing, the navigation continues anyway. A broken animation cannot trap
            someone behind an opaque screen.
          </li>
          <li>
            <span className="text-foreground">Colour.</span> Transitions that carry a palette expose
            it as custom properties in{' '}
            <code className="font-mono text-[12px]">components/transitions.css</code>. Override
            them there and the change survives a reinstall of any other transition.
          </li>
        </ul>
      </section>

      <section className="mt-16">
        <RuleHeading label="06 — Known limits" />
        <ul className="mt-5 space-y-3 text-sm leading-relaxed text-muted-foreground">
          <li>
            <span className="text-foreground">Back and forward are not animated.</span> History
            navigation snaps. This is true of both engines.
          </li>
          <li>
            <span className="text-foreground">Overlay transitions cost real time.</span> The route
            does not start loading until the leave phase ends. Right for a portfolio, wrong for an
            app with a dozen navigations a minute.
          </li>
          <li>
            <span className="text-foreground">The native ones need the View Transitions API.</span>{' '}
            Chrome 111, Safari 18 and Firefox 132 and up. Older browsers navigate plainly with no
            animation and nothing breaks.
          </li>
          <li>
            <span className="text-foreground">Scroll is not handled.</span> Transitions assume the
            page is at the top.
          </li>
        </ul>
      </section>

      <section className="mt-16">
        <RuleHeading label="07 — Writing your own" />
        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
          The overlay core is engine agnostic. It hands you the overlay element and waits for you to
          say the phase is done.
        </p>
        <div className="mt-5">
          <CodeBlock
            code={`export const MyTransition = createTransition({
  overlay: <svg>…</svg>,

  // Once after mount — measure, set the starting state.
  setup: (overlay) => { … },

  // Before the route changes.
  leave: ({ overlay, done }) => { … },

  // After the route changes.
  enter: ({ overlay, done }) => { … },
})`}
          />
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Link interception, the failsafe and reduced motion all come with it. Read{' '}
          <Link href="/transitions" className="underline underline-offset-4 hover:opacity-70">
            any transition in the catalogue
          </Link>{' '}
          for a worked example.
        </p>
      </section>
    </main>
  )
}
