import { PreviewShell } from '@/components/site/preview-shell'

/**
 * fromLink, because origin grows the next page out of the element you
 * clicked. A whole-page link would make that rectangle the whole page, and
 * there'd be nothing to see.
 */
export default function A() {
  return (
    <PreviewShell step="one" href="/preview/origin/b" accent="#d9552b" bg="#f4f1ea" fg="#1c1b1a" layout="left" fromLink sub="Either button — each opens in its own shape and colour.">
      Out of the thing you clicked.
    </PreviewShell>
  )
}
