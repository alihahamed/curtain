'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Inside a preview frame opened with ?loop, the pages take turns on their own
 * so a tile can show the transition without a click. It clicks the shell's
 * own link rather than pushing a route, so whichever core is wrapping the
 * preview intercepts it and the transition actually plays. The loop flag
 * lives on <html> once set, so it survives the navigations that follow.
 */
export function AutoAdvance({ href, delay = 1800 }: { href: string; delay?: number }) {
  const params = useSearchParams()
  const flagged = params.has('loop')
  useEffect(() => {
    const root = document.documentElement
    if (flagged) root.classList.add('loop')
    if (!root.classList.contains('loop')) return
    const t = window.setTimeout(() => {
      document.querySelector<HTMLAnchorElement>(`a[href="${href}"]`)?.click()
    }, delay)
    return () => window.clearTimeout(t)
  }, [flagged, href, delay])
  return null
}
