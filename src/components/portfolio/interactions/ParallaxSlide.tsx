'use client'

import { motion } from 'motion/react'
import Shell from './Shell'
import { Poster, Eyebrow, TitleText, MetaLine, Body, EASE, type VariantProps } from './parts'

// Parallax-slide: the poster drifts left while a dark panel opens from the
// right at a different rate, so the two planes move independently.
export default function ParallaxSlide({ video, onOpen }: VariantProps) {
  return (
    <Shell video={video} onOpen={onOpen}>
      <motion.div
        className="absolute inset-0"
        variants={{ rest: { x: 0 }, hover: { x: '-8%' } }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <Poster video={video} />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
      <div className="absolute inset-x-0 top-0 p-4">
        <Eyebrow video={video} />
      </div>

      <motion.div
        className="absolute inset-y-0 right-0 flex flex-col justify-center overflow-hidden px-5"
        style={{ backgroundColor: 'rgba(14,14,16,0.92)' }}
        variants={{ rest: { width: '0%' }, hover: { width: '66%' } }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <motion.div
          className="min-w-[12rem]"
          variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }}
          transition={{ duration: 0.4, ease: EASE, delay: 0.12 }}
        >
          <TitleText video={video} className="text-base" />
          <MetaLine video={video} className="mt-1" />
          <Body video={video} className="mt-1.5" />
        </motion.div>
      </motion.div>
    </Shell>
  )
}
