'use client'

import { motion } from 'motion/react'
import Shell from './Shell'
import { Poster, Eyebrow, TitleText, MetaLine, Body, EASE, type VariantProps } from './parts'

// Ken-Burns sheet: the poster slowly pans and zooms while a frosted glass sheet
// eases up from the bottom third to hold the copy.
export default function KenBurnsSheet({ video, onOpen }: VariantProps) {
  return (
    <Shell video={video} onOpen={onOpen}>
      <motion.div
        className="absolute inset-0"
        variants={{ rest: { scale: 1, x: 0, y: 0 }, hover: { scale: 1.08, x: '-3%', y: '-3%' } }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <Poster video={video} />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      <div className="absolute inset-x-0 top-0 p-4">
        <Eyebrow video={video} />
      </div>

      <motion.div
        className="absolute inset-x-0 bottom-0 flex flex-col justify-center overflow-hidden bg-black/55 px-5 backdrop-blur-md"
        variants={{ rest: { height: '26%' }, hover: { height: '58%' } }}
        transition={{ duration: 0.5, ease: EASE }}
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
