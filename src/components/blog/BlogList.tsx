'use client'

import { useSearchParams } from 'next/navigation'
import type { BlogPost } from '@/lib/blog-types'
import BlogCategoryFilter from './BlogCategoryFilter'

const DOODLES = [
  'ballet', 'chilling', 'coffee', 'dancing', 'float', 'groovy',
  'ice-cream', 'laying', 'levitate', 'meditating', 'reading-side',
  'reading', 'sitting-reading', 'sitting', 'unboxing',
]

function getDoodle(slug: string) {
  return DOODLES[Math.abs(slug.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % DOODLES.length]
}

interface BlogListProps {
  posts: BlogPost[]
}

export default function BlogList({ posts }: BlogListProps) {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category')

  const filtered = categoryParam
    ? posts.filter((p) => p.category === categoryParam)
    : posts

  return (
    <>
      <BlogCategoryFilter />

      {filtered.length === 0 ? (
        <p className="text-text-muted text-center py-16">No entries found for this category.</p>
      ) : (
        <div className="divide-y divide-border flex flex-col">
          {filtered.map((post) => (
            <article key={post.slug} className="py-8 first:pt-0">
              <a href={`/blog/${post.slug}`} className="group block">
                {/* Project cards: bigger cover image (aspect-[16/9]) */}
                {/* Article/Recommendation cards: compact cover (aspect-[16/6]) */}
                {post.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.image}
                    alt={post.imageAlt ?? post.title}
                    className={`w-full rounded-lg mb-4 object-cover ${
                      post.category === 'Project'
                        ? 'aspect-[16/9]'
                        : 'aspect-[16/6]'
                    }`}
                  />
                ) : (
                  <div className="w-full rounded-lg mb-4 aspect-[16/6] bg-gradient-to-br from-surface-raised via-surface to-surface flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/illustrations/opendoodles/${getDoodle(post.slug)}.svg`}
                      alt=""
                      className="h-24 w-auto object-contain opacity-60"
                      style={{ filter: 'sepia(1) saturate(3) hue-rotate(346deg) brightness(0.7)' }}
                      aria-hidden="true"
                    />
                  </div>
                )}
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm text-text-muted">{post.date}</p>
                  {post.category && (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                      {post.category}
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-semibold text-text-primary group-hover:text-accent transition-colors mb-2">
                  {post.title}
                </h2>
                <p className="text-base text-text-muted leading-relaxed">{post.excerpt}</p>
                {post.link && (
                  <span className="inline-block mt-3 text-sm text-accent underline">
                    {post.link.label}
                  </span>
                )}
              </a>
            </article>
          ))}
        </div>
      )}
    </>
  )
}
