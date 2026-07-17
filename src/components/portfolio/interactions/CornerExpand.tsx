'use client'

import { motion } from 'motion/react'
import Shell from './Shell'
import { Poster, Eyebrow, TitleText, MetaLine, Body, EASE, type VariantProps } from './parts'

// Corner-expand: a small "+" chip in the bottom-left grows out of its corner
// into a full description panel. The chip signals that there's more to see.
export default function CornerExpand({ video, onOpen }: VariantProps) {
  return (
    <Shell video={video} onOpen={onOpen}>
      <Poster video={video} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

      <motion.div
        className="absolute bottom-3 left-3 overflow-hidden rounded-lg bg-[#0E0E10]"
        variants={{
          rest: { width: '2.5rem', height: '2.5rem' },
          hover: { width: '86%', height: '82%' },
        }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        {/* Chip glyph (rest) */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          variants={{ rest: { opacity: 1 }, hover: { opacity: 0 } }}
          transition={{ duration: 0.2, ease: EASE }}
        >
          <span className="text-lg leading-none text-white">+</span>
        </motion.div>

        {/* Panel content (hover) */}
        <motion.div
          className="absolute inset-0 flex flex-col justify-center gap-1.5 p-4"
          variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }}
          transition={{ duration: 0.4, ease: EASE, delay: 0.12 }}
        >
          <Eyebrow video={video} />
          <TitleText video={video} className="text-base" />
          <MetaLine video={video} />
          <Body video={video} className="mt-1" />
        </motion.div>
      </motion.div>
    </Shell>
  )
}
