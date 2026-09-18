'use client'

import { useTheme } from 'next-themes'
import { ZhangxiaShader } from '@/components/site/zhangxia-shader'

/** The listing page's field: the top 60% of the screen, fading into the page below. */
export function ListingField() {
  const { resolvedTheme } = useTheme()
  return (
    <div aria-hidden="true" className="listing-field pointer-events-none absolute inset-x-0 top-0 h-[60vh]">
      <ZhangxiaShader
        theme={resolvedTheme === 'light' ? 'light' : 'dark'}
        background={{ dark: '#0a0a0a', light: '#f4f1ea' }}
        className="absolute inset-0"
      />
    </div>
  )
}
