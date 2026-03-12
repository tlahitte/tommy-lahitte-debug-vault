import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllPosts, getPostBySlug } from '@/lib/blog'
import type { BlogBlock } from '@/lib/blog-types'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}

  const ogImage = post.image ?? '/og-image.png'

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `https://tommylahitte.com/blog/${post.slug}/`,
    },
    openGraph: {
      title: `${post.title} | Tommy Lahitte`,
      description: post.excerpt,
      url: `https://tommylahitte.com/blog/${post.slug}/`,
      type: 'article',
      publishedTime: post.date,
      authors: ['Tommy Lahitte'],
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.imageAlt ?? post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} | Tommy Lahitte`,
      description: post.excerpt,
      images: [ogImage],
    },
  }
}

function renderBlock(block: BlogBlock, index: number) {
  switch (block.type) {
    case 'paragraph':
      return (
        <p key={index} className="text-zinc-300 leading-relaxed">
          {block.text}
        </p>
      )
    case 'heading':
      return (
        <h2 key={index} className="text-xl font-semibold text-zinc-100 mt-8 mb-2">
          {block.text}
        </h2>
      )
    case 'list':
      return (
        <ul key={index} className="list-disc list-inside space-y-1 text-zinc-300">
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const formattedDate = new Date(post.date).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    url: `https://tommylahitte.com/blog/${post.slug}/`,
    datePublished: post.date,
    author: {
      '@type': 'Person',
      name: 'Tommy Lahitte',
      url: 'https://tommylahitte.com/',
    },
    publisher: {
      '@type': 'Person',
      name: 'Tommy Lahitte',
      url: 'https://tommylahitte.com/',
    },
    ...(post.image && { image: post.image }),
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Link
        href="/blog"
        className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-8"
      >
        &larr; Back to Blog
      </Link>

      <article>
        <header className="mb-8">
          <time dateTime={post.date} className="text-xs text-zinc-500">
            {formattedDate}
          </time>
          <h1 className="mt-2 text-3xl font-bold text-zinc-100 leading-snug">{post.title}</h1>
          <p className="mt-3 text-zinc-400 leading-relaxed">{post.excerpt}</p>
        </header>

        {post.image && (
          <div className="mb-8 rounded-xl overflow-hidden">
            <Image
              src={post.image}
              alt={post.imageAlt ?? post.title}
              width={1200}
              height={670}
              className="w-full h-auto"
              priority
            />
          </div>
        )}

        <div className="space-y-4">
          {post.content.map((block, index) => renderBlock(block, index))}
        </div>

        {post.link && (
          <div className="mt-10 pt-6 border-t border-zinc-800">
            <a
              href={post.link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors"
            >
              {post.link.label} &rarr;
            </a>
          </div>
        )}
      </article>
    </div>
  )
}
