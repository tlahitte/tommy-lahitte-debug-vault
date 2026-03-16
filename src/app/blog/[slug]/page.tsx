import type { Metadata } from 'next'
import type React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllPosts, getPostBySlug } from '@/lib/blog'
import type { BlogBlock, RichTextItem } from '@/lib/blog-types'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
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

function renderRichText(items: RichTextItem[]) {
  return items.map((item, i) => {
    const { bold, italic, code, strikethrough, underline } = item.annotations
    const text = item.plain_text
    const href = item.href

    let node: React.ReactNode = text
    if (code) {
      node = <code key={i} className="font-mono text-sm bg-surface-raised px-1 rounded">{text}</code>
    } else {
      const classes = [
        bold ? 'font-semibold' : '',
        italic ? 'italic' : '',
        strikethrough ? 'line-through' : '',
        underline ? 'underline' : '',
      ].filter(Boolean).join(' ')
      node = classes ? <span key={i} className={classes}>{text}</span> : text
    }

    if (href) {
      return <a key={i} href={href} className="text-accent underline hover:text-accent-hover" target="_blank" rel="noopener noreferrer">{node}</a>
    }
    return node
  })
}

function renderBlock(block: BlogBlock, index: number): React.ReactNode {
  switch (block.type) {
    case 'paragraph':
      return (
        <p key={index} className="text-text-primary leading-relaxed">
          {renderRichText(block.richText)}
        </p>
      )
    case 'heading_1':
      return (
        <h2 key={index} className="text-3xl font-bold text-text-primary mt-10 mb-3">
          {renderRichText(block.richText)}
        </h2>
      )
    case 'heading_2':
      return (
        <h3 key={index} className="text-2xl font-semibold text-text-primary mt-8 mb-2">
          {renderRichText(block.richText)}
        </h3>
      )
    case 'heading_3':
      return (
        <h4 key={index} className="text-xl font-semibold text-text-primary mt-6 mb-2">
          {renderRichText(block.richText)}
        </h4>
      )
    case 'code':
      return (
        <pre key={index} className="bg-zinc-900 text-zinc-200 rounded-lg p-4 overflow-x-auto text-sm font-mono">
          <code>{renderRichText(block.richText)}</code>
        </pre>
      )
    case 'callout':
      return (
        <div key={index} className="flex gap-3 p-4 rounded-lg bg-surface-raised border border-border">
          {block.icon && <span className="shrink-0 text-xl">{block.icon}</span>}
          <p className="text-text-primary leading-relaxed">{renderRichText(block.richText)}</p>
        </div>
      )
    case 'bulleted_list_item':
      return (
        <li key={index} className="text-text-primary leading-relaxed list-disc ml-4">
          {renderRichText(block.richText)}
        </li>
      )
    case 'numbered_list_item':
      return (
        <li key={index} className="text-text-primary leading-relaxed list-decimal ml-4">
          {renderRichText(block.richText)}
        </li>
      )
    case 'image':
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <figure key={index} className="my-4">
          <img
            src={block.url}
            alt={block.caption.map((c) => c.plain_text).join('') || 'Article image'}
            className="w-full rounded-lg"
          />
          {block.caption.length > 0 && (
            <figcaption className="mt-2 text-sm text-text-muted text-center">
              {renderRichText(block.caption)}
            </figcaption>
          )}
        </figure>
      )
    case 'toggle':
      return (
        <details key={index} className="my-2 rounded-lg border border-border">
          <summary className="cursor-pointer px-4 py-3 text-text-primary font-medium select-none">
            {renderRichText(block.richText)}
          </summary>
          <div className="px-4 pb-4 space-y-2">
            {block.children.map((child, i) => renderBlock(child, i))}
          </div>
        </details>
      )
    case 'divider':
      return <hr key={index} className="border-t border-border my-6" />
    default:
      return null
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

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
        className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text-primary transition-colors mb-8"
      >
        &larr; Back to Blog
      </Link>

      <article>
        <header className="mb-8">
          <time dateTime={post.date} className="text-xs text-text-muted">
            {formattedDate}
          </time>
          <h1 className="mt-2 text-3xl font-bold text-text-primary leading-snug">{post.title}</h1>
          <p className="mt-3 text-text-muted leading-relaxed">{post.excerpt}</p>
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
          <div className="mt-10 pt-6 border-t border-border">
            <a
              href={post.link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors"
            >
              {post.link.label} &rarr;
            </a>
          </div>
        )}
      </article>
    </div>
  )
}
