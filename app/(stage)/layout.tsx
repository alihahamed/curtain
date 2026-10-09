/** The stage stands on its own: no navbar, no footer, nothing over the transition. */
export default function StageLayout({ children }: LayoutProps<'/'>) {
  return <>{children}</>
}
