'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const disciplines = [
  {
    id: 'unreal',
    number: '01',
    title: 'Unreal Engine',
    subtitle: 'QA & Virtual Production',
    accent: '#C85A3A',
    description:
      "Years of pushing Unreal Engine beyond its conventional limits. From gameplay systems to Virtual Production and live events, testing what's never been tested, at the edge of what's possible.",
    tags: ['Automated Testing', 'Visual Logger', 'Blueprint', 'C++', 'nDisplay'],
  },
  {
    id: 'electronics',
    number: '02',
    title: 'Electronics',
    subtitle: 'Hardware & Tinkering',
    accent: '#6B9E6B',
    description:
      'Soldering, breadboarding, reverse engineering. Keeps me grounded in how things actually work at the hardware level, feeding directly into how I debug software.',
    tags: ['ESP32', 'Raspberry Pi', 'KiCad', 'UART'],
  },
  {
    id: 'photography',
    number: '03',
    title: 'Film Photography',
    subtitle: 'Medium Format & Analog',
    accent: '#9E8560',
    description:
      'Shooting on film is my antidote to fast-paced digital work. Every frame costs something, so you slow down. I shoot medium format mostly, on the Mamiya RB67.',
    tags: ['Mamiya RB67', '120 Film', 'Street', 'Architecture'],
  },
  {
    id: 'software',
    number: '04',
    title: 'Software Dev',
    subtitle: 'Tools & Automation',
    accent: '#5B8DB8',
    description:
      'Writing code has always been the thread connecting my work. I build tools to solve real problems: crash analyzers, pipeline scripts, debugging utilities.',
    tags: ['Python', 'TypeScript', 'Next.js', 'C++'],
  },
  {
    id: 'live-events',
    number: '05',
    title: 'Live Events',
    subtitle: 'Technical Direction',
    accent: '#9B6B9B',
    description:
      'A decade of international shows taught me high-stakes decision making under pressure. As video programmer and projection supervisor, I owned the entire visual system.',
    tags: ['Disguise', 'Projection Mapping', 'Media Servers', 'VYV'],
  },
  {
    id: 'ai',
    number: '06',
    title: 'AI',
    subtitle: 'Research & Application',
    accent: '#C8A53A',
    description:
      "Following the AI boom since its early days. We are living through something historically significant. I experiment with AI in my workflow, projects, and how I think about building.",
    tags: ['LLMs', 'Agents', 'Claude', 'Automation'],
  },
]

function DisciplineCard({ d, index }: { d: typeof disciplines[0]; index: number }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      className="rounded-xl border bg-surface cursor-pointer select-none"
      style={{
        borderColor: 'var(--border)',
        borderTopColor: d.accent,
        borderTopWidth: '2px',
      }}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: index * 0.05 }}
      onClick={() => setOpen((o) => !o)}
    >
      {/* Compact header — always visible */}
      <div className="flex items-center gap-4 p-5">
        <span
          className="text-3xl font-bold leading-none shrink-0 select-none font-display w-10"
          style={{ color: d.accent, opacity: 0.25 }}
        >
          {d.number}
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-text-primary font-display">{d.title}</h3>
          <p className="text-[11px] font-medium text-text-muted uppercase tracking-wide">{d.subtitle}</p>
        </div>
        {/* Chevron */}
        <motion.svg
          className="shrink-0 text-text-muted"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
        >
          <path d="M6 9l6 6 6-6" />
        </motion.svg>
      </div>

      {/* Expandable body */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5">
              <p className="text-sm text-text-muted leading-relaxed mb-4">{d.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {d.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-medium px-2 py-0.5 rounded"
                    style={{
                      backgroundColor: `color-mix(in srgb, ${d.accent} 10%, transparent)`,
                      color: d.accent,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function DisciplinesSection() {
  return (
    <div className="rounded-2xl border border-border bg-surface-raised p-6 sm:p-8 card-elevated">
      {/* Header */}
      <div className="mb-6">
        <p className="text-xs font-medium tracking-widest text-text-muted uppercase mb-3">
          What I Do
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary font-display leading-tight">
          Six disciplines.<br />One thread.
        </h2>
      </div>

      {/* Vertical card list */}
      <div className="flex flex-col gap-2">
        {disciplines.map((d, i) => (
          <DisciplineCard key={d.id} d={d} index={i} />
        ))}
      </div>
    </div>
  )
}
