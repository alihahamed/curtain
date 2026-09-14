import Link from 'next/link'

/**
 * The demo site's navbar. Text links open in the page's colour, the pill in
 * its own — the two kinds of origin the transition reads, side by side.
 */
export function Nav({ tone, href }: { tone: 'light' | 'dark'; href: string }) {
  const light = tone === 'light'
  const fg = light ? '#1c1b1a' : '#f4f1ea'
  const muted = light ? '#6f675a' : '#a89685'
  return (
    <nav className="flex items-center justify-between">
      <Link href={href} className="text-base font-semibold tracking-tight" style={{ color: fg }}>
        Halden
      </Link>
      <div className="hidden items-center gap-8 text-sm md:flex" style={{ color: muted }}>
        <Link href={href} className="transition-colors hover:opacity-70">
          Work
        </Link>
        <Link href={href} className="transition-colors hover:opacity-70">
          Studio
        </Link>
        <Link href={href} className="transition-colors hover:opacity-70">
          Journal
        </Link>
      </div>
      <Link
        href={href}
        className="rounded-full px-4 py-2 text-sm font-medium"
        style={{ background: fg, color: light ? '#f4f1ea' : '#1c1b1a' }}
      >
        Start a project
      </Link>
    </nav>
  )
}
