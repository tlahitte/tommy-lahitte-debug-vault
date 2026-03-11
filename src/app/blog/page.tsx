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
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-zinc-100 mb-2">Blog</h1>
        <p className="text-zinc-400">Things I am currently working on.</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  )
}
