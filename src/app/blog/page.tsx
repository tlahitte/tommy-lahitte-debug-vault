import { Suspense } from 'react'
import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/blog'
import BlogList, { BlogListStatic } from '@/components/blog/BlogList'
import PageBanner from '@/components/ui/PageBanner'

export const metadata: Metadata = {
  title: 'Journal',
  description: 'Projects, articles, and recommendations from Tommy Lahitte.',
  alternates: {
    canonical: 'https://tommylahitte.com/blog/',
  },
  openGraph: {
    title: 'Journal | Tommy Lahitte',
    description: 'Projects, articles, and recommendations from Tommy Lahitte.',
    url: 'https://tommylahitte.com/blog/',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Journal -Tommy Lahitte' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Journal | Tommy Lahitte',
    description: 'Projects, articles, and recommendations from Tommy Lahitte.',
    images: ['/og-image.png'],
  },
}

export default async function BlogPage() {
  const posts = await getAllPosts()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Journal',
            description: 'Projects, articles, and recommendations from Tommy Lahitte.',
            url: 'https://tommylahitte.com/blog/',
            mainEntity: {
              '@type': 'ItemList',
              numberOfItems: posts.length,
              itemListElement: posts.map((post, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                url: `https://tommylahitte.com/blog/${post.slug}/`,
                name: post.title,
              })),
            },
          }),
        }}
      />
      <PageBanner
        page="blog"
        title="Journal"
        subtitle="Projects, articles, and things I find interesting."
      />

      <div className="px-4 sm:px-6 pb-32 pt-8">
        <Suspense fallback={<BlogListStatic posts={posts} />}>
          <BlogList posts={posts} />
        </Suspense>
      </div>
    </>
  )
}
