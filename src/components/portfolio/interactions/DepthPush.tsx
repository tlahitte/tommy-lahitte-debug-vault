'use client'

import { motion } from 'motion/react'
import Shell from './Shell'
import { Poster, Eyebrow, TitleText, MetaLine, Body, EASE, type VariantProps } from './parts'

// Depth-push: the poster scales back, blurs and dims while the copy scales up
// from behind — the description feels like it steps forward.
export default function DepthPush({ video, onOpen }: VariantProps) {
  return (
    <Shell video={video} onOpen={onOpen}>
      <motion.div
        className="absolute inset-0"
        variants={{
          rest: { scale: 1, filter: 'blur(0px) brightness(1)' },
          hover: { scale: 0.92, filter: 'blur(4px) brightness(0.5)' },
        }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <Poster video={video} />
      </motion.div>

      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        variants={{ rest: { opacity: 0, scale: 0.96 }, hover: { opacity: 1, scale: 1 } }}
        transition={{ duration: 0.45, ease: EASE, delay: 0.05 }}
      >
        <Eyebrow video={video} className="mb-2 justify-center" />
        <TitleText video={video} className="text-lg" />
        <MetaLine video={video} className="mt-1" />
        <Body video={video} className="mx-auto mt-2 max-w-xs" />
      </motion.div>
    </Shell>
  )
}
