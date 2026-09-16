import type { Metadata, Viewport } from 'next'
import { Bricolage_Grotesque, Onest } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import './globals.css'

// See design.md: Bricolage for headings, medium or semibold; Onest, medium, for everything else.
const heading = Bricolage_Grotesque({ variable: '--font-heading', subsets: ['latin'], axes: ['opsz'] })
const text = Onest({ variable: '--font-text', subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://curtain.dev'),
  title: {
    default: 'Curtain — characterful page transitions for Next.js',
    template: '%s — Curtain',
  },
  description:
    'Page transitions with actual personality, installed with the shadcn CLI. One line in your layout.',
  openGraph: {
    type: 'website',
    siteName: 'Curtain',
    title: 'Curtain — characterful page transitions for Next.js',
    description:
      'Page transitions with actual personality, installed with the shadcn CLI. One line in your layout.',
  },
}

/** The browser chrome on phones matches the page in either theme. */
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
    { media: '(prefers-color-scheme: light)', color: '#f4f1ea' },
  ],
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${heading.variable} ${text.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="bg-background text-foreground flex min-h-full flex-col">
        <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
