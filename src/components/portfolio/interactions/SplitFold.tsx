'use client'

import { motion } from 'motion/react'
import Shell from './Shell'
import { Poster, Eyebrow, TitleText, MetaLine, Body, EASE, type VariantProps } from './parts'

// Split-fold: the poster eases from full width down to ~58%, revealing a dark
// info panel that sits beneath it on the right. Best on full-width featured cards.
export default function SplitFold({ video, onOpen }: VariantProps) {
  return (
    <Shell video={video} onOpen={onOpen}>
      {/* Info panel revealed as the poster narrows */}
      <div className="absolute inset-y-0 right-0 z-0 flex w-[42%] flex-col justify-center bg-[#141416] p-5">
        <motion.div
          variants={{ rest: { opacity: 0, x: 12 }, hover: { opacity: 1, x: 0 } }}
          transition={{ duration: 0.4, ease: EASE, delay: 0.05 }}
        >
          <Eyebrow video={video} className="mb-2" />
          <TitleText video={video} className="text-lg" />
          <MetaLine video={video} className="mt-1" />
          <Body video={video} className="mt-2" />
        </motion.div>
      </div>

      {/* Poster (narrows on hover) */}
      <motion.div
        className="absolute inset-y-0 left-0 z-10 overflow-hidden"
        variants={{ rest: { width: '100%' }, hover: { width: '58%' } }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <Poster video={video} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <Eyebrow video={video} className="mb-1" />
          <TitleText video={video} className="text-xl" />
        </div>
      </motion.div>
    </Shell>
  )
}
