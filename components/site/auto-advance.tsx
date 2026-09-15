'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Inside a preview frame opened with ?loop, the pages take turns on their own
 * so a tile can show the transition without a click. The query rides along.
 */
export function AutoAdvance({ href, delay = 1800 }: { href: string; delay?: number }) {
  const router = useRouter()
  const params = useSearchParams()
  const loop = params.has('loop')
  useEffect(() => {
    if (!loop) return
    document.documentElement.classList.add('loop')
    const t = window.setTimeout(() => router.push(`${href}?loop`), delay)
    return () => window.clearTimeout(t)
  }, [loop, href, delay, router])
  return null
}
