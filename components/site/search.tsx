'use client'

import { Search as SearchIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { transitions } from '@/lib/transitions'

type Entry = { href: string; title: string; hint: string }

const pages: Entry[] = [
  { href: '/transitions', title: 'Catalogue', hint: 'Every shipped transition' },
  { href: '/docs', title: 'Getting started', hint: 'Install, wrap your layout, the two engines' },
  { href: 'https://github.com/alihahamed/curtain', title: 'GitHub', hint: 'Source and issues' },
]

const entries: Entry[] = [
  ...transitions.filter((t) => t.ready).map((t) => ({ href: `/transitions/${t.slug}`, title: t.name, hint: t.tagline })),
  ...pages,
]

/**
 * A native dialog over a filtered list: no palette library. Opens on ⌘K (Ctrl+K
 * elsewhere), on / when not typing, and from the button in the bar.
 */
export function Search({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const router = useRouter()
  const dialog = useRef<HTMLDialogElement>(null)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return entries
    return entries.filter((e) => (e.title + ' ' + e.hint).toLowerCase().includes(q))
  }, [query])

  useEffect(() => {
    const el = dialog.current
    if (!el) return
    if (open && !el.open) {
      setQuery('')
      setActive(0)
      el.showModal()
    } else if (!open && el.open) el.close()
  }, [open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement | null)?.closest('input, textarea, [contenteditable]')
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        onOpenChange(!open)
      } else if (e.key === '/' && !typing && !open) {
        e.preventDefault()
        onOpenChange(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onOpenChange])

  const go = (entry: Entry) => {
    onOpenChange(false)
    if (entry.href.startsWith('http')) window.open(entry.href, '_blank', 'noopener')
    else router.push(entry.href)
  }

  return (
    <dialog
      ref={dialog}
      onClose={() => onOpenChange(false)}
      onClick={(e) => e.target === dialog.current && onOpenChange(false)}
      className="search m-0 mx-auto mt-[12dvh] w-[min(100vw-2rem,36rem)] rounded-[14px] border border-border bg-popover p-1.5 text-popover-foreground backdrop:bg-black/40"
    >
      <div className="flex h-11 items-center gap-2 px-2">
        <SearchIcon className="size-[18px] shrink-0 text-muted-foreground" aria-hidden="true" />
        <input
          autoFocus
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setActive(0)
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault()
              setActive((i) => Math.min(i + 1, results.length - 1))
            } else if (e.key === 'ArrowUp') {
              e.preventDefault()
              setActive((i) => Math.max(i - 1, 0))
            } else if (e.key === 'Enter' && results[active]) go(results[active])
          }}
          placeholder="Search transitions and docs"
          aria-label="Search"
          className="h-full w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
        />
        <kbd className="hidden rounded-md border border-border px-1.5 py-0.5 text-xs text-muted-foreground sm:block">esc</kbd>
      </div>
      <div className="mt-2 max-h-[50dvh] overflow-y-auto border-t border-border pt-2" role="listbox">
        {results.length === 0 && <p className="px-3 py-6 text-center text-muted-foreground">Nothing for “{query}”.</p>}
        {results.map((entry, i) => (
          <button
            key={entry.href}
            type="button"
            role="option"
            aria-selected={i === active}
            onMouseEnter={() => setActive(i)}
            onClick={() => go(entry)}
            className={`flex min-h-11 w-full items-baseline justify-between gap-4 rounded-[8px] px-3 py-2 text-left ${i === active ? 'bg-accent text-accent-foreground' : ''}`}
          >
            <span>{entry.title}</span>
            <span className="truncate text-sm text-muted-foreground">{entry.hint}</span>
          </button>
        ))}
      </div>
    </dialog>
  )
}

