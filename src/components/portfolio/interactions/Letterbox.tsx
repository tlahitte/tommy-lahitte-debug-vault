'use client'

import { motion } from 'motion/react'
import Shell from './Shell'
import { Poster, Eyebrow, TitleText, MetaLine, Body, EASE, type VariantProps } from './parts'

// Letterbox: cinematic bars ease in from top and bottom, the poster gently
// desaturates, and the copy fades into the lower bar. Best on featured cards.
export default function Letterbox({ video, onOpen }: VariantProps) {
  return (
    <Shell video={video} onOpen={onOpen}>
      <motion.div
        className="absolute inset-0"
        variants={{
          rest: { filter: 'saturate(1) brightness(1)' },
          hover: { filter: 'saturate(0.55) brightness(0.85)' },
        }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <Poster video={video} />
      </motion.div>

      {/* Top bar */}
      <motion.div
        className="absolute inset-x-0 top-0 bg-[#0E0E10]"
        variants={{ rest: { height: '0%' }, hover: { height: '14%' } }}
        transition={{ duration: 0.45, ease: EASE }}
      />

      {/* Bottom bar with copy */}
      <motion.div
        className="absolute inset-x-0 bottom-0 flex flex-col justify-center overflow-hidden bg-[#0E0E10] px-5"
        variants={{ rest: { height: '0%' }, hover: { height: '52%' } }}
        transition={{ duration: 0.45, ease: EASE }}
      >
        <motion.div
          variants={{ rest: { opacity: 0, y: 8 }, hover: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.4, ease: EASE, delay: 0.12 }}
        >
          <Eyebrow video={video} className="mb-1" />
          <TitleText video={video} className="text-base sm:text-lg" />
          <MetaLine video={video} className="mt-1" />
          <Body video={video} className="mt-1.5 text-xs leading-snug" />
        </motion.div>
      </motion.div>
    </Shell>
  )
}
