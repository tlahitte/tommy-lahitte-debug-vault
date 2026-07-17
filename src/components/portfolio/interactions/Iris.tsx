'use client'

import { motion } from 'motion/react'
import Shell from './Shell'
import { Poster, Eyebrow, TitleText, MetaLine, Body, EASE, type VariantProps } from './parts'

// Iris: a dark overlay opens from the centre via an expanding circular
// clip-path, and the copy fades in centred. Best on featured cards.
export default function Iris({ video, onOpen }: VariantProps) {
  return (
    <Shell video={video} onOpen={onOpen}>
      <Poster video={video} />

      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center"
        style={{ backgroundColor: 'rgba(14,14,16,0.95)' }}
        variants={{
          rest: { clipPath: 'circle(0% at 50% 50%)' },
          hover: { clipPath: 'circle(75% at 50% 50%)' },
        }}
        transition={{ duration: 0.55, ease: EASE }}
      >
        <motion.div
          variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }}
          transition={{ duration: 0.4, ease: EASE, delay: 0.15 }}
        >
          <Eyebrow video={video} className="mb-2 justify-center" />
          <TitleText video={video} className="text-2xl" />
          <MetaLine video={video} className="mt-1.5" />
          <Body video={video} className="mx-auto mt-2 max-w-md" />
        </motion.div>
      </motion.div>
    </Shell>
  )
}
