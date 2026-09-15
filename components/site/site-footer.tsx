'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUp } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { GitHubMark } from '@/components/site/site-nav'
import { Tip } from '@/components/site/tip'
import { REPO, formatStars } from '@/lib/github-stars'

const links = [
  { href: '/transitions', label: 'Transitions' },
  { href: '/docs', label: 'Docs' },
  { href: `https://github.com/${REPO}`, label: 'GitHub', external: true },
]

const X_PROFILE = 'https://x.com/AhmedAli8177'

function XMark({ className = '' }: { className?: string }) {
  return <span aria-hidden="true" className={`brand-mark ${className}`} style={{ '--mark': 'url(/brands/x.svg)' } as React.CSSProperties} />
}

/**
 * The footer. A row of links over a giant wordmark cut off at its middle, the
 * way a curtain sits half raised. The letters rise into place as the footer
 * scrolls in, each on its own delay, and lift a little under the pointer.
 */
export function SiteFooter({ stars }: { stars: number | null }) {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      // Tied straight to the scroll: no smoothing to lag behind, no stagger to race
      // ahead, and the whole approach of the footer to happen over. Each letter sits
      // a little lower than the one before and they all land together at the bottom.
      gsap.fromTo(
        '[data-letter]',
        { yPercent: (i: number) => 38 + i * 6 },
        {
          yPercent: 0,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom bottom', scrub: true },
        },
      )
      gsap.from('[data-footer-row] > *', {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <footer ref={root} className="relative mt-auto overflow-hidden border-t border-border">
      <div data-footer-row className="mx-auto grid w-full max-w-6xl gap-10 px-6 pt-16 pb-12 sm:grid-cols-[1.4fr_1fr_auto] sm:px-8">
        <div>
          <Link href="/" className="font-heading text-2xl">
            curtain
          </Link>
          <p className="mt-3 text-sm text-foreground/50">
            Made by{' '}
            <a href={X_PROFILE} target="_blank" rel="noopener" className="footer-link text-foreground/75">
              Ali Ahmed
            </a>
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-col gap-3">
            {links.map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  {...(l.external ? { target: '_blank', rel: 'noopener' } : {})}
                  className="footer-link text-foreground/70"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-wrap items-start gap-2">
          <Tip content="Say hi">
            <a href={X_PROFILE} target="_blank" rel="noopener" aria-label="Ali Ahmed on X" className="footer-icon grid size-10 place-items-center rounded-[10px] border border-border bg-foreground/[0.04] text-foreground/75">
              <XMark className="size-4" />
            </a>
          </Tip>
          <Tip content="Stars welcome">
            <a href={`https://github.com/${REPO}`} target="_blank" rel="noopener" aria-label="curtain on GitHub" className="footer-icon flex h-10 items-center gap-2 rounded-[10px] border border-border bg-foreground/[0.04] px-3 text-sm text-foreground/75">
              <GitHubMark className="size-4" />
              {stars !== null && <span className="tabular-nums">{formatStars(stars)}</span>}
            </a>
          </Tip>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })}
            className="footer-top group flex h-10 items-center gap-2 rounded-[10px] px-3 text-sm text-foreground/60"
          >
            Back to top
            <ArrowUp className="footer-top-arrow size-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* The wordmark, cut at its middle. aria-hidden: the name is already above. */}
      <div aria-hidden="true" className="footer-mark mt-2 flex h-[0.56em] justify-center overflow-hidden font-heading text-[clamp(6rem,24vw,22rem)] leading-[0.8] tracking-[-0.02em] select-none">
        {'curtain'.split('').map((ch, i) => (
          <span key={i} data-letter className="footer-letter inline-block">
            {ch}
          </span>
        ))}
      </div>
    </footer>
  )
}
