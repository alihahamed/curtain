import Link from 'next/link'
import { Suspense, type ReactNode } from 'react'
import { AutoAdvance } from '@/components/site/auto-advance'

export type Layout = 'left' | 'centre' | 'split' | 'bottom' | 'stats' | 'card'

/**
 * A small demo site for the preview frames, called curtain like the library:
 * a bar, a short hero in one of six layouts, a footer. The whole page is one
 * link, so a click anywhere turns the page. Copy is a few words; the hero is
 * there to give the transition a real page to move, not to be read. Sizes
 * are in vw so the same page reads in a 450px card and a full lab frame.
 */
export function PreviewShell({
  step,
  href,
  accent,
  bg,
  fg,
  layout = 'left',
  sub,
  children,
}: {
  step: string
  href: string
  accent: string
  /** Some transitions need something to happen against — char on black is invisible. */
  bg?: string
  /** Text colour, for a light bg where the site's light text would vanish. */
  fg?: string
  layout?: Layout
  /** One short line under the heading. */
  sub?: string
  children: ReactNode
}) {
  const h = 'font-heading text-[clamp(14px,4.4vw,40px)] leading-[1.04] tracking-[-0.015em]'
  const p = 'text-[clamp(9px,2vw,13px)] leading-snug opacity-60'
  const btn = 'inline-block rounded-[1.2vw] px-[2.6vw] py-[1.2vw] text-[clamp(9px,2vw,12px)]'
  const filled = { background: accent, color: '#fff' }

  const body: Record<Layout, ReactNode> = {
    left: (
      <div className="flex flex-1 flex-col justify-center px-[5vw]">
        <p className={`${h} max-w-[14ch]`}>{children}</p>
        {sub && <p className={`${p} mt-[1.6vw] max-w-[36ch]`}>{sub}</p>}
        <div className="mt-[3vw] flex gap-[1.4vw]">
          <span className={btn} style={filled}>Start</span>
          <span className={`${btn} border border-current/25`}>Work</span>
        </div>
      </div>
    ),
    centre: (
      <div className="flex flex-1 flex-col items-center justify-center px-[8vw] text-center">
        <span className="mb-[2vw] size-[1.4vw] rounded-full" style={{ background: accent }} />
        <p className={`${h} max-w-[16ch]`}>{children}</p>
        {sub && <p className={`${p} mt-[1.6vw] max-w-[36ch]`}>{sub}</p>}
      </div>
    ),
    split: (
      <div className="grid flex-1 grid-cols-[1.1fr_1fr] items-center gap-[5vw] px-[5vw]">
        <div>
          <p className={`${h} max-w-[12ch]`}>{children}</p>
          {sub && <p className={`${p} mt-[1.6vw] max-w-[30ch]`}>{sub}</p>}
        </div>
        <div className="aspect-[4/3] rounded-[2vw] border border-current/15 p-[2.4vw]" style={{ background: `linear-gradient(135deg, ${accent}55, transparent 70%)` }}>
          <div className="h-[1.2vw] w-[60%] rounded-full bg-current/25" />
          <div className="mt-[1.4vw] h-[1.2vw] w-[40%] rounded-full bg-current/15" />
          <div className="mt-[1.4vw] h-[1.2vw] w-[50%] rounded-full bg-current/15" />
        </div>
      </div>
    ),
    bottom: (
      <div className="flex flex-1 flex-col justify-end px-[5vw] pb-[2vw]">
        <div className="mb-[2.4vw] h-px w-full bg-current/15" />
        <div className="flex items-end justify-between gap-[4vw]">
          <p className={`${h} max-w-[12ch]`}>{children}</p>
          {sub && <p className={`${p} max-w-[24ch] text-right`}>{sub}</p>}
        </div>
      </div>
    ),
    stats: (
      <div className="flex flex-1 flex-col justify-center px-[5vw]">
        <p className={`${h} max-w-[14ch]`}>{children}</p>
        <div className="mt-[3.2vw] grid grid-cols-3 gap-[2vw] border-t border-current/15 pt-[2.4vw]">
          {[
            ['9', 'transitions'],
            ['1', 'line to add'],
            ['0', 'config'],
          ].map(([n, l]) => (
            <div key={l}>
              <div className="font-heading text-[clamp(13px,3.6vw,30px)] leading-none tabular-nums">{n}</div>
              <div className={`${p} mt-[0.8vw]`}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    card: (
      <div className="flex flex-1 items-center justify-center px-[5vw]">
        <div className="w-full max-w-[72%] rounded-[2vw] border border-current/15 bg-current/5 p-[3.2vw]">
          <div className="mb-[2.2vw] flex items-center gap-[1.2vw]">
            {[0, 1, 2].map((i) => (
              <span key={i} className="size-[2.4vw] rounded-full border border-current/20" style={{ background: accent, opacity: 1 - i * 0.3, marginLeft: i ? '-1.2vw' : 0 }} />
            ))}
            <span className={p}>3 people here</span>
          </div>
          <p className={`${h} max-w-[14ch]`}>{children}</p>
          {sub && <p className={`${p} mt-[1.4vw]`}>{sub}</p>}
        </div>
      </div>
    ),
  }

  return (
    <Link href={href} className="flex h-dvh flex-col overflow-hidden" style={{ background: bg, color: fg }}>
      <header className="flex items-center justify-between px-[5vw] pt-[3.2vw] text-[clamp(9px,2.2vw,13px)]">
        <span className="font-heading text-[clamp(11px,2.6vw,15px)]">curtain</span>
        <nav className="flex gap-[3vw] opacity-55">
          <span>Work</span>
          <span>Studio</span>
          <span>Journal</span>
        </nav>
        <span className="rounded-full px-[1.8vw] py-[0.5vw]" style={filled}>
          Page {step}
        </span>
      </header>

      {body[layout]}

      <footer className="flex items-center justify-between px-[5vw] pb-[3.2vw] text-[clamp(8px,1.9vw,11px)] opacity-50">
        <span>curtain, a demo</span>
        <span className="preview-hint">click anywhere →</span>
      </footer>
      <Suspense>
        <AutoAdvance href={href} />
      </Suspense>
    </Link>
  )
}
