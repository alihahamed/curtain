'use client'

import { Check, Copy } from 'lucide-react'
import { useRef, useState } from 'react'
import { IconButton } from '@/components/site/icon-button'

export const managers = [
  { id: 'bun', run: 'bunx --bun' },
  { id: 'pnpm', run: 'pnpm dlx' },
  { id: 'npm', run: 'npx' },
  { id: 'yarn', run: 'yarn dlx' },
] as const

export const install = (run: string, slug: string) => `${run} shadcn@latest add https://curtain.dev/r/${slug}.json`

/**
 * A copy control that opens a small menu on hover or focus, one row per
 * package manager, each its own copy button. Opens upward, for tiles.
 */
export function CopyMenu({ slug, className = '' }: { slug: string; className?: string }) {
  const [open, setOpen] = useState(false)
  const [done, setDone] = useState<string | null>(null)
  const closing = useRef<number | null>(null)

  const show = () => {
    if (closing.current) window.clearTimeout(closing.current)
    setOpen(true)
  }
  const hide = () => {
    closing.current = window.setTimeout(() => setOpen(false), 140)
  }
  const copy = async (id: string, run: string) => {
    try {
      await navigator.clipboard.writeText(install(run, slug))
    } catch {
      return
    }
    setDone(id)
    window.setTimeout(() => setDone((d) => (d === id ? null : d)), 1200)
  }

  return (
    <span
      className={`relative inline-flex ${className}`}
      onPointerEnter={show}
      onPointerLeave={hide}
      onFocus={show}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node | null) && setOpen(false)}
    >
      <IconButton label={`Copy install command for ${slug}`} aria-expanded={open} className={done ? 'brand-fill' : 'bg-foreground/[0.08]'} onClick={() => copy('bun', managers[0].run)}>
        <Copy className={`icon-swap ${done ? 'icon-swap-out' : ''}`} />
        <Check className={`icon-swap ${done ? '' : 'icon-swap-out'}`} />
      </IconButton>
      <span
        role="menu"
        aria-label="Copy install command"
        data-open={open || undefined}
        className="copy-menu absolute right-0 bottom-full z-20 mb-2 flex w-36 flex-col gap-0.5 rounded-[12px] border border-border bg-popover p-1 text-popover-foreground"
      >
        {managers.map((m) => (
          <button
            key={m.id}
            type="button"
            role="menuitem"
            tabIndex={open ? 0 : -1}
            onClick={() => copy(m.id, m.run)}
            className={`nav-control flex h-9 items-center justify-between rounded-[8px] px-2.5 text-sm ${done === m.id ? 'brand-fill' : 'text-foreground/80'}`}
          >
            {m.id}
            <span className="relative grid size-4 place-items-center [&>svg]:col-start-1 [&>svg]:row-start-1 [&>svg]:size-3.5">
              <Copy className={`icon-swap ${done === m.id ? 'icon-swap-out' : ''}`} />
              <Check className={`icon-swap ${done === m.id ? '' : 'icon-swap-out'}`} />
            </span>
          </button>
        ))}
      </span>
    </span>
  )
}
