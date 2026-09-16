import { SiteFooter } from '@/components/site/site-footer'
import { SiteNav } from '@/components/site/site-nav'
import { SmoothScroll } from '@/components/site/smooth-scroll'
import { githubStars } from '@/lib/github-stars'

export default async function SiteLayout({ children }: LayoutProps<'/'>) {
  const stars = await githubStars()
  return (
    <>
      <SmoothScroll />
      <SiteNav stars={stars} />
      {children}
      <SiteFooter stars={stars} />
    </>
  )
}
