'use client'

import { Check, Copy } from 'lucide-react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { IconButton } from '@/components/site/icon-button'
import { Tip } from '@/components/site/tip'
import { transitions } from '@/lib/transitions'

const managers = [
  { id: 'bun', run: 'bunx --bun' },
  { id: 'pnpm', run: 'pnpm dlx' },
  { id: 'npm', run: 'npx' },
  { id: 'yarn', run: 'yarn dlx' },
] as const
type Manager = (typeof managers)[number]['id']

const KEY = 'curtain:pm'
const HOST = 'https://curtain.dev/r/'
const names = transitions.filter((t) => t.ready).map((t) => t.slug)
const ROTATE_MS = 2000

/**
 * The install line for the hero. Switching managers draws the new command
 * across the line like a curtain; copying sweeps the accent through the text
 * and holds the button pink for a beat. The chosen manager is remembered.
 */
export function InstallCommand({ className = '' }: { className?: string }) {
  const [pm, setPm] = useState<Manager>('bun')
  const [copied, setCopied] = useState(false)
  const [sweep, setSweep] = useState(0)
  const tabs = useRef<HTMLDivElement>(null)
  const [marker, setMarker] = useState({ x: 0, w: 0, ready: false })
  const [idx, setIdx] = useState(0)
  const [held, setHeld] = useState(false)
  const measure = useRef<HTMLSpanElement>(null)
  const [nameW, setNameW] = useState<number | null>(null)
  const name = names[idx]

  // The transition name turns over every two seconds, unless the pointer or
  // focus is on the block, so what you see is what you copy.
  useEffect(() => {
    if (held || copied) return
    const id = window.setInterval(() => {
      if (document.visibilityState === 'visible') setIdx((i) => (i + 1) % names.length)
    }, ROTATE_MS)
    return () => window.clearInterval(id)
  }, [held, copied])

  // The name's box is sized to the incoming word so the caret glides rather than jumps.
  useLayoutEffect(() => {
    if (measure.current) setNameW(measure.current.offsetWidth)
  }, [name])

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY)
      if (managers.some((m) => m.id === saved)) setPm(saved as Manager)
    } catch {}
  }, [])

  // The marker follows the active tab; measured, so tabs can be their natural width.
  useLayoutEffect(() => {
    const el = tabs.current?.querySelector<HTMLElement>(`[data-pm="${pm}"]`)
    if (!el) return
    const place = () => setMarker({ x: el.offsetLeft, w: el.offsetWidth, ready: true })
    place()
    const ro = new ResizeObserver(place)
    ro.observe(el)
    return () => ro.disconnect()
  }, [pm])

  const choose = (id: Manager) => {
    setPm(id)
    try {
      localStorage.setItem(KEY, id)
    } catch {}
  }

  const run = managers.find((m) => m.id === pm)!.run
  const command = `${run} shadcn@latest add ${HOST}${name}.json`

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command)
    } catch {
      return
    }
    setCopied(true)
    setSweep((n) => n + 1)
    window.setTimeout(() => setCopied(false), 1400)
  }

  const onTabKey = (e: React.KeyboardEvent) => {
    const i = managers.findIndex((m) => m.id === pm)
    const next = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? managers.length - 1 : -1
    if (next < 0 && e.key !== 'Home') return
    e.preventDefault()
    const id = managers[(next + managers.length) % managers.length].id
    choose(id)
    tabs.current?.querySelector<HTMLElement>(`[data-pm="${id}"]`)?.focus()
  }

  return (
    <div
      className={`install w-full max-w-[40rem] rounded-[14px] border border-border bg-background p-1.5 text-left ${className}`}
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node | null) && setHeld(false)}
    >
      <div className="flex items-center justify-between gap-2">
        <div ref={tabs} role="tablist" aria-label="Package manager" className="relative flex gap-1" onKeyDown={onTabKey}>
          <span
            aria-hidden="true"
            className={`install-marker pointer-events-none absolute top-0 h-10 rounded-[8px] bg-foreground/[0.08] ${marker.ready ? '' : 'invisible'}`}
            style={{ translate: `${marker.x}px 0`, width: marker.w }}
          />
          {managers.map((m) => (
            <button
              key={m.id}
              type="button"
              role="tab"
              data-pm={m.id}
              aria-selected={m.id === pm}
              tabIndex={m.id === pm ? 0 : -1}
              onClick={() => choose(m.id)}
              className="install-tab relative z-10 h-10 rounded-[8px] px-3 text-sm text-foreground/60 aria-selected:text-foreground"
            >
              {m.id}
            </button>
          ))}
        </div>
        <Tip content={copied ? 'Copied' : 'Copy'}>
          <IconButton label="Copy install command" className={copied ? 'brand-fill' : 'bg-foreground/[0.08]'} onClick={copy}>
            <Copy className={`icon-swap ${copied ? 'icon-swap-out' : ''}`} />
            <Check className={`icon-swap ${copied ? '' : 'icon-swap-out'}`} />
          </IconButton>
        </Tip>
      </div>

      <button
        type="button"
        onClick={copy}
        aria-label={`Copy: ${command}`}
        className="install-line relative mt-1.5 block w-full overflow-hidden rounded-[8px] border-t border-border px-3 pt-4 pb-3.5 text-left text-[15px] leading-relaxed tracking-[0.01em] sm:px-4"
      >
        <span key={pm} className="install-text block">
          <span className="text-muted-foreground">{run}</span> shadcn@latest add{' '}
          <span className="whitespace-nowrap">
            <span className="text-muted-foreground">{HOST}</span>
            <span className="install-name relative inline-block overflow-hidden align-bottom" style={{ width: nameW ?? undefined }}>
              <span key={name} className="install-name-in inline-block">
                {name}
              </span>
              <span ref={measure} aria-hidden="true" className="invisible absolute left-0 top-0 whitespace-pre">
                {name}
              </span>
            </span>
            .json
          </span>
          <span aria-hidden="true" className="install-caret ml-[0.15em] inline-block h-[1.05em] w-[2px] translate-y-[0.2em] rounded-full bg-foreground/70" />
        </span>
        <span key={sweep} aria-hidden="true" className={`install-sweep pointer-events-none absolute inset-0 ${sweep ? 'install-sweep-run' : ''}`} />
      </button>
    </div>
  )
}
