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
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-zinc-100 mb-2">All Tips</h1>
        <p className="text-zinc-400">
          {allTips.length} tip{allTips.length !== 1 ? 's' : ''} on Unreal Engine QA &amp;
          debugging
        </p>
      </div>
      <TipsGrid tips={allTips} />
    </div>
  )
}
