import type { Metadata } from 'next'
import { getAllTips } from '@/lib/tips'
import TipsGrid from '@/components/tips/TipsGrid'
import RandomDoodle from '@/components/ui/RandomDoodle'

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
      {/* Page header -kraft visual identity with blueprint illustration */}
      <section className="relative overflow-hidden bg-surface-raised border-b border-border hero-texture">
        <div
          className="absolute top-0 inset-x-0 h-96 z-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(200,90,58,0.06) 0%, transparent 70%)',
          }}
        />
        <div className="relative z-10 px-4 sm:px-6 pt-8 sm:pt-12 pb-16">
          <h1 className="text-3xl font-bold text-text-primary mb-2 font-display">Unreal Tips</h1>
          <p className="text-text-muted">
            {allTips.length} tip{allTips.length !== 1 ? 's' : ''} on Unreal Engine QA &amp;
            debugging
          </p>
        </div>
        {/* Random doodle -right-aligned within content area, contained in banner */}
        <div className="absolute left-1/2 -translate-x-1/2 w-full px-4 sm:px-6 bottom-0 pointer-events-none select-none hidden sm:block">
          <div className="ml-auto opacity-100" style={{ width: 'clamp(10rem, 15vw, 16rem)', height: 'clamp(10rem, 15vw, 16rem)' }}>
            <RandomDoodle />
          </div>
        </div>
      </section>

      <div className="px-4 sm:px-6 pb-32 pt-8">
        <TipsGrid tips={allTips} />
      </div>
    </>
  )
}
