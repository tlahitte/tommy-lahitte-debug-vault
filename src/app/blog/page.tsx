import { Suspense } from 'react'
import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/blog'
import BlogList from '@/components/blog/BlogList'
import RandomDoodle from '@/components/ui/RandomDoodle'

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
      {/* Page header -kraft visual identity with illustration */}
      <section className="relative overflow-hidden bg-surface-raised border-b border-border hero-texture">
        <div
          className="absolute top-0 inset-x-0 h-96 z-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(200,90,58,0.06) 0%, transparent 70%)',
          }}
        />
        <div className="relative z-10 px-4 sm:px-6 pt-8 sm:pt-12 pb-16">
          <h1 className="text-3xl font-bold text-text-primary mb-2 font-display">Journal</h1>
          <p className="text-text-muted">Projects, articles, and things I find interesting.</p>
        </div>
        {/* Random doodle -right-aligned within content area, contained in banner */}
        <div className="absolute left-1/2 -translate-x-1/2 w-full px-4 sm:px-6 bottom-0 pointer-events-none select-none hidden sm:block">
          <div className="ml-auto opacity-100" style={{ width: 'clamp(10rem, 15vw, 16rem)', height: 'clamp(10rem, 15vw, 16rem)' }}>
            <RandomDoodle />
          </div>
        </div>
      </section>

      <div className="px-4 sm:px-6 pb-32 pt-8">
        <Suspense fallback={null}>
          <BlogList posts={posts} />
        </Suspense>
      </div>
    </>
  )
}
