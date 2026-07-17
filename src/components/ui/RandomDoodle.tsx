'use client'

import { useState, useEffect } from 'react'

const DOODLES = [
  'ballet', 'bikini', 'chilling', 'clumsy', 'coffee', 'dancing',
  'dog-jump', 'doggie', 'float', 'groovy', 'ice-cream', 'jumping',
  'laying', 'levitate', 'loving', 'meditating', 'moshing', 'petting',
  'plant', 'reading-side', 'reading', 'roller-skating', 'rolling',
  'running', 'selfie', 'sitting-reading', 'sitting', 'sleek',
  'sprinting', 'strolling', 'swinging', 'unboxing', 'zombieing',
]

// A random OpenDoodle tinted with the site accent so it matches the rest of
// the UI (and follows palette changes) rather than a fixed colour. The doodle
// SVG is used as a CSS mask over an accent-coloured box.
export default function RandomDoodle() {
  const [doodle, setDoodle] = useState<string | null>(null)

  useEffect(() => {
    setDoodle(DOODLES[Math.floor(Math.random() * DOODLES.length)])
  }, [])

  if (!doodle) return null

  const url = `/illustrations/opendoodles/${doodle}.svg`

  return (
    <div
      aria-hidden="true"
      className="h-full w-full"
      style={{
        backgroundColor: 'var(--accent)',
        opacity: 0.85,
        WebkitMaskImage: `url(${url})`,
        maskImage: `url(${url})`,
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center bottom',
        maskPosition: 'center bottom',
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
      }}
    />
  )
}
