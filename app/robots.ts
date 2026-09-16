import type { MetadataRoute } from 'next'

/** Everything public is crawlable except the bare preview frames and the lab. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/preview/', '/lab/', '/brand'] },
    sitemap: 'https://curtain.dev/sitemap.xml',
  }
}
