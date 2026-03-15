// PHASE 5: DONE
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAllTips, getTipBySlug } from '@/lib/tips'
import TipDetail from '@/components/tips/TipDetail'

interface TipPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const tips = getAllTips()
  return tips.map((tip) => ({ slug: tip.slug }))
}

export async function generateMetadata({ params }: TipPageProps): Promise<Metadata> {
  const { slug } = await params
  const tip = getTipBySlug(slug)
  if (!tip) return {}

  const canonicalUrl = `https://tommylahitte.com/tips/${tip.slug}/`

  return {
    title: tip.title,
    description: tip.summary,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${tip.title} | Tommy Lahitte Debug Vault`,
      description: tip.summary,
      url: canonicalUrl,
      type: 'article',
      publishedTime: tip.publishedAt,
      authors: ['Tommy Lahitte'],
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: tip.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${tip.title} | Tommy Lahitte Debug Vault`,
      description: tip.summary,
      images: ['/og-image.png'],
    },
  }
}

export default async function TipPage({ params }: TipPageProps) {
  const { slug } = await params
  const tip = getTipBySlug(slug)
  if (!tip) notFound()

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: tip.title,
    description: tip.summary,
    author: {
      '@type': 'Person',
      name: 'Tommy Lahitte',
      url: 'https://tommylahitte.com/',
    },
    datePublished: tip.publishedAt,
    keywords: tip.tags.join(', '),
    url: `https://tommylahitte.com/tips/${tip.slug}/`,
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <nav className="mb-8">
        <Link
          href="/tips/"
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-accent transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to all tips
        </Link>
      </nav>
      <TipDetail tip={tip} />
    </div>
  )
}
