import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { TransitionDocs } from '@/components/site/transition-docs'
import { TransitionStage } from '@/components/site/transition-stage'
import { bySlug, transitions } from '@/lib/transitions'

const shipped = transitions.filter((t) => t.ready)

export function generateStaticParams() {
  return transitions.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps<'/transitions/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const t = bySlug(slug)
  if (!t) return {}
  return { title: t.name, description: t.tagline }
}

export default async function TransitionPage({ params }: PageProps<'/transitions/[slug]'>) {
  const { slug } = await params
  const t = bySlug(slug)
  if (!t) notFound()

  // The neighbours wrap, so the arrows never dead-end.
  const i = shipped.findIndex((o) => o.slug === t.slug)
  const at = (n: number) => shipped[(n + shipped.length) % shipped.length]
  const near = (o: (typeof shipped)[number]) => ({ slug: o.slug, name: o.name })

  return (
    <TransitionStage
      slug={t.slug}
      name={t.name}
      tagline={t.tagline}
      controls={t.controls}
      prev={near(at(i - 1))}
      next={near(at(i + 1))}
      docs={<TransitionDocs t={t} />}
    />
  )
}
