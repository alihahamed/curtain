import { HeroField } from '@/components/site/hero-field'

/**
 * The home page is the hero and nothing else: a WebGL field filling the whole
 * viewport with one headline over it. The canvas sizes itself to its box, caps
 * its own pixel count, and pauses when hidden, so it costs the same on a phone
 * as on a desktop.
 *
 * The copy sits centred and a little above the middle: the top padding is a
 * share of the viewport height, so the headline lands in the same place on a
 * phone held upright and on a wide monitor.
 */
export default function Home() {
  return (
    <main className="relative h-dvh w-full overflow-hidden bg-background">
      <HeroField />
      <section className="relative z-10 flex h-full flex-col items-center px-6 pt-[26dvh] text-center sm:px-8 sm:pt-[28dvh]">
        <h1 className="max-w-[14ch] text-[clamp(2.375rem,1.2rem+5.5vw,5.75rem)] leading-[1.02] tracking-[-0.02em] text-foreground">
          Page transitions worth watching
        </h1>
        <p className="mt-5 max-w-[34ch] text-[clamp(1rem,0.9rem+0.45vw,1.25rem)] leading-normal tracking-tight text-foreground/80 sm:mt-6">
          Made for the Next.js App Router. Drop one in and your links do the rest.
        </p>
      </section>
    </main>
  )
}
