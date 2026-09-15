'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { CopyMenu } from '@/components/site/copy-menu'
import { transitions } from '@/lib/transitions'

/**
 * Six transitions, sized by what each needs to read: wide for the ones that
 * move sideways, tall for the ones that run top to bottom. Four columns, one
 * on a phone. Each tile is the real preview in a frame, playing on its own,
 * mounted only while the tile is near the viewport.
 */
const tiles: { slug: string; span: string }[] = [
  { slug: 'tear', span: 'md:col-span-2 md:row-span-2' },
  { slug: 'spaces', span: 'md:col-span-2' },
  { slug: 'zipper', span: 'md:row-span-2' },
  { slug: 'slate', span: '' },
  { slug: 'concertina', span: 'md:col-span-2' },
  { slug: 'crayon', span: '' },
]

function Tile({ slug, span }: { slug: string; span: string }) {
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
    <div ref={ref} data-tile className={`tile relative overflow-hidden rounded-[14px] border border-border bg-card ${span}`}>
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
    <div className="mx-auto grid w-full max-w-6xl auto-rows-[240px] grid-cols-1 gap-3 md:auto-rows-[220px] md:grid-cols-4">
      {tiles.map((x) => (
        <Tile key={x.slug} {...x} />
      ))}
    </div>
  )
}
