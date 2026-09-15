'use client'

import { Menu, Search as SearchIcon, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { IconButton } from '@/components/site/icon-button'
import { NavLink } from '@/components/site/nav-link'
import { Search } from '@/components/site/search'
import { ThemeToggle } from '@/components/site/theme-toggle'
import { REPO, formatStars } from '@/lib/github-stars'

const links = [
  { href: '/transitions', label: 'Transitions' },
  { href: '/docs', label: 'Docs' },
]

/** The GitHub mark. Lucide dropped its brand icons, so it lives here. */
function GitHubMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  )
}

/** A quiet count badge; the same inner grey as the search control. */
function Stars({ n }: { n: number | null }) {
  if (n === null) return null
  return <span className="rounded-[6px] bg-foreground/[0.1] px-1.5 py-0.5 text-xs tabular-nums text-foreground/70">{formatStars(n)}</span>
}

/**
 * The floating bar. One rounded box: a 40px row of controls, and below it a
 * panel that rolls out on phones when the menu opens. The box grows from its
 * bottom edge because the panel is a grid row going from 0fr to 1fr.
 * Radii are concentric: 14 outside, 6px padding, 8 on the controls.
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

  const control = 'nav-control flex h-10 items-center rounded-[8px] px-2.5 text-sm text-foreground/80'
  const filled = 'bg-foreground/[0.08]'

  return (
    <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <nav
        aria-label="Site"
        className="w-full max-w-[40rem] rounded-[14px] border border-border bg-background/70 p-1.5 backdrop-blur-xl"
      >
        <div className="flex items-center gap-1">
          <Link href="/" className={`${control} font-heading text-lg text-foreground`}>
            curtain
          </Link>
          <div className="ml-2 hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <NavLink key={l.href} href={l.href} className={`${control} aria-[current=page]:text-foreground`}>
                {l.label}
              </NavLink>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-1">
            <IconButton label="Search" className={filled} onClick={() => setSearching(true)}>
              <SearchIcon />
            </IconButton>
            <a href={`https://github.com/${REPO}`} className={`${control} ${filled} hidden gap-2 md:flex`}>
              <GitHubMark className="size-4" />
              GitHub
              <Stars n={stars} />
            </a>
            <ThemeToggle className={filled} />
            <IconButton label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="nav-rollout" className={`${filled} md:hidden`} onClick={() => setOpen((o) => !o)}>
              <Menu className={`icon-swap ${open ? 'icon-swap-out' : ''}`} />
              <X className={`icon-swap ${open ? '' : 'icon-swap-out'}`} />
            </IconButton>
          </div>
        </div>

        <div id="nav-rollout" className={`nav-rollout md:hidden ${open ? 'nav-rollout-open' : ''}`} inert={!open}>
          <div className="overflow-hidden">
            <div className="mt-1.5 flex flex-col gap-1 border-t border-border pt-1.5">
              {links.map((l) => (
                <NavLink key={l.href} href={l.href} className={`${control} h-11 text-base aria-[current=page]:text-foreground`}>
                  {l.label}
                </NavLink>
              ))}
              <a href={`https://github.com/${REPO}`} className={`${control} h-11 gap-2 text-base`}>
                <GitHubMark className="size-4" />
                GitHub
                <Stars n={stars} />
              </a>
            </div>
          </div>
        </div>
      </nav>
      <Search open={searching} onOpenChange={setSearching} />
    </header>
  )
}
