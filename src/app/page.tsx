import type { Metadata } from 'next'
import Link from 'next/link'
import Hero from '@/components/home/Hero'
import BlogCard from '@/components/blog/BlogCard'
import AboutCard from '@/components/home/AboutCard'
import { getAllPosts } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'Tommy Lahitte | Maker & Tinkerer',
  description:
    'Tommy Lahitte — maker who bridges art and technology. Projects, field notes, and things worth building.',
  alternates: {
    canonical: 'https://tommylahitte.com/',
  },
  openGraph: {
    title: 'Tommy Lahitte | Maker & Tinkerer',
    description:
      'Tommy Lahitte — maker who bridges art and technology. Projects, field notes, and things worth building.',
    url: 'https://tommylahitte.com/',
    type: 'website',
  },
}

export default async function HomePage() {
  const allPosts = await getAllPosts()

  const featuredProjects = allPosts
    .filter((p) => p.category === 'Project')
    .slice(0, 3)

  const recentArticles = allPosts
    .filter((p) => p.category === 'Article')
    .slice(0, 3)

  return (
    <>
      {/* Section 1: Hero */}
      <section
        className="bg-gradient-to-b from-surface-raised to-surface border-b border-border relative overflow-hidden hero-texture"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(200,90,58,0.06) 0%, transparent 70%), linear-gradient(to bottom, var(--surface-raised), var(--surface))',
        }}
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex flex-col gap-6 py-10 sm:py-16">
            <Hero />
          </div>
        </div>
      </section>

      {/* Section 2: Featured Projects — HOME-02 */}
      {featuredProjects.length > 0 && (
        <section className="pt-12 sm:pt-16 pb-12 bg-surface">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-text-primary mb-8 font-display">Projects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredProjects.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link
                href="/blog?category=Project"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover transition-colors"
              >
                View All Projects
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Section 3: Recent Articles — HOME-03 */}
      {recentArticles.length > 0 && (
        <section className="pt-12 sm:pt-16 pb-12 bg-surface-raised">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-text-primary mb-8 font-display">Journal</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recentArticles.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover transition-colors"
              >
                View All Articles
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Section 4: Short About — HOME-04 */}
      <section className="pt-12 sm:pt-16 pb-32 bg-surface">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <AboutCard />
        </div>
      </section>
    </>
  )
}
