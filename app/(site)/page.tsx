import Image from 'next/image'
import { HeroField } from '@/components/site/hero-field'
import { InstallCommand } from '@/components/site/install-command'
import { Bento } from '@/components/site/bento'
import { HomeScroll } from '@/components/site/home-scroll'

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
    <main className="relative w-full bg-background">
      <section data-hero className="relative min-h-dvh w-full overflow-hidden pb-[180px]">
        {/* The fade sits on a wrapper that never moves: on the field itself, parallax slides the faded edge out of the clip. */}
        <div className="field-fade pointer-events-none absolute inset-0">
          <div data-field className="absolute inset-0 will-change-transform">
            <HeroField />
          </div>
        </div>
        <div data-hero-copy className="relative z-10 flex flex-col items-center px-6 pt-[20dvh] text-center sm:px-8 sm:pt-[21dvh]">
        <h1 className="hero-rise max-w-[14ch] text-[clamp(2.375rem,1.2rem+5.5vw,5.75rem)] leading-[1.02] tracking-[-0.02em] text-foreground">
          Page transitions worth watching
          <Image
            src="/hero-tv.webp"
            alt=""
            width={1074}
            height={1153}
            priority
            className="ml-[0.18em] inline-block h-[0.92em] w-auto -translate-y-[0.02em] align-middle"
          />
        </h1>
        <p className="hero-rise mt-5 max-w-[34ch] [animation-delay:90ms] text-[clamp(1rem,0.9rem+0.45vw,1.25rem)] leading-normal tracking-tight text-foreground/80 sm:mt-6">
          Made for the{' '}
          <span className="whitespace-nowrap">
            <Image
              src="/icons8-next.js-48.png"
              alt=""
              width={52}
              height={52}
              className="mr-[0.3em] inline-block size-[1.55em] -translate-y-[0.08em] align-middle"
            />
            Next.js App Router.
          </span>{' '}
          Drop one in and your links do the rest.
        </p>
        <InstallCommand className="hero-rise mt-10 [animation-delay:180ms] sm:mt-12" />
        <p className="hero-rise mt-4 text-sm text-foreground/60 [animation-delay:260ms]">Copy, paste, curtain up.</p>
        </div>
      </section>

      {/* The grid starts before the hero ends, so its first row peeks above the fold; the field fades out under its top. */}
      <section data-grid className="relative z-10 -mt-[140px] px-4 pb-24 sm:px-6">
        <Bento />
      </section>
      <HomeScroll />
    </main>
  )
}
