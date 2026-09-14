import Link from 'next/link'

/**
 * Several links with different surfaces, so the colour bridge has something
 * to prove: a dark button on a light page, a coloured card, a bare text link.
 */
export default function A() {
  return (
    <main
      className="flex h-dvh flex-col justify-between overflow-hidden p-10"
      style={{ background: '#f4f1ea', color: '#1c1b1a' }}
    >
      <span className="font-mono text-xs uppercase tracking-[0.2em]" style={{ color: '#8a7f6a' }}>
        page one
      </span>

      <div className="flex max-w-xl flex-col gap-8">
        <p className="text-2xl font-medium leading-snug tracking-tight">
          The next page opens out of whatever you click. Each of these opens in its own colour.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/preview/origin/b"
            className="rounded-full px-6 py-3 text-sm font-medium"
            style={{ background: '#1c1b1a', color: '#f4f1ea' }}
          >
            Open the dark page
          </Link>
          <Link
            href="/preview/origin/b"
            className="rounded-xl px-6 py-3 text-sm font-medium"
            style={{ background: '#d9552b', color: '#fff4ec' }}
          >
            Or from orange
          </Link>
          <Link href="/preview/origin/b" className="text-sm underline underline-offset-4">
            or a plain text link
          </Link>
        </div>
        <Link
          href="/preview/origin/b"
          className="block max-w-xs rounded-2xl p-6"
          style={{ background: '#e4dccb' }}
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: '#8a7f6a' }}>
            a card
          </span>
          <span className="mt-2 block text-base leading-snug">
            Cards open from their whole surface, in the card&rsquo;s colour.
          </span>
        </Link>
      </div>

      <span className="font-mono text-[11px]" style={{ color: '#8a7f6a' }}>
        click a link →
      </span>
    </main>
  )
}
