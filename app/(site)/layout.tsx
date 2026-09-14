import Link from 'next/link'
import { NavLink } from '@/components/site/nav-link'
import { transitions } from '@/lib/transitions'

const shipped = transitions.filter((t) => t.ready).length

export default function SiteLayout({ children }: LayoutProps<'/'>) {
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-rule bg-background/80 backdrop-blur-xl">
        <nav className="mx-auto flex h-14 w-full max-w-6xl items-center gap-6 px-6 text-sm">
          <Link href="/" className="font-medium tracking-tight">
            curtain
            <span className="ml-1 font-mono text-[11px] text-muted-foreground">.dev</span>
          </Link>
          <div className="ml-auto flex items-center gap-6 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            <NavLink href="/transitions">catalogue</NavLink>
            <NavLink href="/docs">docs</NavLink>
            <a
              href="https://github.com/alihahamed/curtain"
              className="transition-colors hover:text-foreground"
            >
              github
            </a>
          </div>
        </nav>
      </header>

      {children}

      <footer className="mt-auto border-t border-rule px-6 py-6">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          <span>curtain · one line in your layout · MIT</span>
          <span>
            {shipped} transitions ·{' '}
            <a href="/r/registry.json" className="transition-colors hover:text-foreground">
              registry.json
            </a>
          </span>
        </div>
      </footer>
    </>
  )
}
