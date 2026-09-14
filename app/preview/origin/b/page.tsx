import Link from 'next/link'

export default function B() {
  return (
    <main
      className="flex h-dvh flex-col justify-between overflow-hidden p-10"
      style={{ background: '#1c1b1a', color: '#f4f1ea' }}
    >
      <span className="font-mono text-xs uppercase tracking-[0.2em]" style={{ color: '#a89685' }}>
        page two
      </span>

      <div className="flex max-w-xl flex-col gap-8">
        <p className="text-2xl font-medium leading-snug tracking-tight">
          And back. The window keeps the link&rsquo;s corners and colour until the page has filled it.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/preview/origin"
            className="rounded-full px-6 py-3 text-sm font-medium"
            style={{ background: '#f4f1ea', color: '#1c1b1a' }}
          >
            Back to the light page
          </Link>
          <Link href="/preview/origin" className="text-sm underline underline-offset-4">
            or from the text
          </Link>
        </div>
      </div>

      <span className="font-mono text-[11px]" style={{ color: '#a89685' }}>
        click a link →
      </span>
    </main>
  )
}
