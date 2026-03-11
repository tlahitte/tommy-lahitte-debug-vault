// PHASE 3: DONE
import type { Metadata } from 'next'
import Hero from '@/components/home/Hero'
import AboutCard from '@/components/home/AboutCard'

export const metadata: Metadata = {
  title: 'Tommy Lahitte | QA Engineer & Unreal Debug Vault',
  description:
    'QA and debugging field notes for Unreal Engine by Tommy Lahitte, QA Engineer at Epic Games. Tips on the Visual Logger, functional testing, log filtering, and more.',
  alternates: {
    canonical: 'https://tommy-lahitte-debug-vault.netlify.app/',
  },
  openGraph: {
    title: 'Tommy Lahitte | QA Engineer & Unreal Debug Vault',
    description:
      'QA and debugging field notes for Unreal Engine by Tommy Lahitte, QA Engineer at Epic Games.',
    url: 'https://tommy-lahitte-debug-vault.netlify.app/',
    type: 'website',
  },
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutCard />
    </>
  )
}
