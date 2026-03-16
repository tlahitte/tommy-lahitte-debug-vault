'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

const DOODLES = [
  'ballet', 'bikini', 'chilling', 'clumsy', 'coffee', 'dancing',
  'dog-jump', 'doggie', 'float', 'groovy', 'ice-cream', 'jumping',
  'laying', 'levitate', 'loving', 'meditating', 'moshing', 'petting',
  'plant', 'reading-side', 'reading', 'roller-skating', 'rolling',
  'running', 'selfie', 'sitting-reading', 'sitting', 'sleek',
  'sprinting', 'strolling', 'swinging', 'unboxing', 'zombieing',
]

export default function RandomDoodle() {
  const [doodle, setDoodle] = useState<string | null>(null)

  useEffect(() => {
    setDoodle(DOODLES[Math.floor(Math.random() * DOODLES.length)])
  }, [])

  if (!doodle) return null

  return (
    <Image
      src={`/illustrations/opendoodles/${doodle}.svg`}
      alt=""
      width={200}
      height={200}
      className="w-full h-full object-contain object-bottom"
      style={{
        filter: 'sepia(1) saturate(3) hue-rotate(346deg) brightness(0.7)',
      }}
      aria-hidden="true"
      priority={false}
    />
  )
}
