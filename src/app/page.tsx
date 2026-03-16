// PHASE 3: DONE
import type { Metadata } from 'next'
import Link from 'next/link'
import Hero from '@/components/home/Hero'
import AboutCard from '@/components/home/AboutCard'
import TipCard from '@/components/tips/TipCard'
import BlogCard from '@/components/blog/BlogCard'
import { getAllTips } from '@/lib/tips'
import { getAllPosts } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'Tommy Lahitte | QA Engineer & Unreal Debug Vault',
  description:
    'QA and debugging field notes for Unreal Engine by Tommy Lahitte, QA Engineer at Epic Games. Tips on the Visual Logger, functional testing, log filtering, and more.',
  alternates: {
    canonical: 'https://tommylahitte.com/',
  },
  openGraph: {
    title: 'Tommy Lahitte | QA Engineer & Unreal Debug Vault',
    description:
      'QA and debugging field notes for Unreal Engine by Tommy Lahitte, QA Engineer at Epic Games.',
    url: 'https://tommylahitte.com/',
    type: 'website',
  },
}

export default async function HomePage() {
  const latestTips = getAllTips().slice(0, 3)
  const latestPosts = (await getAllPosts()).slice(0, 2)

  return (
    <>
      {/* Hero + About */}
      <section
        className="bg-gradient-to-b from-surface-raised to-surface border-b border-border relative overflow-hidden"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(200,90,58,0.06) 0%, transparent 70%), linear-gradient(to bottom, var(--surface-raised), var(--surface))',
        }}
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex flex-col gap-6 py-10 sm:py-16">
            <Hero />
            <AboutCard />
          </div>
        </div>
      </section>

      <section className="pt-12 sm:pt-16 pb-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-text-primary mb-8 font-display">Latest Posts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {latestPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover transition-colors"
            >
              View All Posts
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <section className="pt-12 sm:pt-16 pb-32">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-text-primary mb-8 font-display">Latest Tips</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {latestTips.map((tip) => (
              <TipCard key={tip.slug} tip={tip} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/tips"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover transition-colors"
            >
              View All Tips
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
