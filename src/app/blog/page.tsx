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
  },
}

export default async function BlogPage() {
  const posts = await getAllPosts()

  return (
    <>
      {/* Page header — kraft visual identity with illustration */}
      <section className="relative overflow-hidden bg-surface-raised border-b border-border -mt-14 hero-texture">
        <div
          className="absolute top-0 inset-x-0 h-96 z-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(200,90,58,0.06) 0%, transparent 70%)',
          }}
        />
        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 pt-[5.5rem] sm:pt-[6.5rem] pb-16">
          <h1 className="text-3xl font-bold text-text-primary mb-2 font-display">Journal</h1>
          <p className="text-text-muted">Projects, articles, and things I find interesting.</p>
        </div>
        {/* Random doodle — right-aligned within content area, contained in banner */}
        <div className="absolute left-1/2 -translate-x-1/2 w-full max-w-5xl px-4 sm:px-6 bottom-0 pointer-events-none select-none">
          <div className="ml-auto w-44 sm:w-56 h-44 sm:h-56 opacity-100">
            <RandomDoodle />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 pb-32 pt-8">
        <Suspense fallback={null}>
          <BlogList posts={posts} />
        </Suspense>
      </div>
    </>
  )
}
