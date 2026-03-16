// PHASE 4: DONE
import type { Metadata } from 'next'
import { getAllTips } from '@/lib/tips'
import TipsGrid from '@/components/tips/TipsGrid'

export const metadata: Metadata = {
  title: 'Unreal Tips',
  description:
    'Browse all Unreal Engine QA and debugging tips by Tommy Lahitte, covering the editor, debugging tools, and QA automation workflows.',
  alternates: {
    canonical: 'https://tommylahitte.com/tips/',
  },
  openGraph: {
    title: 'Unreal Tips | Tommy Lahitte Debug Vault',
    description:
      'Browse all Unreal Engine QA and debugging tips by Tommy Lahitte.',
    url: 'https://tommylahitte.com/tips/',
    type: 'website',
  },
}

export default function TipsPage() {
  const allTips = getAllTips()

  return (
    <>
      {/* Page header — kraft visual identity */}
      <section className="relative overflow-hidden bg-surface-raised border-b border-border -mt-14">
        <div
          className="absolute top-0 inset-x-0 h-96 z-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(200,90,58,0.06) 0%, transparent 70%)',
          }}
        />
        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 pt-[5.5rem] sm:pt-[6.5rem] pb-16">
          <h1 className="text-3xl font-bold text-text-primary mb-2 font-display">Unreal Tips</h1>
          <p className="text-text-muted">
            {allTips.length} tip{allTips.length !== 1 ? 's' : ''} on Unreal Engine QA &amp;
            debugging
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 pb-32 pt-8">
        <TipsGrid tips={allTips} />
      </div>
    </>
  )
}
