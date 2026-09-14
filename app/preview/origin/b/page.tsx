import Link from 'next/link'
import { Nav } from '../nav'

const work = [
  { name: 'Meridian', year: '2026', bg: '#d9552b', fg: '#fff4ec' },
  { name: 'Slowfield', year: '2025', bg: '#2f5d50', fg: '#e9f2ee' },
  { name: 'Aster', year: '2025', bg: '#e4dccb', fg: '#1c1b1a' },
  { name: 'Pallas', year: '2024', bg: '#3a3835', fg: '#f4f1ea' },
]

/** The studio's work page, dark. The same nav inverted, a light pill home, and tiles in their own colours. */
export default function Work() {
  return (
    <main
      className="flex h-dvh flex-col overflow-hidden px-8 py-6 md:px-12"
      style={{ background: '#1c1b1a', color: '#f4f1ea' }}
    >
      <Nav tone="dark" href="/preview/origin" />

      <section className="flex flex-1 flex-col justify-center gap-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-4">
            <span className="font-mono text-xs uppercase tracking-[0.2em]" style={{ color: '#a89685' }}>
              Selected work
            </span>
            <h1 className="text-5xl font-medium leading-[1.02] tracking-tight md:text-6xl">
              Four projects, each with an entrance.
            </h1>
          </div>
          <Link
            href="/preview/origin"
            className="rounded-full px-6 py-3 text-sm font-medium"
            style={{ background: '#f4f1ea', color: '#1c1b1a' }}
          >
            Back home
          </Link>
        </div>

        <div className="grid gap-3 md:grid-cols-4">
          {work.map((w) => (
            <Link
              key={w.name}
              href="/preview/origin"
              className="flex aspect-[4/3] flex-col justify-between rounded-2xl p-5"
              style={{ background: w.bg, color: w.fg }}
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] opacity-80">{w.year}</span>
              <span className="text-xl font-medium tracking-tight">{w.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <footer className="flex items-center justify-between font-mono text-[11px]" style={{ color: '#a89685' }}>
        <span>page two</span>
        <span>and back, from whichever you choose →</span>
      </footer>
    </main>
  )
}
