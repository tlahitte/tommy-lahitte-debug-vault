'use client'

import { motion } from 'motion/react'
import Shell from './Shell'
import { Poster, Eyebrow, TitleText, MetaLine, Body, EASE, type VariantProps } from './parts'

const line = { rest: { opacity: 0, y: 10 }, hover: { opacity: 1, y: 0 } }

// Stagger-cascade: the poster dims and the copy lines rise in sequence, one
// after another, like a list assembling itself.
export default function StaggerCascade({ video, onOpen }: VariantProps) {
  return (
    <Shell video={video} onOpen={onOpen}>
      <motion.div
        className="absolute inset-0"
        variants={{ rest: { filter: 'brightness(1)' }, hover: { filter: 'brightness(0.4)' } }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <Poster video={video} />
      </motion.div>

      <motion.div
        className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 p-5"
        variants={{ rest: {}, hover: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } } }}
      >
        <motion.div variants={line} transition={{ duration: 0.4, ease: EASE }}>
          <Eyebrow video={video} />
        </motion.div>
        <motion.div variants={line} transition={{ duration: 0.4, ease: EASE }}>
          <TitleText video={video} className="text-lg" />
        </motion.div>
        <motion.div variants={line} transition={{ duration: 0.4, ease: EASE }}>
          <MetaLine video={video} />
        </motion.div>
        <motion.div variants={line} transition={{ duration: 0.4, ease: EASE }}>
          <Body video={video} />
        </motion.div>
      </motion.div>
    </Shell>
  )
}
