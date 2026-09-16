import type { MetadataRoute } from 'next'
import { transitions } from '@/lib/transitions'

const BASE = 'https://curtain.dev'

/** The site's pages plus one entry per shipped transition. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/transitions`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/docs`, changeFrequency: 'monthly', priority: 0.8 },
    ...transitions
      .filter((t) => t.ready)
      .map((t) => ({ url: `${BASE}/transitions/${t.slug}`, changeFrequency: 'monthly' as const, priority: 0.7 })),
  ]
}
