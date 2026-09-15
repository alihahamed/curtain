'use client'

import { useTheme } from 'next-themes'
import { DarkstarShader } from '@/components/site/darkstar-shader'

/** The home page field, following the site theme. The shader eases between its two looks itself. */
export function HeroField() {
  const { resolvedTheme } = useTheme()
  return (
    <DarkstarShader
      theme={resolvedTheme === 'light' ? 'light' : 'dark'}
      background={{ dark: '#0a0a0a', light: '#f4f1ea' }}
      className="absolute inset-0"
    />
  )
}
