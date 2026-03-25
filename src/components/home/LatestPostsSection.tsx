'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { useHydrated } from '@/hooks/useHydrated'
import type { BlogPost } from '@/lib/blog-types'
import BlogCard from '@/components/blog/BlogCard'

interface Props {
  posts: BlogPost[]
}

export default function LatestPostsSection({ posts }: Props) {
  const hydrated = useHydrated()
  if (posts.length === 0) return null

  return (
    <div className="rounded-2xl border border-border bg-surface-raised p-6 sm:p-8 card-elevated">
      {/* Header */}
      <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-medium tracking-widest text-text-muted uppercase mb-3">
            Journal
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary font-display">
            Latest posts.
          </h2>
        </div>
        <Link
          href="/blog"
          className="shrink-0 text-sm font-medium text-accent hover:text-accent-hover flex items-center gap-1.5 transition-colors pb-1"
        >
          See all
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Posts */}
      <div className="flex flex-col gap-4">
        {posts.map((post, i) => (
          <motion.div
            key={post.slug}
            initial={hydrated ? { opacity: 0, y: 14 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
          >
            <BlogCard post={post} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
