'use client'

import { Suspense } from 'react'
import { OriginTransition, type OriginOptions } from '@/components/origin'
import { usePreviewOptions } from '@/components/site/preview-options'

function Frame({ children }: { children: React.ReactNode }) {
  const options = usePreviewOptions() as Partial<OriginOptions>
  return <OriginTransition {...options}>{children}</OriginTransition>
}

/** Bare frame — no site chrome, so the transition is the only thing moving. */
export default function OriginPreviewLayout({ children }: LayoutProps<'/preview/origin'>) {
  return (
    <Suspense>
      <Frame>{children}</Frame>
    </Suspense>
  )
}
