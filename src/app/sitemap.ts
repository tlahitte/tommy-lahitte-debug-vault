import type { MetadataRoute } from 'next'
import { getAllTips } from '@/lib/tips'
import { getAllPosts } from '@/lib/blog'

export const dynamic = 'force-static'

const BASE = 'https://tommylahitte.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const tips = await getAllTips()
  const posts = await getAllPosts()

  const tipEntries: MetadataRoute.Sitemap = tips.map((tip) => ({
    url: `${BASE}/tips/${tip.slug}/`,
    lastModified: new Date(tip.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE}/blog/${post.slug}/`,
    lastModified: new Date(post.lastModified ?? post.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const latestTipDate = tips.length > 0
    ? new Date(tips[0].publishedAt)
    : new Date()

  const latestPostDate = posts.length > 0
    ? new Date(posts[0].date)
    : null

  return [
    { url: `${BASE}/`,       lastModified: latestTipDate, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/tips/`,  lastModified: latestTipDate, changeFrequency: 'weekly',  priority: 0.9 },
    // Only include /blog/ in sitemap when it has published posts
    ...(posts.length > 0
      ? [{ url: `${BASE}/blog/`, lastModified: latestPostDate!, changeFrequency: 'weekly' as const, priority: 0.9 }]
      : []),
    ...tipEntries,
    ...postEntries,
  ]
}
