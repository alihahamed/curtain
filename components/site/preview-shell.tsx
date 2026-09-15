import Link from 'next/link'
import { Suspense, type ReactNode } from 'react'
import { AutoAdvance } from '@/components/site/auto-advance'

/**
 * A small landing page for the preview frames: a bar, a hero, a footer. The
 * whole page is one link, so a click anywhere turns the page. Page one shows
 * the hero with two buttons; page two shows it over a row of three cards, so
 * the two pages read as two different screens of one site. Sizes are in vw so
 * the same page reads in a 450px card and a full lab frame.
 */
export function PreviewShell({
  step,
  href,
  accent,
  bg,
  fg,
  children,
}: {
  step: string
  href: string
  accent: string
  /** Some transitions need something to happen against — char on black is invisible. */
  bg?: string
  /** Text colour, for a light bg where the site's light text would vanish. */
  fg?: string
  children: ReactNode
}) {
  const two = step === 'two'
  return (
    <Link
      href={href}
      className="flex h-dvh flex-col overflow-hidden"
      style={{ background: bg, color: fg, '--accent': accent } as React.CSSProperties}
    >
      <header className="flex items-center justify-between px-[5vw] pt-[3.5vw] text-[clamp(11px,2.6vw,14px)]">
        <span className="font-heading text-[clamp(13px,3vw,17px)]">Folio</span>
        <nav className="flex gap-[3vw] opacity-60">
          <span>Work</span>
          <span>Studio</span>
          <span>Journal</span>
        </nav>
        <span className="rounded-full px-[2vw] py-[0.6vw] text-white" style={{ background: accent }}>
          Page {step}
        </span>
      </header>

      <div className="flex flex-1 flex-col justify-center px-[5vw]">
        <p className="max-w-[18ch] font-heading text-[clamp(18px,5.6vw,52px)] leading-[1.04] tracking-[-0.015em]">{children}</p>
        <p className="mt-[2vw] max-w-[44ch] text-[clamp(10px,2.4vw,15px)] leading-snug opacity-65">
          {two ? 'The second screen of the same site. Everything above the fold, nothing to scroll.' : 'A small site with a bar, a hero and a footer, so the transition has a real page to move.'}
        </p>
        {two ? (
          <div className="mt-[3.5vw] grid grid-cols-3 gap-[2vw]">
            {['Motion', 'Type', 'Colour'].map((t, i) => (
              <div key={t} className="rounded-[1.6vw] border border-current/15 px-[2.4vw] py-[2vw]">
                <div className="mb-[1.6vw] size-[2.2vw] rounded-full" style={{ background: accent, opacity: 1 - i * 0.3 }} />
                <div className="text-[clamp(10px,2.4vw,14px)]">{t}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-[3.5vw] flex gap-[1.6vw] text-[clamp(10px,2.4vw,14px)]">
            <span className="rounded-[1.4vw] px-[3vw] py-[1.4vw] text-white" style={{ background: accent }}>
              Get started
            </span>
            <span className="rounded-[1.4vw] border border-current/25 px-[3vw] py-[1.4vw]">See the work</span>
          </div>
        )}
      </div>

      <footer className="flex items-center justify-between px-[5vw] pb-[3.5vw] text-[clamp(10px,2.2vw,12px)] opacity-55">
        <span>Folio, a demo site</span>
        <span className="preview-hint">click anywhere →</span>
      </footer>
      <Suspense>
        <AutoAdvance href={href} />
      </Suspense>
    </Link>
  )
}
