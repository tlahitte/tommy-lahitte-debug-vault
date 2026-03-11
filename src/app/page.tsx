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

export default function HomePage() {
  const latestTips = getAllTips().slice(0, 3)
  const latestPosts = getAllPosts().slice(0, 2)

  return (
    <>
      {/* Hero + About — combined section so the photo spans both */}
      <section className="relative overflow-hidden bg-[#1c1535] -mt-14">
        {/* Top highlight — vibrant purple radial glow fading into the section background */}
        <div
          className="absolute top-0 inset-x-0 h-96 z-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(167,139,250,0.35) 0%, rgba(139,92,246,0.12) 45%, transparent 75%)',
          }}
        />

        {/* Bottom fade into page background — multi-stop eased gradient for a smooth transition */}
        <div
          className="absolute bottom-0 inset-x-0 h-48 z-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(9,9,11,0) 0%, rgba(9,9,11,0.04) 15%, rgba(9,9,11,0.15) 30%, rgba(9,9,11,0.35) 45%, rgba(9,9,11,0.60) 60%, rgba(9,9,11,0.82) 75%, rgba(9,9,11,0.96) 90%, #09090b 100%)',
          }}
        />

        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex flex-col gap-6 pt-[5.5rem] sm:pt-[6.5rem] pb-10 sm:pb-16">
            <Hero />
            <AboutCard />
          </div>
        </div>
      </section>

      <section className="pb-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-zinc-100 mb-8 font-display">Latest Posts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {latestPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors"
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

      <section className="pb-32">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-zinc-100 mb-8 font-display">Latest Tips</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {latestTips.map((tip) => (
              <TipCard key={tip.slug} tip={tip} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/tips"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors"
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
