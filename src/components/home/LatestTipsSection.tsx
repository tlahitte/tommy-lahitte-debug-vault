'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import type { Tip } from '@/lib/types'
import TipCard from '@/components/tips/TipCard'

interface Props {
  tips: Tip[]
}

export default function LatestTipsSection({ tips }: Props) {
  if (tips.length === 0) return null

  return (
    <div
      className="rounded-2xl border border-border card-elevated overflow-hidden relative"
      style={{
        background: 'linear-gradient(150deg, #F0EBE0 0%, #EAE2D4 60%, #F2EDE3 100%)',
      }}
    >
      {/* Accent glow — top-right corner */}
      <div
        className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at top right, rgba(200,90,58,0.07) 0%, transparent 70%)',
        }}
      />

      <div className="relative p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <p
              className="text-xs font-medium tracking-widest uppercase mb-3"
              style={{ color: 'var(--accent)' }}
            >
              Unreal Tips
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary font-display">
              Fresh from the vault.
            </h2>
          </div>
          <Link
            href="/tips"
            className="shrink-0 text-sm font-medium text-accent hover:text-accent-hover flex items-center gap-1.5 transition-colors pb-1"
          >
            Browse all
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Tips */}
        <div className="flex flex-col gap-4">
          {tips.map((tip, i) => (
            <motion.div
              key={tip.slug}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
            >
              <TipCard tip={tip} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
