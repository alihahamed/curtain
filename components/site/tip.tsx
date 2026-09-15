'use client'

import type { ReactElement } from 'react'
import { Tooltip } from '@/components/motion/tooltip'

/** The bar's tooltip: same radius as the controls, a border and no shadow (design.md, surfaces). */
export function Tip({ children, content }: { children: ReactElement; content: string }) {
  return (
    <Tooltip content={content} side="bottom" className="rounded-[8px] bg-popover shadow-none">
      {children}
    </Tooltip>
  )
}
