// PHASE 4: DONE
import type { Metadata } from 'next'
import { getAllTips } from '@/lib/tips'
import TipsGrid from '@/components/tips/TipsGrid'

export const metadata: Metadata = {
  title: 'All Tips',
  description:
    'Browse all Unreal Engine QA and debugging tips by Tommy Lahitte, covering the editor, debugging tools, and QA automation workflows.',
  alternates: {
    canonical: 'https://tommylahitte.com/tips/',
  },
  openGraph: {
    title: 'All Tips | Tommy Lahitte Debug Vault',
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
      {/* Page header — matches Home hero section background */}
      <section className="relative overflow-hidden bg-[#1c1535] -mt-14">
        <div
          className="absolute top-0 inset-x-0 h-96 z-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(167,139,250,0.35) 0%, rgba(139,92,246,0.12) 45%, transparent 75%)',
          }}
        />
        <div
          className="absolute bottom-0 inset-x-0 h-48 z-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(9,9,11,0) 0%, rgba(9,9,11,0.04) 15%, rgba(9,9,11,0.15) 30%, rgba(9,9,11,0.35) 45%, rgba(9,9,11,0.60) 60%, rgba(9,9,11,0.82) 75%, rgba(9,9,11,0.96) 90%, #09090b 100%)',
          }}
        />
        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 pt-[5.5rem] sm:pt-[6.5rem] pb-16">
          <h1 className="text-3xl font-bold text-zinc-100 mb-2 font-display">All Tips</h1>
          <p className="text-zinc-400">
            {allTips.length} tip{allTips.length !== 1 ? 's' : ''} on Unreal Engine QA &amp;
            debugging
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 pb-32">
        <TipsGrid tips={allTips} />
      </div>
    </>
  )
}
