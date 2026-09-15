import { SiteNav } from '@/components/site/site-nav'
import { githubStars } from '@/lib/github-stars'

export default async function SiteLayout({ children }: LayoutProps<'/'>) {
  const stars = await githubStars()
  return (
    <>
      <SiteNav stars={stars} />
      {children}
    </>
  )
}
