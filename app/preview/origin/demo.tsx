import Link from 'next/link'

type Tone = {
  bg: string
  fg: string
  muted: string
  /** The two solid buttons: primary is the page's ink, second a colour of its own. */
  primary: string
  primaryFg: string
  accent: string
  accentFg: string
}

export const light: Tone = {
  bg: '#f4f1ea',
  fg: '#1c1b1a',
  muted: '#6f675a',
  primary: '#1c1b1a',
  primaryFg: '#f4f1ea',
  accent: '#d9552b',
  accentFg: '#fff4ec',
}

export const dark: Tone = {
  bg: '#1c1b1a',
  fg: '#f4f1ea',
  muted: '#a89685',
  primary: '#f4f1ea',
  primaryFg: '#1c1b1a',
  accent: '#2f5d50',
  accentFg: '#e9f2ee',
}

/**
 * One layout for both preview pages: what origin does, up top; the demo
 * along the bottom — four links of different shapes and colours, each of
 * which opens the other page from itself.
 */
export function Demo({
  tone,
  step,
  href,
  title,
  children,
}: {
  tone: Tone
  step: string
  href: string
  title: string
  children: React.ReactNode
}) {
  return (
    <main
      className="flex h-dvh flex-col justify-between overflow-hidden px-8 pt-8 pb-14 md:px-12"
      style={{ background: tone.bg, color: tone.fg }}
    >
      <header className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em]" style={{ color: tone.muted }}>
        <span>origin</span>
        <span>page {step}</span>
      </header>

      <section className="flex max-w-2xl flex-col gap-6">
        <h1 className="text-5xl font-medium leading-[1.02] tracking-tight md:text-6xl">{title}</h1>
        <p className="max-w-lg text-lg leading-snug" style={{ color: tone.muted }}>
          {children}
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: tone.muted }}>
          click any of these — each opens from itself, in its own colour
        </span>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={href}
            className="rounded-full px-6 py-3 text-sm font-medium"
            style={{ background: tone.primary, color: tone.primaryFg }}
          >
            A pill button
          </Link>
          <Link
            href={href}
            className="rounded-xl px-6 py-3 text-sm font-medium"
            style={{ background: tone.accent, color: tone.accentFg }}
          >
            A coloured button
          </Link>
          <Link
            href={href}
            className="rounded-full border px-6 py-3 text-sm font-medium"
            style={{ borderColor: tone.fg }}
          >
            An outlined button
          </Link>
          <Link href={href} className="px-2 text-sm underline underline-offset-4">
            a plain text link
          </Link>
        </div>
      </section>
    </main>
  )
}
