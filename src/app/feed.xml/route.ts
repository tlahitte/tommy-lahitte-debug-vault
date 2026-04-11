import { getAllPosts } from '@/lib/blog'
import { getAllTips } from '@/lib/tips'

export const dynamic = 'force-static'

const BASE = 'https://tommylahitte.com'

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const posts = await getAllPosts()
  const tips = await getAllTips()

  const postItems = posts.map(
    (post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${BASE}/blog/${post.slug}/</link>
      <guid isPermaLink="true">${BASE}/blog/${post.slug}/</guid>
      <description>${escapeXml(post.excerpt)}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <category>Journal</category>
    </item>`
  )

  const tipItems = tips.map(
    (tip) => `
    <item>
      <title>${escapeXml(tip.title)}</title>
      <link>${BASE}/tips/${tip.slug}/</link>
      <guid isPermaLink="true">${BASE}/tips/${tip.slug}/</guid>
      <description>${escapeXml(tip.summary)}</description>
      <pubDate>${new Date(tip.publishedAt).toUTCString()}</pubDate>
      <category>Unreal Tips</category>
    </item>`
  )

  const allItems = [...postItems, ...tipItems]

  const latestDate =
    posts.length > 0
      ? new Date(posts[0].date).toUTCString()
      : tips.length > 0
        ? new Date(tips[0].publishedAt).toUTCString()
        : new Date().toUTCString()

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Tommy Lahitte</title>
    <link>${BASE}/</link>
    <description>Unreal Engine debugging tips, projects, and field notes by Tommy Lahitte.</description>
    <language>en</language>
    <lastBuildDate>${latestDate}</lastBuildDate>
    <atom:link href="${BASE}/feed.xml" rel="self" type="application/rss+xml"/>
${allItems.join('\n')}
  </channel>
</rss>`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  })
}
