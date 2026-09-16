'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

let instance: Lenis | null = null

/** The page's Lenis instance, or null when smooth scrolling is off (reduced motion). */
export const getLenis = () => instance

/**
 * Smooth scrolling for the site, on Lenis. It runs on GSAP's ticker and tells
 * ScrollTrigger about every scroll, so the scroll-driven animations stay in step
 * with it. Visitors who ask for reduced motion keep native scrolling. Anything
 * inside a dialog (the search list) scrolls natively.
 */
export function SmoothScroll() {
  const pathname = usePathname()

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.registerPlugin(ScrollTrigger)
    const lenis = new Lenis({
      lerp: 0.1,
      anchors: true,
      prevent: (node) => node.nodeName === 'DIALOG' || !!node.closest?.('dialog, [data-lenis-prevent]'),
    })
    instance = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      instance = null
    }
  }, [])

  // A new page starts at the top, without gliding there from the old position.
  useEffect(() => {
    instance?.scrollTo(0, { immediate: true, force: true })
  }, [pathname])

  return null
}
