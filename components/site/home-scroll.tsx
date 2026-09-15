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

      gsap
        .timeline({ scrollTrigger: { trigger: grid, start: 'top bottom', end: 'top top', scrub: 0.4 } })
        .to('[data-field]', { scale: 1.14, yPercent: -5, ease: 'none' }, 0)
        .to('[data-hero-copy]', { yPercent: -45, opacity: 0, ease: 'none' }, 0)

      gsap.from('[data-tile]', {
        y: 80,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: { trigger: grid, start: 'top 80%', once: true },
      })
    })
    return () => ctx.revert()
  }, [])
  return null
}
