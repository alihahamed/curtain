import type { Metadata } from 'next'
import { TransitionGrid } from '@/components/site/transition-grid'

export const metadata: Metadata = {
  title: 'Transitions',
  description: 'Every Curtain transition, playing live. Each installs on its own and brings only what it needs.',
}

export default function Transitions() {
  return (
    <main className="w-full px-4 pt-32 pb-24 sm:px-6">
      <div className="text-center">
        <h1 className="font-heading text-[clamp(2.5rem,1.6rem+3.6vw,4.5rem)] leading-[1.02] tracking-[-0.02em]">Pick your exit</h1>
        <p className="mx-auto mt-4 max-w-[40ch] text-foreground/65 text-pretty">
          Every transition, playing live. Each one installs on its own and brings only what it needs.
        </p>
      </div>
      <TransitionGrid />
    </main>
  )
}
