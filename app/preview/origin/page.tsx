import Link from 'next/link'
import { Nav } from './nav'

const projects = [
  { name: 'Meridian', kind: 'Brand & site', bg: '#d9552b', fg: '#fff4ec' },
  { name: 'Slowfield', kind: 'Product', bg: '#2f5d50', fg: '#e9f2ee' },
  { name: 'Aster', kind: 'Editorial', bg: '#e4dccb', fg: '#1c1b1a' },
]

/**
 * A studio's home page. Every link opens page two, each from its own
 * rectangle and in its own colour: nav text, a dark pill, an outlined
 * button, three project cards.
 */
export default function Home() {
  return (
    <main
      className="flex h-dvh flex-col overflow-hidden px-8 py-6 md:px-12"
      style={{ background: '#f4f1ea', color: '#1c1b1a' }}
    >
      <Nav tone="light" href="/preview/origin/b" />

      <section className="grid flex-1 items-center gap-12 md:grid-cols-[1.2fr_1fr]">
        <div className="flex flex-col gap-8">
          <span className="font-mono text-xs uppercase tracking-[0.2em]" style={{ color: '#8a7f6a' }}>
            Design studio — Oslo
          </span>
          <h1 className="max-w-xl text-5xl font-medium leading-[1.02] tracking-tight md:text-6xl">
            Interfaces with a sense of occasion.
          </h1>
          <p className="max-w-md text-lg leading-snug" style={{ color: '#6f675a' }}>
            We design products that open, unfold and arrive, rather than simply appear. Click anything
            on this page and watch where the next one comes from.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/preview/origin/b"
              className="rounded-full px-6 py-3 text-sm font-medium"
              style={{ background: '#1c1b1a', color: '#f4f1ea' }}
            >
              See the work
            </Link>
            <Link
              href="/preview/origin/b"
              className="rounded-full border px-6 py-3 text-sm font-medium"
              style={{ borderColor: '#1c1b1a' }}
            >
              Our process
            </Link>
          </div>
        </div>

        <div className="hidden w-full max-w-md flex-col gap-3 justify-self-end md:flex">
          {projects.map((p) => (
            <Link
              key={p.name}
              href="/preview/origin/b"
              className="flex items-end justify-between rounded-2xl p-5"
              style={{ background: p.bg, color: p.fg, minHeight: 112 }}
            >
              <span className="text-xl font-medium tracking-tight">{p.name}</span>
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] opacity-80">{p.kind}</span>
            </Link>
          ))}
        </div>
      </section>

      <footer className="flex items-center justify-between font-mono text-[11px]" style={{ color: '#8a7f6a' }}>
        <span>page one</span>
        <span>every link opens from itself →</span>
      </footer>
    </main>
  )
}
