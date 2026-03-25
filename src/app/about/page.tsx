import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About | Tommy Lahitte',
  description: 'Tommy Lahitte, maker and tinkerer who bridges art and technology.',
  alternates: {
    canonical: 'https://tommylahitte.com/',
  },
}

export default function AboutPage() {
  redirect('/')
}
