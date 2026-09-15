import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

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
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
      style={{ colorScheme: 'dark' }}
    >
      <body className="bg-background text-foreground flex min-h-full flex-col">
        {children}
      </body>
    </html>
  )
}
