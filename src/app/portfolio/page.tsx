import type { Metadata } from 'next'
import { portfolioVideos, getEmbedUrl, getThumbnailUrl } from '@/lib/portfolio'
import PortfolioGrid from '@/components/portfolio/PortfolioGrid'
import RandomDoodle from '@/components/ui/RandomDoodle'

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
                  thumbnailUrl: getThumbnailUrl(video),
                  embedUrl: getEmbedUrl(video),
                  ...(video.year ? { uploadDate: `${video.year}-01-01` } : {}),
                },
              })),
            },
          }),
        }}
      />

      {/* Page header — matches the visual identity of /tips */}
      <section className="relative overflow-hidden bg-surface-raised border-b border-border hero-texture">
        <div
          className="absolute top-0 inset-x-0 h-96 z-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 0%, color-mix(in srgb, var(--accent) 7%, transparent) 0%, transparent 70%)',
          }}
        />
        <div className="relative z-10 px-4 sm:px-6 pt-8 sm:pt-12 pb-16">
          <h1 className="text-3xl font-bold text-text-primary mb-2 font-display">Portfolio</h1>
          <p className="text-text-muted">
            Live stages, projections, and things that only happen once.
          </p>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 w-full px-4 sm:px-6 bottom-0 pointer-events-none select-none hidden sm:block">
          <div className="ml-auto opacity-100" style={{ width: 'clamp(10rem, 15vw, 16rem)', height: 'clamp(10rem, 15vw, 16rem)' }}>
            <RandomDoodle />
          </div>
        </div>
      </section>

      <div className="px-4 sm:px-6 pb-32 pt-8">
        <PortfolioGrid videos={videos} />
      </div>
    </>
  )
}
