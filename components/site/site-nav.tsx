'use client'

import { Menu, Search as SearchIcon, Star, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { IconButton } from '@/components/site/icon-button'
import { NavLink } from '@/components/site/nav-link'
import { Search, SearchHint } from '@/components/site/search'
import { ThemeToggle } from '@/components/site/theme-toggle'
import { REPO, formatStars } from '@/lib/github-stars'

const links = [
  { href: '/transitions', label: 'Transitions' },
  { href: '/docs', label: 'Docs' },
]

/**
 * The floating bar. One rounded box: a 40px row of controls, and below it a
 * panel that rolls out on phones when the menu opens. The box grows from its
 * bottom edge because the panel is a grid row going from 0fr to 1fr.
 * Radii are concentric: 16 outside, 8px padding, 8 on the controls.
 */
export function SiteNav({ stars }: { stars: number | null }) {
  const [open, setOpen] = useState(false)
  const [searching, setSearching] = useState(false)
  const pathname = usePathname()

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const github = (
    <a href={`https://github.com/${REPO}`} className="nav-control flex h-10 items-center gap-1.5 rounded-lg px-2.5 text-foreground/80" aria-label="Star curtain on GitHub">
      <Star className="size-4" aria-hidden="true" />
      {stars !== null && <span className="text-sm tabular-nums">{formatStars(stars)}</span>}
    </a>
  )

  return (
    <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <nav
        aria-label="Site"
        className="w-full max-w-[40rem] rounded-2xl border border-border bg-background/70 p-2 backdrop-blur-xl"
      >
        <div className="flex items-center gap-1">
          <Link href="/" className="nav-control flex h-10 items-center rounded-lg px-2.5 font-heading text-lg">
            curtain
          </Link>
          <div className="ml-2 hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <NavLink key={l.href} href={l.href} className="nav-control flex h-10 items-center rounded-lg px-2.5 text-sm text-foreground/80 aria-[current=page]:text-foreground">
                {l.label}
              </NavLink>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSearching(true)}
              aria-label="Search"
              className="nav-control flex h-10 items-center gap-2 rounded-lg px-2.5 text-foreground/80"
            >
              <SearchIcon className="size-[18px]" aria-hidden="true" />
              <span className="hidden text-sm sm:inline">Search</span>
              <span className="hidden sm:inline">
                <SearchHint />
              </span>
            </button>
            <div className="hidden md:block">{github}</div>
            <ThemeToggle />
            <IconButton label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="nav-rollout" className="md:hidden" onClick={() => setOpen((o) => !o)}>
              <Menu className={`icon-swap ${open ? 'icon-swap-out' : ''}`} />
              <X className={`icon-swap ${open ? '' : 'icon-swap-out'}`} />
            </IconButton>
          </div>
        </div>

        <div id="nav-rollout" className={`nav-rollout md:hidden ${open ? 'nav-rollout-open' : ''}`} inert={!open}>
          <div className="overflow-hidden">
            <div className="mt-2 flex flex-col gap-1 border-t border-border pt-2">
              {links.map((l) => (
                <NavLink key={l.href} href={l.href} className="nav-control flex h-11 items-center rounded-lg px-2.5 text-foreground/80 aria-[current=page]:text-foreground">
                  {l.label}
                </NavLink>
              ))}
              <a href={`https://github.com/${REPO}`} className="nav-control flex h-11 items-center justify-between rounded-lg px-2.5 text-foreground/80">
                GitHub
                {stars !== null && (
                  <span className="flex items-center gap-1.5 text-sm tabular-nums">
                    <Star className="size-4" aria-hidden="true" />
                    {formatStars(stars)}
                  </span>
                )}
              </a>
            </div>
          </div>
        </div>
      </nav>
      <Search open={searching} onOpenChange={setSearching} />
    </header>
  )
}
