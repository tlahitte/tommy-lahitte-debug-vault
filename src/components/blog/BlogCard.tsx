import Link from 'next/link'
import Image from 'next/image'
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
    <Link
      href={`/blog/${post.slug}`}
      className="group block rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden hover:border-violet-700/60 hover:-translate-y-1 hover:shadow-[0_8px_30px_-6px_rgba(139,92,246,0.3)] transition-all duration-300 cursor-pointer"
    >
      <article>
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
          <div className="h-52 w-full bg-gradient-to-br from-violet-950 via-zinc-900 to-zinc-800 flex items-end p-5">
            <span className="text-xs font-medium uppercase tracking-widest text-violet-400">
              Current Work
            </span>
          </div>
        )}
        <div className="p-6">
          <time dateTime={post.date} className="text-xs text-zinc-500">
            {formattedDate}
          </time>
          <h2 className="mt-2 text-lg font-semibold text-zinc-100 group-hover:text-violet-400 transition-colors leading-snug">
            {post.title}
          </h2>
          <p className="mt-2 text-sm text-zinc-400 leading-relaxed line-clamp-3">{post.excerpt}</p>
          <div className="mt-4 flex items-center gap-4">
            <span className="text-sm text-violet-400 font-medium">Read more</span>
            {post.link && (
              <a
                href={post.link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {post.link.label} &rarr;
              </a>
            )}
          </div>
        </div>
      </article>
    </Link>
  )
}
