'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { CopyMenu } from '@/components/site/copy-menu'
import { transitions } from '@/lib/transitions'

/**
 * Six transitions as cards, three across with the middle column wider for the
 * two that move sideways (spaces, concertina): a bordered card with the preview
 * inset in its own rounded window, the name and a copy control under it.
 * The preview is the real thing in a frame at 1:1, loaded once when first near and paused off screen.
 * Not scaled: a scaled frame puts whole-pixel edges on half pixels, and
 * concertina's window shows hairlines again.
 */
const slugs = ['tear', 'spaces', 'zipper', 'slate', 'concertina', 'crayon']

function Card({ slug }: { slug: string }) {
  const t = transitions.find((x) => x.slug === slug)!
  const ref = useRef<HTMLDivElement>(null)
  const frame = useRef<HTMLIFrameElement>(null)
  const [mounted, setMounted] = useState(false)
  const visible = useRef(false)

  // Loaded the first time the card comes near, then kept: unmounting it on the way
  // out made every return reload the preview. Off screen it is paused instead, by a
  // flag on the frame's own document that the auto-advance reads.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        visible.current = e.isIntersecting
        if (e.isIntersecting) setMounted(true)
        frame.current?.contentDocument?.documentElement.toggleAttribute('data-paused', !e.isIntersecting)
      },
      { rootMargin: '15% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} data-tile className="card rounded-[20px] border border-border bg-card p-2.5">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[12px] border border-border bg-background lg:aspect-auto lg:h-[280px]">
        <Link href={`/transitions/${slug}`} aria-label={`Open ${t.name}`} className="absolute inset-0 z-10 rounded-[12px]" />
        {mounted && (
          <iframe
            ref={frame}
            onLoad={() => frame.current?.contentDocument?.documentElement.toggleAttribute('data-paused', !visible.current)}
            src={`/preview/${slug}?loop`}
            title={`${t.name} preview`}
            tabIndex={-1}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 size-full bg-background"
          />
        )}
      </div>
      <div className="flex items-center justify-between gap-2 pt-2.5 pb-0.5 pl-1.5">
        <Link href={`/transitions/${slug}`} className="nav-item rounded-[6px] text-[15px] text-foreground">
          {t.name}
        </Link>
        <CopyMenu slug={slug} />
      </div>
    </div>
  )
}

export function Bento() {
  return (
    <div data-tiles className="mx-auto grid w-full max-w-[82rem] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1.2fr_1fr]">
      {slugs.map((slug) => (
        <Card key={slug} slug={slug} />
      ))}
    </div>
  )
}

const count = transitions.filter((t) => t.ready).length
const words = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve']

/** Under the grid: the way to the rest of them. */
export function AllTransitions() {
  return (
    <div className="mt-12 flex justify-center">
      <Link href="/transitions" className="see-all group flex h-11 items-center gap-2 rounded-[10px] border border-border bg-foreground/[0.06] pr-3 pl-4 text-[15px] text-foreground">
        See all {words[count] ?? count} transitions
        <ArrowRight className="see-all-arrow size-4 text-foreground/70" aria-hidden="true" />
      </Link>
    </div>
  )
}
