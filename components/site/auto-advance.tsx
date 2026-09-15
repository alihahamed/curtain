'use client'

import { useSearchParams } from 'next/navigation'
import { useTransitionState } from 'next-transition-router'
import { useEffect } from 'react'

/**
 * Inside a preview frame opened with ?loop, the pages take turns on their own
 * so a card can show the transition without a click. It clicks the shell's
 * own link rather than pushing a route, so whichever core is wrapping the
 * preview intercepts it and the transition actually plays. The timer only
 * starts once the previous transition has fully finished: a click during the
 * enter phase would cut it off and leave the overlay stranded. The loop flag
 * lives on <html> once set, so it survives the navigations that follow.
 */
export function AutoAdvance({ href, delay = 2000 }: { href: string; delay?: number }) {
  const params = useSearchParams()
  const flagged = params.has('loop')
  // 'none' between transitions; the view-transition core has no router context and reads as 'none' throughout.
  const { stage } = useTransitionState()
  useEffect(() => {
    const root = document.documentElement
    if (flagged) root.classList.add('loop')
    if (!root.classList.contains('loop') || stage !== 'none') return
    // While the frame is paused (its card is off screen) or the tab is hidden, keep
    // checking back rather than turning the page, so it resumes as soon as it is seen.
    let t = 0
    const tick = () => {
      if (document.visibilityState !== 'visible' || root.hasAttribute('data-paused')) {
        t = window.setTimeout(tick, 400)
        return
      }
      document.querySelector<HTMLAnchorElement>(`a[href="${href}"]`)?.click()
    }
    t = window.setTimeout(tick, delay)
    return () => window.clearTimeout(t)
  }, [flagged, href, delay, stage])
  return null
}
