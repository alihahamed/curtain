/**
 * No chrome for now: the pages stand on their own. The header and footer come
 * back when the site has a shape to hang them on.
 */
export default function SiteLayout({ children }: LayoutProps<'/'>) {
  return <>{children}</>
}
