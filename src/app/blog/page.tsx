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
      {/* Page header — kraft visual identity */}
      <section className="relative overflow-hidden bg-surface-raised border-b border-border -mt-14">
        <div
          className="absolute top-0 inset-x-0 h-96 z-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(200,90,58,0.06) 0%, transparent 70%)',
          }}
        />
        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 pt-[5.5rem] sm:pt-[6.5rem] pb-16">
          <h1 className="text-3xl font-bold text-text-primary mb-2 font-display">Blog</h1>
          <p className="text-text-muted">Things I am currently working on.</p>
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
