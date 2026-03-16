import type { MetadataRoute } from 'next'
import { getAllTips } from '@/lib/tips'
import { getAllPosts } from '@/lib/blog'

export const dynamic = 'force-static'

const BASE = 'https://tommylahitte.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const tips = getAllTips()
  const posts = await getAllPosts()

  const tipEntries: MetadataRoute.Sitemap = tips.map((tip) => ({
    url: `${BASE}/tips/${tip.slug}/`,
    lastModified: new Date(tip.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE}/blog/${post.slug}/`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [
    { url: `${BASE}/`,      lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/tips/`, lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE}/blog/`, lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    ...tipEntries,
    ...postEntries,
  ]
}
