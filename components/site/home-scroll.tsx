'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect } from 'react'

/** How far the grid overlaps the hero at load; matches the grid's negative top margin. */
export const PEEK = 220

/**
 * The home page scroll, on GSAP. Nothing is pinned and nothing fades: the
 * field drifts up slower than the page and grows a little as the hero leaves,
 * and the card columns arrive at slightly different speeds. Reduced motion
 * leaves the page to scroll on its own.
 */
export function HomeScroll() {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      const hero = document.querySelector<HTMLElement>('[data-hero]')
      const grid = document.querySelector<HTMLElement>('[data-grid]')
      if (!hero || !grid) return

      gsap.to('[data-field]', {
        yPercent: 30,
        scale: 1.1,
        ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.4 },
      })

      const tiles = gsap.utils.toArray<HTMLElement>('[data-tile]')
      const cols = () => (innerWidth >= 1024 ? 3 : innerWidth >= 640 ? 2 : 1)
      const lift = [0, 56, 24]
      gsap
        .timeline({ scrollTrigger: { trigger: grid, start: `top bottom-=${PEEK}`, end: 'top top+=120', scrub: 0.5 } })
        .fromTo(tiles, { y: (i) => lift[i % cols()] }, { y: 0, ease: 'none' }, 0)
    })
    return () => ctx.revert()
  }, [])
  return null
}
