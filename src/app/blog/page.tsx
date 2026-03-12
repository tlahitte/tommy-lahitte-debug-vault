import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/blog'
import BlogCard from '@/components/blog/BlogCard'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'What Tommy Lahitte is currently working on, from stage tech to game QA.',
  alternates: {
    canonical: 'https://tommylahitte.com/blog/',
  },
  openGraph: {
    title: 'Blog | Tommy Lahitte',
    description: 'What Tommy Lahitte is currently working on, from stage tech to game QA.',
    url: 'https://tommylahitte.com/blog/',
    type: 'website',
  },
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <>
      {/* Page header — matches Home hero section background */}
      <section className="relative overflow-hidden bg-[#1c1535] -mt-14">
        <div
          className="absolute top-0 inset-x-0 h-96 z-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(167,139,250,0.35) 0%, rgba(139,92,246,0.12) 45%, transparent 75%)',
          }}
        />
        <div
          className="absolute bottom-0 inset-x-0 h-48 z-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(9,9,11,0) 0%, rgba(9,9,11,0.04) 15%, rgba(9,9,11,0.15) 30%, rgba(9,9,11,0.35) 45%, rgba(9,9,11,0.60) 60%, rgba(9,9,11,0.82) 75%, rgba(9,9,11,0.96) 90%, #09090b 100%)',
          }}
        />
        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 pt-[5.5rem] sm:pt-[6.5rem] pb-16">
          <h1 className="text-3xl font-bold text-zinc-100 mb-2 font-display">Blog</h1>
          <p className="text-zinc-400">Things I am currently working on.</p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 pb-32">
        <div className="grid gap-6 sm:grid-cols-2">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </>
  )
}
