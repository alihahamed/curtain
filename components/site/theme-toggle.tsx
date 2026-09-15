'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useSyncExternalStore } from 'react'
import { IconButton } from '@/components/site/icon-button'
import { Tip } from '@/components/site/tip'

const subscribe = () => () => {}
const mounted = () => useSyncExternalStore(subscribe, () => true, () => false)

/** Sun or moon, cross-faded rather than swapped (design.md, motion in the interface). */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const ready = mounted()
  const dark = !ready || resolvedTheme === 'dark'
  return (
    <Tip content={dark ? 'Lights on' : 'Lights off'}>
      <IconButton
        className={className}
        label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
        onClick={() => setTheme(dark ? 'light' : 'dark')}
      >
        <Sun className={`icon-swap ${dark ? 'icon-swap-out' : ''}`} />
        <Moon className={`icon-swap ${dark ? '' : 'icon-swap-out'}`} />
      </IconButton>
    </Tip>
  )
}
