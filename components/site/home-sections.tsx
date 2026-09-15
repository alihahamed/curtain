'use client'

import { ArrowUpRight, Plus } from 'lucide-react'
import { useState } from 'react'

const X_POST = `https://x.com/intent/post?text=${encodeURIComponent('Built something with curtain @AhmedAli8177 ')}`

/** The ask, in place of testimonials we do not have yet: an empty seat with a way to fill it. */
export function Testimonial() {
  return (
    <section data-reveal className="mx-auto w-full max-w-[40rem] px-4 text-center">
      <div className="rounded-[20px] border border-dashed border-foreground/20 px-6 py-14 sm:px-12">
        <div className="mx-auto mb-7 flex w-fit items-center">
          {[0, 1, 2].map((i) => (
            <span key={i} className="-ml-2 size-9 rounded-full border border-dashed border-foreground/25 bg-background first:ml-0" />
          ))}
          <span className="-ml-2 grid size-9 place-items-center rounded-full border border-foreground/25 bg-foreground text-background">
            <Plus className="size-4" aria-hidden="true" />
          </span>
        </div>
        <h2 className="font-heading text-[clamp(1.75rem,1.2rem+2.2vw,2.75rem)] leading-[1.05] tracking-[-0.015em] text-balance">
          Your words could sit right here.
        </h2>
        <p className="mx-auto mt-4 max-w-[34ch] text-foreground/65">
          Built something with curtain? Tell us and it lands on this page.
        </p>
        <a
          href={X_POST}
          target="_blank"
          rel="noopener"
          className="cta mt-8 inline-flex h-11 items-center gap-2 rounded-[10px] bg-foreground px-5 text-background"
        >
          Leave yours
          <ArrowUpRight className="cta-arrow size-4" aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}

const tools = [
  { name: 'Next.js', href: 'https://nextjs.org' },
  { name: 'GSAP', href: 'https://gsap.com' },
  { name: 'three.js', href: 'https://threejs.org' },
  { name: 'Tailwind CSS', href: 'https://tailwindcss.com' },
  { name: 'shadcn', href: 'https://ui.shadcn.com' },
  { name: 'View Transitions', href: 'https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API' },
]

/** The label on a dashed rule, in sentence case (design.md: no caps labels). */
function RuleLabel({ children }: { children: string }) {
  return (
    <div className="flex items-center gap-4 text-sm text-foreground/50">
      <span className="h-px flex-1 border-t border-dashed border-foreground/20" />
      {children}
      <span className="h-px flex-1 border-t border-dashed border-foreground/20" />
    </div>
  )
}

export function ToolStack() {
  return (
    <section data-reveal className="mx-auto w-full max-w-[44rem] px-4">
      <RuleLabel>Built on</RuleLabel>
      <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-9 gap-y-4">
        {tools.map((t) => (
          <li key={t.name}>
            <a href={t.href} target="_blank" rel="noopener" className="tool font-heading text-[clamp(1.15rem,1rem+0.6vw,1.5rem)] text-foreground/45">
              {t.name}
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-10 border-t border-dashed border-foreground/20" />
    </section>
  )
}

const links = [
  { name: 'Devouring Details', href: 'https://devouringdetails.com' },
  { name: 'rauno.me', href: 'https://rauno.me' },
]

export function Inspired() {
  return (
    <section data-reveal className="mx-auto w-full max-w-[28rem] px-4 text-center">
      <h2 className="flex items-center justify-center gap-3 font-heading text-[clamp(1.75rem,1.2rem+2.2vw,2.5rem)] leading-none tracking-[-0.015em]">
        <span className="size-[0.62em] shrink-0 rounded-full bg-brand" aria-hidden="true" />
        Devouring Details
      </h2>
      <p className="mt-5 text-foreground/65 text-pretty">
        The care in curtain owes a lot to Devouring Details by Rauno Freiberg. If you want to know why an interface feels good, start there.
      </p>
      <ul className="mt-12 flex flex-col gap-1 text-left">
        {links.map((l) => (
          <li key={l.name}>
            <a href={l.href} target="_blank" rel="noopener" className="inspired-link flex h-11 items-center gap-4 text-foreground/65">
              <span className="shrink-0">{l.name}</span>
              <span className="inspired-rule h-px flex-1 bg-foreground/15" />
              <ArrowUpRight className="inspired-arrow size-4 shrink-0" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}

const faqs: { q: string; a: string }[] = [
  {
    q: 'How do I add one?',
    a: 'Install it with the shadcn CLI, then wrap the children of your root layout in it. That is the whole integration.',
  },
  {
    q: 'Do I have to change my links?',
    a: 'No. Plain left clicks on same-origin links are picked up automatically. Clicks held with a modifier, links with a target or download, external links and same-page hashes are left alone.',
  },
  {
    q: 'What happens with reduced motion?',
    a: 'When a visitor asks for reduced motion the animation is skipped and the page changes instantly. You do not have to opt in.',
  },
  {
    q: 'Which browsers does it work in?',
    a: 'The overlay transitions run on GSAP in the page. The native ones need the View Transitions API, so Chrome 111, Safari 18 and Firefox 132 or later. Older browsers simply navigate without the animation.',
  },
  {
    q: 'Does it slow navigation down?',
    a: 'Overlay transitions wait for their leave phase before the next route loads, which suits a portfolio more than an app you click through all day. The native ones have nothing extra to load.',
  },
  {
    q: 'Can I change the colours and timing?',
    a: 'Every transition takes a duration in seconds and a speed that divides it. Colours are custom properties in components/transitions.css, and your overrides survive reinstalling another transition.',
  },
  {
    q: 'Are back and forward animated?',
    a: 'Not yet. History navigation snaps in both engines.',
  },
  {
    q: 'Can I use two at once?',
    a: 'Install as many as you like, but only one should wrap your layout at a time.',
  },
]

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section data-reveal className="mx-auto w-full max-w-[44rem] px-4">
      <h2 className="text-center font-heading text-[clamp(1.75rem,1.2rem+2.2vw,2.75rem)] leading-[1.05] tracking-[-0.015em]">
        Questions, answered
      </h2>
      <div className="mt-12 border-t border-border">
        {faqs.map((f, i) => {
          const isOpen = open === i
          return (
            <div key={f.q} className="border-b border-border">
              <h3 className="font-sans text-base">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="faq-q flex min-h-14 w-full items-center justify-between gap-6 py-3 text-left"
                >
                  {f.q}
                  <Plus className={`faq-icon size-4 shrink-0 text-foreground/60 ${isOpen ? 'faq-icon-open' : ''}`} aria-hidden="true" />
                </button>
              </h3>
              <div id={`faq-${i}`} className={`nav-rollout ${isOpen ? 'nav-rollout-open' : ''}`} inert={!isOpen}>
                <div className="overflow-hidden">
                  <p className={`faq-a max-w-[58ch] pb-5 text-foreground/65 ${isOpen ? 'faq-a-open' : ''}`}>{f.a}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
