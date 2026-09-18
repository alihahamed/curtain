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
 * The catalogue: every shipped transition as a live card, with a search over
 * names and taglines and a filter for the two engines. The same cards as the
 * home page, so each one plays and pauses off screen.
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
      <div className="mx-auto mt-10 flex w-full max-w-[42rem] flex-col items-stretch gap-2 sm:flex-row">
        <label className="catalogue-search flex h-11 shrink-0 items-center sm:flex-1 gap-2.5 rounded-[12px] border border-border bg-background px-3.5">
          <Search className="size-[18px] shrink-0 text-foreground/50" aria-hidden="true" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search transitions"
            aria-label="Search transitions"
            className="h-full w-full bg-transparent text-[15px] outline-none placeholder:text-foreground/40"
          />
        </label>
        <div ref={tabs} role="tablist" aria-label="Engine" className="relative flex rounded-[12px] border border-border bg-background p-1">
          <span
            aria-hidden="true"
            className="install-marker pointer-events-none absolute top-1 h-9 rounded-[8px] bg-foreground/[0.08]"
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
              className="install-tab relative z-10 flex h-9 flex-1 items-center justify-center gap-1.5 rounded-[8px] px-3 text-sm text-foreground/60 aria-selected:text-foreground"
            >
              {k.label}
              <span className="text-xs tabular-nums text-foreground/40">{count(k.id)}</span>
            </button>
          ))}
        </div>
      </div>

      {list.length ? (
        <div className="mx-auto mt-12 grid w-full max-w-[82rem] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((t) => (
            <Card key={t.slug} slug={t.slug} />
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
    </>
  )
}
