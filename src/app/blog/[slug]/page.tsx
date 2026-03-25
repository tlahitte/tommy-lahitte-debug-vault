import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllPosts, getPostBySlug } from '@/lib/blog'
import { renderBlock } from '@/components/blog/NotionBlock'
import { ReadingProgressBar } from '@/components/blog/ReadingProgressBar'
import StatusBadge from '@/components/blog/StatusBadge'
import ProjectGallery from '@/components/blog/ProjectGallery'

export const dynamicParams = false

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

  const wordCount = post.content.reduce((acc, block) => {
    if ('richText' in block) {
      return acc + block.richText.reduce((a, r) => a + r.plain_text.split(' ').length, 0)
    }
    return acc
  }, 0)
  const readingTime = Math.max(1, Math.ceil(wordCount / 200))

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    url: `https://tommylahitte.com/blog/${post.slug}/`,
    datePublished: post.date,
    dateModified: post.date,
    wordCount,
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
    image: post.image ?? 'https://tommylahitte.com/og-image.png',
    inLanguage: 'en',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://tommylahitte.com/blog/${post.slug}/`,
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://tommylahitte.com/' },
      { '@type': 'ListItem', position: 2, name: 'Journal', item: 'https://tommylahitte.com/blog/' },
      { '@type': 'ListItem', position: 3, name: post.title },
    ],
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
      <ReadingProgressBar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([articleSchema, breadcrumbSchema]) }}
      />
      <Link
        href="/blog/"
        className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text-primary transition-colors mb-8"
      >
        &larr; Back to Journal
      </Link>

      <article>
        <header className="mb-10">
          {post.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.image}
              alt={post.imageAlt ?? post.title}
              className="w-full rounded-xl aspect-[16/7] object-cover mb-8"
            />
          )}
          <h1 className="text-4xl font-bold text-text-primary leading-tight mb-3">
            {post.title}
          </h1>
          <div className="flex items-center gap-3 text-sm text-text-muted">
            <time dateTime={post.date}>{formattedDate}</time>
            <span aria-hidden="true">&middot;</span>
            <span>{readingTime} min read</span>
            {post.category === 'Project' && post.status && (
              <>
                <span aria-hidden="true">&middot;</span>
                <StatusBadge status={post.status} />
              </>
            )}
          </div>
        </header>

        {/* Photo gallery — only for Project category with gallery images */}
        {post.category === 'Project' && post.gallery && post.gallery.length > 0 && (
          <ProjectGallery images={post.gallery} />
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
