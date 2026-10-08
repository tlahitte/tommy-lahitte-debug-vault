import type { Metadata } from 'next'
import { getAllTips } from '@/lib/tips'
import TipsGrid from '@/components/tips/TipsGrid'
import PageBanner from '@/components/ui/PageBanner'

export const metadata: Metadata = {
  title: 'Unreal Tips',
  description:
    'Browse all Unreal Engine QA and debugging tips by Tommy Lahitte, covering the editor, debugging tools, and QA automation workflows.',
  alternates: {
    canonical: 'https://tommylahitte.com/tips/',
  },
  openGraph: {
    title: 'Unreal Tips | Tommy Lahitte',
    description:
      'Browse all Unreal Engine QA and debugging tips by Tommy Lahitte.',
    url: 'https://tommylahitte.com/tips/',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Unreal Tips -Tommy Lahitte' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Unreal Tips | Tommy Lahitte',
    description: 'Browse all Unreal Engine QA and debugging tips by Tommy Lahitte.',
    images: ['/og-image.png'],
  },
}

export default async function TipsPage() {
  const allTips = await getAllTips()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Unreal Tips',
            description: 'Browse all Unreal Engine QA and debugging tips by Tommy Lahitte.',
            url: 'https://tommylahitte.com/tips/',
            mainEntity: {
              '@type': 'ItemList',
              numberOfItems: allTips.length,
              itemListElement: allTips.map((tip, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                url: `https://tommylahitte.com/tips/${tip.slug}/`,
                name: tip.title,
              })),
            },
          }),
        }}
      />
      <PageBanner
        page="tips"
        title="Unreal Tips"
        subtitle={<>{allTips.length} tip{allTips.length !== 1 ? 's' : ''} on Unreal Engine QA &amp; debugging</>}
      />

      <div className="px-4 sm:px-6 pb-32 pt-8">
        <TipsGrid tips={allTips} />
      </div>
    </>
  )
}
