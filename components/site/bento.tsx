'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { CopyMenu } from '@/components/site/copy-menu'
import { transitions } from '@/lib/transitions'

/**
 * Six transitions in two equal columns, one on a phone. Each tile is the real
 * preview in a frame, playing on its own, mounted only while the tile is near
 * the viewport. The field shows through the gaps: no sheet behind the grid.
 */
const tiles = ['tear', 'spaces', 'zipper', 'slate', 'concertina', 'crayon']

function Tile({ slug }: { slug: string }) {
  const t = transitions.find((x) => x.slug === slug)!
  const ref = useRef<HTMLDivElement>(null)
  const [near, setNear] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: '10% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} data-tile className="tile relative overflow-hidden rounded-[14px] border border-border bg-card">
      {near && (
        <iframe
          src={`/preview/${slug}?loop`}
          title={`${t.name} preview`}
          tabIndex={-1}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 size-full bg-background"
        />
      )}
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 p-2">
        <Link href={`/transitions/${slug}`} className="nav-control flex h-10 items-center rounded-[8px] border border-border bg-background/85 px-3 text-sm text-foreground backdrop-blur-md">
          {t.name}
        </Link>
        <CopyMenu slug={slug} className="rounded-[8px] border border-border bg-background/85 backdrop-blur-md" />
      </div>
    </div>
  )
}

export function Bento() {
  return (
    <div data-tiles className="mx-auto grid w-full max-w-6xl auto-rows-[260px] grid-cols-1 gap-4 md:auto-rows-[400px] md:grid-cols-2">
      {tiles.map((slug) => (
        <Tile key={slug} slug={slug} />
      ))}
    </div>
  )
}
