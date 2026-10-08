import type { Metadata } from 'next'
import { portfolioVideos, getEmbedUrl, getThumbnailUrl } from '@/lib/portfolio'
import PortfolioGrid from '@/components/portfolio/PortfolioGrid'
import PageBanner from '@/components/ui/PageBanner'

export const metadata: Metadata = {
  title: 'Portfolio',
  description:
    'A selection of videos made by Tommy Lahitte, spanning live stages, virtual production, films and experiments.',
  alternates: {
    canonical: 'https://tommylahitte.com/portfolio/',
  },
  openGraph: {
    title: 'Portfolio | Tommy Lahitte',
    description:
      'A selection of videos made by Tommy Lahitte. Live stages, virtual production, films and experiments.',
    url: 'https://tommylahitte.com/portfolio/',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Portfolio - Tommy Lahitte' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfolio | Tommy Lahitte',
    description: 'A selection of videos made by Tommy Lahitte.',
    images: ['/og-image.png'],
  },
}

export default function PortfolioPage() {
  const videos = portfolioVideos

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Portfolio',
            description:
              'A selection of videos made by Tommy Lahitte. Live stages, virtual production, films and experiments.',
            url: 'https://tommylahitte.com/portfolio/',
            mainEntity: {
              '@type': 'ItemList',
              numberOfItems: videos.length,
              itemListElement: videos.map((video, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                item: {
                  '@type': 'VideoObject',
                  name: video.title,
                  ...(video.description || video.subtitle
                    ? { description: video.description || video.subtitle }
                    : {}),
                  thumbnailUrl: new URL(getThumbnailUrl(video), 'https://tommylahitte.com').href,
                  embedUrl: getEmbedUrl(video),
                  ...(video.year ? { uploadDate: `${video.year}-01-01` } : {}),
                },
              })),
            },
          }),
        }}
      />

      <PageBanner

        page="portfolio"

        title="Portfolio"

        subtitle="Live stages, projections, and things that only happen once."

      />

      <div className="px-4 sm:px-6 pb-32 pt-8">
        <PortfolioGrid videos={videos} />
      </div>
    </>
  )
}
