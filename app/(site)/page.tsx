import { DarkstarShader } from '@/components/site/darkstar-shader'

/**
 * The home page is the hero and nothing else: a WebGL field filling whatever
 * is left of the viewport between the header and the footer. The canvas sizes
 * itself to its box, caps its own pixel count, and pauses when hidden, so it
 * costs the same on a phone as on a desktop.
 */
export default function Home() {
  return (
    <main className="relative flex-1 min-h-[60dvh] overflow-hidden bg-background">
      <DarkstarShader
        theme="light"
        background={{ dark: '#0a0a0a', light: '#f4f1ea' }}
        className="absolute inset-0"
      />
    </main>
  )
}
