import Link from 'next/link'
import { Mono, Rule } from './catalogue'
import { CodeBlock } from './code-block'

/**
 * The catalogue cover. A ruled masthead of facts, the claim set large, and the
 * one command that installs any of it.
 */
export function Hero({
  count,
  zeroDep,
}: {
  count: number
  zeroDep: number
}) {
  return (
    <section>
      <Rule />
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 py-2 text-muted-foreground">
        <Mono>curtain</Mono>
        <Mono>page transitions</Mono>
        <Mono>next.js app router</Mono>
        <Mono>shadcn registry</Mono>
        <Mono>MIT</Mono>
      </div>
      <Rule />

      <h1 className="mt-14 max-w-3xl text-5xl font-medium leading-[1.02] tracking-tight sm:text-7xl">
        Page transitions with a hand in them.
      </h1>

      <p className="mt-7 max-w-xl text-lg leading-snug text-muted-foreground">
        Not fades. A clapperboard that claps, a strip of slats that folds, a zip that closes, a
        sheet of paper torn in two. {count} of them, {zeroDep} with no dependencies at all. Install
        one with the shadcn CLI and wrap your layout.
      </p>

      <div className="mt-9 max-w-xl">
        <CodeBlock code="npx shadcn@latest add https://curtain.dev/r/zipper.json" />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-6">
        <Link
          href="/transitions"
          className="bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-85"
        >
          Browse the catalogue
        </Link>
        <Link href="/docs" className="text-sm underline underline-offset-4 hover:opacity-70">
          Getting started
        </Link>
      </div>
    </section>
  )
}
