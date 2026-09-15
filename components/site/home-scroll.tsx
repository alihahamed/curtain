'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect } from 'react'

/** How far the grid overlaps the hero at load; matches the grid's negative top margin. */
export const PEEK = 140

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
      // Columns arrive at different speeds, meet level with the top of the screen, then part again as they leave.
      const arrive = [0, 56, 24]
      const leave = [0, -90, -45]
      const settleAt = () => innerHeight - PEEK - 120
      gsap
        .timeline({ scrollTrigger: { trigger: grid, start: `top bottom-=${PEEK}`, end: 'bottom top', scrub: 0.6, invalidateOnRefresh: true } })
        .fromTo(tiles, { y: (i) => arrive[i % cols()] }, { y: 0, ease: 'none', duration: settleAt }, 0)
        .to(tiles, { y: (i) => leave[i % cols()], ease: 'none', duration: () => grid.offsetHeight + 120 })

      // The sections under the grid rise a little as they come in. Once, no fade.
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.from(el, { y: 48, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%', once: true } })
      })
    })
    return () => ctx.revert()
  }, [])
  return null
}
