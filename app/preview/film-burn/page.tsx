import { PreviewShell } from '@/components/site/preview-shell'

/*
 * Cool mid-tones, flat colour. Fire needs the page dark enough for the white
 * core and amber to punch, but light enough that the deep red tail still
 * registers — white loses the tail, near-black loses it too. Pine sits at 0.13
 * luminance, which holds both ends.
 */
export default function A() {
  return (
    <PreviewShell step="one" href="/preview/film-burn/b" accent="#2a5349" bg="#3c6f62" fg="#f2f7f5" layout="centre" sub="The frame catches first.">
      Burn through.
    </PreviewShell>
  )
}
