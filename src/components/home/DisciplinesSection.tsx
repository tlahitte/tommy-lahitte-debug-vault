'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useHydrated } from '@/hooks/useHydrated'

const disciplines = [
  {
    id: 'vp-live',
    number: '01',
    title: 'Virtual Production & Live Stages',
    subtitle: 'Stage Operation, MoCap & Projection',
    accent: '#0071E3',
    description:
      'A career built at the crossroads of technology and spectacle. From operating LED volumes and nDisplay walls for virtual production at Epic Games, to a decade of projection supervision on Cirque du Soleil stages and international broadcast galas. I run motion capture sessions, push Unreal Engine into territory that would have felt like science fiction ten years ago, and programme media servers for shows where there is no undo button. Thousands of people, pixels that have to land.',
    tags: ['Unreal Engine', 'nDisplay', 'Motion Capture', 'Disguise', 'Projection Mapping', 'Media Servers'],
  },
  {
    id: 'electronics',
    number: '02',
    title: 'Electronics',
    subtitle: 'Hardware & Tinkering',
    accent: '#34C759',
    description:
      'Soldering, breadboarding, reverse engineering. Keeps me grounded in how things actually work at the hardware level, feeding directly into how I debug software. I love the tangibility of it: building a circuit, watching LEDs light up, feeling the warmth of a freshly soldered joint. Understanding electrons and signals makes me a better software engineer, because the best debugging starts at the layer below.',
    tags: ['ESP32', 'Raspberry Pi', 'KiCad', 'UART'],
  },
  {
    id: 'photography',
    number: '03',
    title: 'Film Photography',
    subtitle: 'Medium Format & Analog',
    accent: '#FF9500',
    description:
      'Shooting on film is my antidote to fast-paced digital work. Every frame costs something, so you slow down. I shoot medium format mostly, on the Mamiya RB67. There is a meditative quality to loading a roll, composing through the waist-level finder, and hearing that mirror slap. Film taught me patience and intentionality, and the results carry a texture and soul that digital just cannot replicate.',
    tags: ['Mamiya RB67', '120 Film', 'Street', 'Architecture'],
  },
  {
    id: 'software-qa',
    number: '04',
    title: 'Software & QA Engineering',
    subtitle: 'Tools, Automation & Testing',
    accent: '#5856D6',
    description:
      'Writing code has always been the thread connecting my work. I build tools to solve real problems: crash analyzers, pipeline scripts, debugging utilities. As a QA engineer I design automated test frameworks, maintain CI/CD pipelines, and write tests for features that didn\'t exist six months ago. Whether it is a Python script that saves my team hours every week or a full Next.js site, I care about craft at every scale.',
    tags: ['Python', 'TypeScript', 'Next.js', 'C++', 'Automated Testing', 'CI/CD'],
  },
  {
    id: 'ai',
    number: '05',
    title: 'AI',
    subtitle: 'Research & Application',
    accent: '#FF3B30',
    description:
      "Following the AI boom since its early days. We are living through something historically significant, and I want to understand it from the inside out. I experiment with AI in my workflow, projects, and how I think about building. From LLM-powered automation to agentic pipelines, I treat AI as a collaborator, not a replacement. The craft is in knowing when to lean on it and when to trust your own instincts.",
    tags: ['LLMs', 'Agents', 'Claude', 'Automation'],
  },
]

function DisciplineCard({ d, index, open, onToggle }: { d: typeof disciplines[0]; index: number; open: boolean; onToggle: () => void }) {
  const hydrated = useHydrated()
  return (
    <motion.div
      className="rounded-xl bg-surface-raised cursor-pointer select-none"
      initial={hydrated ? { opacity: 0, y: 16 } : false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: index * 0.05 }}
      whileHover={{ scale: 1.015, y: -2 }}
      onClick={onToggle}
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
        {/* Accent dot */}
        <motion.div
          className="w-2 h-2 rounded-full shrink-0"
          style={{ backgroundColor: d.accent }}
          animate={{ opacity: open ? 1 : 0.3 }}
          transition={{ duration: 0.2 }}
        />
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
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <div className="rounded-2xl bg-surface p-6 sm:p-8">
      {/* Header */}
      <div className="mb-6">
        <p className="text-xs font-medium tracking-widest uppercase mb-3" style={{ color: 'var(--accent)' }}>
          What I Do
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary font-display leading-tight">
          Five disciplines.<br className="lg:hidden" /> One thread.
        </h2>
      </div>

      {/* Vertical card list */}
      <div className="flex flex-col gap-2">
        {disciplines.map((d, i) => (
          <DisciplineCard
            key={d.id}
            d={d}
            index={i}
            open={openId === d.id}
            onToggle={() => setOpenId(openId === d.id ? null : d.id)}
          />
        ))}
      </div>
    </div>
  )
}
