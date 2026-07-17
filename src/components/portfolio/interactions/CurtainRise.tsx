'use client'

import { motion } from 'motion/react'
import Shell from './Shell'
import { Poster, Eyebrow, TitleText, MetaLine, Body, EASE, type VariantProps } from './parts'

// Curtain-rise: a dark panel rises like a theatre curtain to cover the lower
// half while the poster eases in slightly. Title stays visible as the anchor.
export default function CurtainRise({ video, onOpen }: VariantProps) {
  return (
    <Shell video={video} onOpen={onOpen}>
      <motion.div
        className="absolute inset-0"
        variants={{ rest: { scale: 1 }, hover: { scale: 1.04 } }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <Poster video={video} />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute inset-x-0 top-0 p-4">
        <Eyebrow video={video} />
      </div>

      <motion.div
        className="absolute inset-x-0 bottom-0 flex flex-col justify-center overflow-hidden bg-[#0E0E10] px-4"
        variants={{ rest: { height: '22%' }, hover: { height: '52%' } }}
        transition={{ duration: 0.45, ease: EASE }}
      >
        <TitleText video={video} className="text-base" />
        <motion.div
          variants={{ rest: { opacity: 0, y: 6 }, hover: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.4, ease: EASE, delay: 0.1 }}
        >
          <MetaLine video={video} className="mt-1" />
          <Body video={video} className="mt-1.5" />
        </motion.div>
      </motion.div>
    </Shell>
  )
}
