import type { Metadata } from 'next'
import { Bricolage_Grotesque, Onest } from 'next/font/google'
import './globals.css'

// See design.md: Bricolage for headings, medium or semibold; Onest, medium, for everything else.
const heading = Bricolage_Grotesque({ variable: '--font-heading', subsets: ['latin'], axes: ['opsz'] })
const text = Onest({ variable: '--font-text', subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://curtain.dev'),
  title: {
    default: 'curtain — characterful page transitions for Next.js',
    template: '%s — curtain',
  },
  description:
    'Page transitions with actual personality, installed with the shadcn CLI. One line in your layout.',
  openGraph: {
    type: 'website',
    siteName: 'curtain',
    title: 'curtain — characterful page transitions for Next.js',
    description:
      'Page transitions with actual personality, installed with the shadcn CLI. One line in your layout.',
  },
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${heading.variable} ${text.variable} dark h-full antialiased`}
      style={{ colorScheme: 'dark' }}
    >
      <body className="bg-background text-foreground flex min-h-full flex-col">
        {children}
      </body>
    </html>
  )
}
