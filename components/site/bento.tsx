'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { CopyMenu } from '@/components/site/copy-menu'
import { transitions } from '@/lib/transitions'

/**
 * Six transitions as cards, three across with the middle column wider for the
 * two that move sideways (spaces, concertina): a bordered card with the preview
 * inset in its own rounded window, the name and a copy control under it.
 * The preview is the real thing in a frame, rendered at twice the window and
 * scaled down so its type reads at thumbnail size, mounted only while near.
 */
const slugs = ['tear', 'spaces', 'zipper', 'slate', 'concertina', 'crayon']

function Card({ slug }: { slug: string }) {
  const t = transitions.find((x) => x.slug === slug)!
  const ref = useRef<HTMLDivElement>(null)
  const [near, setNear] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: '15% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} data-tile className="card rounded-[20px] border border-border bg-card p-2.5">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[12px] border border-border bg-background lg:aspect-auto lg:h-[264px]">
        {near && (
          <iframe
            src={`/preview/${slug}?loop`}
            title={`${t.name} preview`}
            tabIndex={-1}
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 h-[200%] w-[200%] origin-top-left scale-50 bg-background"
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
    <div data-tiles className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1.3fr_1fr]">
      {slugs.map((slug) => (
        <Card key={slug} slug={slug} />
      ))}
    </div>
  )
}
