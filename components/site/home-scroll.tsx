'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect } from 'react'

/**
 * The home page scroll, on GSAP. The hero pins while the grid slides up over
 * it; as it does, the field drifts and grows slowly and the copy recedes at
 * about half speed. Tiles rise into place in a stagger the first time the grid
 * arrives. Reduced motion leaves the page to scroll on its own.
 */
export function HomeScroll() {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      const hero = document.querySelector<HTMLElement>('[data-hero]')
      const grid = document.querySelector<HTMLElement>('[data-grid]')
      if (!hero || !grid) return

      ScrollTrigger.create({ trigger: hero, start: 'top top', end: () => `+=${grid.offsetHeight}`, pin: true, pinSpacing: false })

      const tiles = gsap.utils.toArray<HTMLElement>('[data-tile]')
      gsap
        .timeline({ scrollTrigger: { trigger: grid, start: 'top bottom', end: 'top top', scrub: 0.4 } })
        .to('[data-field]', { scale: 1.14, yPercent: -5, ease: 'none' }, 0)
        .to('[data-hero-copy]', { yPercent: -45, opacity: 0, ease: 'none' }, 0)
        // The fade over the peeking row lifts as the grid comes up.
        .fromTo('[data-tiles]', { '--fade': '260px' }, { '--fade': '0px', ease: 'none' }, 0)
        // The two columns drift at different speeds, so the rows arrive rather than scroll.
        .fromTo(tiles.filter((_, i) => i % 2 === 0), { y: 60 }, { y: 0, ease: 'none' }, 0)
        .fromTo(tiles.filter((_, i) => i % 2 === 1), { y: 140 }, { y: 0, ease: 'none' }, 0)
    })
    return () => ctx.revert()
  }, [])
  return null
}
