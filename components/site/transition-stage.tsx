'use client'

import { ChevronLeft, ChevronRight, PanelLeftOpen, Play, Settings2, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Customize, useCustomize } from '@/components/site/customize'
import { CopyMenu } from '@/components/site/copy-menu'
import { IconButton } from '@/components/site/icon-button'
import { Tip } from '@/components/site/tip'
import type { Control } from '@/lib/transitions'

type Neighbour = { slug: string; name: string }

/**
 * One transition, playing across the whole screen, with its controls in an
 * island at the bottom: replay, the props panel, the install command, the two
 * neighbours and the docs. Opening the docs splits the screen and the
 * transition keeps playing beside them. Arrow keys move between transitions,
 * R replays, D opens the docs.
 */
export function TransitionStage({
  slug,
  name,
  tagline,
  controls,
  prev,
  next,
  docs,
}: {
  slug: string
  name: string
  tagline: string
  controls: Control[]
  prev: Neighbour
  next: Neighbour
  docs: ReactNode
}) {
  const frame = useRef<HTMLIFrameElement>(null)
  const { values, setValues, reset, query } = useCustomize(controls)
  const [showDocs, setShowDocs] = useState(false)
  const [showProps, setShowProps] = useState(false)
  const [reloads, setReloads] = useState(0)
  const src = query ? `/preview/${slug}?${query}` : `/preview/${slug}`

  /** Click the shell's own link, the only honest way to start a real navigation. */
  const replay = () => {
    const doc = frame.current?.contentDocument
    const link = doc?.querySelector<HTMLAnchorElement>('a[href^="/preview/"]')
    if (link) link.click()
    else setReloads((n) => n + 1)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if ((e.target as HTMLElement | null)?.closest('input, textarea, [contenteditable]')) return
      if (e.key === 'r') replay()
      if (e.key === 'd') setShowDocs((v) => !v)
      if (e.key === 'ArrowLeft') location.assign(`/transitions/${prev.slug}`)
      if (e.key === 'ArrowRight') location.assign(`/transitions/${next.slug}`)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [prev.slug, next.slug])

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-background">
      <aside
        data-lenis-prevent
        inert={!showDocs}
        className={`stage-docs overflow-y-auto border-border bg-background ${showDocs ? 'stage-docs-open' : ''}`}
      >
        <div className="w-full overflow-x-hidden px-6 pt-24 pb-28 sm:px-8">
          <Link href="/transitions" className="footer-link text-sm text-foreground/60">
            All transitions
          </Link>
          <h1 className="mt-4 font-heading text-[clamp(2rem,1.6rem+1.4vw,2.75rem)] leading-[1.05] tracking-[-0.015em]">{name}</h1>
          <p className="mt-3 text-foreground/65 text-pretty">{tagline}</p>
          {docs}
        </div>
      </aside>

      <div className="relative min-w-0 flex-1">
        <iframe
          key={`${src}#${reloads}`}
          ref={frame}
          src={src}
          title={`${name} playing`}
          className="absolute inset-0 size-full border-0 bg-background"
        />

        {/* The name sits over the stage until the docs take it. On its own panel, because
            the demo page behind it brings its own colours. */}
        <div className={`absolute top-6 left-6 transition-opacity duration-300 sm:top-8 sm:left-8 ${showDocs ? 'pointer-events-none opacity-0' : 'opacity-100'}`}>
          <div className="rounded-[14px] border border-border bg-background/85 px-4 py-3 backdrop-blur-xl">
            <Link href="/transitions" className="footer-link text-sm text-foreground/60">
              All transitions
            </Link>
            <h1 className="mt-1 font-heading text-[clamp(1.5rem,1.2rem+1.2vw,2rem)] leading-none tracking-[-0.015em]">{name}</h1>
          </div>
        </div>
      </div>

      {/* Controls, in an island over the stage. */}
      <div className="pointer-events-none fixed inset-x-0 bottom-[calc(1.25rem+env(safe-area-inset-bottom,0px))] z-40 flex justify-center px-4">
        <div className="pointer-events-auto relative flex items-center gap-1 rounded-[16px] border border-border bg-background/95 p-1.5 backdrop-blur-xl">
          <Tip content={showDocs ? 'Hide the words' : 'Read the docs'}>
            <button
              type="button"
              onClick={() => setShowDocs((v) => !v)}
              aria-pressed={showDocs}
              aria-label={showDocs ? 'Hide docs' : 'Show docs'}
              className="nav-control flex h-10 items-center gap-2 rounded-[10px] bg-foreground/[0.06] px-3 text-sm"
            >
              {showDocs ? <X className="size-4" aria-hidden="true" /> : <PanelLeftOpen className="size-4" aria-hidden="true" />}
              <span className="hidden sm:inline">{showDocs ? 'Hide docs' : 'Show docs'}</span>
            </button>
          </Tip>

          <span className="mx-0.5 h-6 w-px bg-border" />

          <Tip content="Play it again">
            <IconButton label="Play the transition" onClick={replay}>
              <Play />
            </IconButton>
          </Tip>
          {controls.length > 0 && (
            <Tip content="Fiddle with it">
              <IconButton label="Customise this transition" aria-expanded={showProps} onClick={() => setShowProps((v) => !v)} className={showProps ? 'bg-foreground/[0.1]' : ''}>
                <Settings2 />
              </IconButton>
            </Tip>
          )}
          <CopyMenu slug={slug} />

          <span className="mx-0.5 h-6 w-px bg-border" />

          <Tip content={prev.name}>
            <Link href={`/transitions/${prev.slug}`} aria-label={`Previous: ${prev.name}`} className="nav-control grid size-10 place-items-center rounded-[10px]">
              <ChevronLeft className="size-4" aria-hidden="true" />
            </Link>
          </Tip>
          <Tip content={next.name}>
            <Link href={`/transitions/${next.slug}`} aria-label={`Next: ${next.name}`} className="nav-control grid size-10 place-items-center rounded-[10px]">
              <ChevronRight className="size-4" aria-hidden="true" />
            </Link>
          </Tip>

          {showProps && controls.length > 0 && (
            <div
              data-lenis-prevent
              className="stage-props absolute right-0 bottom-full mb-2 max-h-[min(60vh,30rem)] w-[min(92vw,24rem)] overflow-y-auto rounded-[16px] border border-border bg-popover text-popover-foreground"
            >
              <div className="flex items-center justify-between px-4 pt-3.5 pb-2">
                <h2 className="text-sm">Customise</h2>
                <button type="button" onClick={reset} className="footer-link text-sm text-foreground/50">
                  Reset
                </button>
              </div>
              <Customize controls={controls} values={values} onChange={setValues} onReset={reset} stacked bare />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
