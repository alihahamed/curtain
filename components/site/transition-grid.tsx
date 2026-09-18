'use client'

import { Search } from 'lucide-react'
import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Card } from '@/components/site/bento'
import { transitions } from '@/lib/transitions'

const shipped = transitions.filter((t) => t.ready)
const kinds = [
  { id: 'all', label: 'All' },
  { id: 'overlay', label: 'Overlay' },
  { id: 'native', label: 'Native' },
] as const
type Kind = (typeof kinds)[number]['id']
const kindOf = (deps: string[]) => (deps.length === 0 ? 'native' : 'overlay')

/**
 * The catalogue: every shipped transition as a live card, four to a row with
 * every second card set lower, so the row reads as a wave. Search and the
 * engine filter float in an island at the bottom of the screen. The same cards
 * as the home page, so each one plays and pauses off screen.
 */
export function TransitionGrid() {
  const [query, setQuery] = useState('')
  const [kind, setKind] = useState<Kind>('all')
  const tabs = useRef<HTMLDivElement>(null)
  const [mark, setMark] = useState({ x: 0, w: 0 })

  useLayoutEffect(() => {
    const el = tabs.current?.querySelector<HTMLElement>(`[data-kind="${kind}"]`)
    if (!el) return
    const place = () => setMark({ x: el.offsetLeft, w: el.offsetWidth })
    place()
    const ro = new ResizeObserver(place)
    ro.observe(tabs.current!)
    return () => ro.disconnect()
  }, [kind])

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    return shipped.filter(
      (t) =>
        (kind === 'all' || kindOf(t.dependencies) === kind) &&
        (!q || `${t.name} ${t.tagline}`.toLowerCase().includes(q)),
    )
  }, [query, kind])

  const count = (k: Kind) => (k === 'all' ? shipped.length : shipped.filter((t) => kindOf(t.dependencies) === k).length)

  return (
    <>
      {list.length ? (
        <div className="relative mx-auto mt-16 grid w-full max-w-[84rem] grid-cols-1 gap-5 pb-16 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((t) => (
            <div key={t.slug} className="stagger-cell">
              <Card slug={t.slug} />
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-16 text-center text-foreground/60">
          Nothing matches &ldquo;{query}&rdquo;.{' '}
          <button type="button" onClick={() => { setQuery(''); setKind('all') }} className="footer-link text-foreground">
            Show all
          </button>
        </p>
      )}

      {/* Search and filter float in an island stuck to the bottom of the screen while the
          grid scrolls, and settle under the grid at its end, so they are never out of reach. */}
      <div className="sticky bottom-[calc(1.25rem+env(safe-area-inset-bottom,0px))] z-40 mt-10 flex justify-center">
        <div className="flex w-full max-w-[34rem] items-center gap-1.5 rounded-[16px] border border-border bg-background p-1.5 shadow-[0_12px_40px_-12px_rgb(0_0_0/0.5)]">
          <label className="catalogue-search flex h-10 min-w-0 flex-1 items-center gap-2 rounded-[10px] bg-foreground/[0.06] px-3">
            <Search className="size-4 shrink-0 text-foreground/50" aria-hidden="true" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              aria-label="Search transitions"
              className="h-full w-full min-w-0 bg-transparent text-[15px] outline-none placeholder:text-foreground/40"
            />
          </label>
          <div ref={tabs} role="tablist" aria-label="Engine" className="relative flex shrink-0">
            <span
              aria-hidden="true"
              className="install-marker pointer-events-none absolute top-0 h-10 rounded-[10px] bg-foreground/[0.08]"
              style={{ translate: `${mark.x}px 0`, width: mark.w }}
            />
            {kinds.map((k) => (
              <button
                key={k.id}
                type="button"
                role="tab"
                data-kind={k.id}
                aria-selected={kind === k.id}
                onClick={() => setKind(k.id)}
                className="install-tab relative z-10 flex h-10 items-center gap-1.5 rounded-[10px] px-2.5 text-sm text-foreground/60 aria-selected:text-foreground sm:px-3"
              >
                {k.label}
                <span className="hidden text-xs tabular-nums text-foreground/40 sm:inline">{count(k.id)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
