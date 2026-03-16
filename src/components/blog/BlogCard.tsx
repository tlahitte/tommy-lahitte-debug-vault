'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'motion/react'
import { useMemo } from 'react'
import type { BlogPost } from '@/lib/blog-types'

const DOODLES = [
  'ballet', 'chilling', 'coffee', 'dancing', 'float', 'groovy',
  'ice-cream', 'laying', 'levitate', 'meditating', 'reading-side',
  'reading', 'sitting-reading', 'sitting', 'unboxing',
]

interface BlogCardProps {
  post: BlogPost
}

export default function BlogCard({ post }: BlogCardProps) {
  const placeholderDoodle = useMemo(
    () => DOODLES[Math.abs(post.slug.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % DOODLES.length],
    [post.slug]
  )

  const formattedDate = new Date(post.date).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <motion.article
      className="group relative rounded-xl border border-border bg-surface-raised overflow-hidden cursor-pointer card-elevated"
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
        <div className="h-52 w-full bg-gradient-to-br from-surface-raised via-surface to-surface flex items-center justify-center p-5">
          <Image
            src={`/illustrations/opendoodles/${placeholderDoodle}.svg`}
            alt=""
            width={160}
            height={160}
            className="h-36 w-auto object-contain opacity-60"
            style={{ filter: 'sepia(1) saturate(3) hue-rotate(346deg) brightness(0.7)' }}
            aria-hidden="true"
          />
        </div>
      )}
      <div className="p-6">
        <time dateTime={post.date} className="text-xs text-text-muted">
          {formattedDate}
        </time>
        <h2 className="mt-2 text-lg font-semibold text-text-primary group-hover:text-accent transition-colors leading-snug">
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">
            {post.title}
          </Link>
        </h2>
        <p className="mt-2 text-sm text-text-muted leading-relaxed line-clamp-3">{post.excerpt}</p>
        <div className="mt-4 flex items-center gap-4">
          <span className="text-sm text-accent font-medium">Read more</span>
          {post.link && (
            <a
              href={post.link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 text-sm text-text-muted hover:text-text-primary transition-colors"
            >
              {post.link.label} &rarr;
            </a>
          )}
        </div>
      </div>
    </motion.article>
  )
}
