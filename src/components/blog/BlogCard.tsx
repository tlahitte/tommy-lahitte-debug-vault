'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'motion/react'
import type { BlogPost } from '@/lib/blog-types'

interface BlogCardProps {
  post: BlogPost
}

export default function BlogCard({ post }: BlogCardProps) {
  const formattedDate = new Date(post.date).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <motion.article
        className="rounded-xl border border-border bg-surface-raised overflow-hidden cursor-pointer"
        whileHover={{ y: -2, boxShadow: '0 8px 24px -4px rgba(200, 90, 58, 0.12)' }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        {post.image ? (
          <div className="relative h-52 w-full">
            <Image
              src={post.image}
              alt={post.imageAlt ?? post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        ) : (
          <div className="h-52 w-full bg-gradient-to-br from-surface-raised via-surface to-surface flex items-end p-5">
            <span className="text-xs font-medium uppercase tracking-widest text-text-muted">
              Current Work
            </span>
          </div>
        )}
        <div className="p-6">
          <time dateTime={post.date} className="text-xs text-text-muted">
            {formattedDate}
          </time>
          <h2 className="mt-2 text-lg font-semibold text-text-primary group-hover:text-accent transition-colors leading-snug">
            {post.title}
          </h2>
          <p className="mt-2 text-sm text-text-muted leading-relaxed line-clamp-3">{post.excerpt}</p>
          <div className="mt-4 flex items-center gap-4">
            <span className="text-sm text-accent font-medium">Read more</span>
            {post.link && (
              <a
                href={post.link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-sm text-text-muted hover:text-text-primary transition-colors"
              >
                {post.link.label} &rarr;
              </a>
            )}
          </div>
        </div>
      </motion.article>
    </Link>
  )
}
