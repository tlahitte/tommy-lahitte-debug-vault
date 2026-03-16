'use client'

import { useState, useEffect, useRef } from 'react'

const badges = [
  {
    label: 'Unreal Engine',
    glow: 'rgba(200,90,58,0.5)',
    border: 'rgba(200,90,58,0.65)',
    text: 'rgb(200,90,58)',
    description:
      "I've worked as a QA Engineer at Epic Games, pushing Unreal Engine daily beyond its conventional limits: from gameplay systems to Virtual Production and live events. My fascination with game engines goes far beyond gaming. They're real-time rendering platforms reshaping film, broadcast, and live performance.",
  },
  {
    label: 'Software Development',
    glow: 'rgba(168,67,42,0.5)',
    border: 'rgba(168,67,42,0.65)',
    text: 'rgb(200,90,58)',
    description:
      'From custom tooling for media servers at VYV to test automation frameworks in Unreal, writing code has always been the thread connecting my work. I build tools to solve real problems: crash analyzers, pipeline scripts, debugging utilities. I care about clean, maintainable solutions.',
  },
  {
    label: 'Technical Direction',
    glow: 'rgba(200,90,58,0.45)',
    border: 'rgba(200,90,58,0.6)',
    text: 'rgb(180,80,52)',
    description:
      'A decade of international live shows taught me how to make high-stakes technical decisions under pressure. As video programmer and projection supervisor, I owned the entire visual system: from pre-production design to real-time problem solving when things went sideways in front of thousands of people.',
  },
  {
    label: 'Electronics',
    glow: 'rgba(168,67,42,0.45)',
    border: 'rgba(168,67,42,0.6)',
    text: 'rgb(200,90,58)',
    description:
      "Soldering, breadboarding, reverse engineering: electronics keeps me grounded in how things actually work at the hardware level. It feeds directly into how I debug software: follow the signal, trace the path, find where it breaks. There's no abstraction you can't peel back if you're curious enough.",
  },
  {
    label: 'Film Photography',
    glow: 'rgba(200,90,58,0.4)',
    border: 'rgba(200,90,58,0.55)',
    text: 'rgb(180,80,52)',
    description:
      "Shooting on film is my antidote to fast-paced digital work. Every frame costs something, so you slow down and think before pressing the shutter. I shoot medium format mostly. There's a quality of light and grain that digital still hasn't fully replicated, and the analog process is deeply satisfying.",
  },
  {
    label: 'AI',
    glow: 'rgba(168,67,42,0.4)',
    border: 'rgba(168,67,42,0.55)',
    text: 'rgb(200,90,58)',
    description:
      "I've been following the AI boom since its early days, from the first versions of GPT onward. Keeping up with this field is a genuine drive for me, not a passive interest. We are living through something historically significant, and that sense of urgency pushes me to keep learning. I experiment with AI tools whenever I can: in my workflow, in side projects, and in how I think about building things.",
  },
]

const CLOSE_DELAY = 10_000
const ANIM_MS = 350

export default function AboutCard() {
  // activeBadge drives the CSS open/close state (max-height, opacity)
  const [activeBadge, setActiveBadge] = useState<string | null>(null)
  // panelBadge holds the content — lags behind activeBadge during exit so content
  // stays rendered while the panel animates closed
  const [panelBadge, setPanelBadge] = useState<string | null>(null)

  const panel = badges.find((b) => b.label === panelBadge) ?? null
  const isOpen = activeBadge !== null

  const autoCloseRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const exitRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const closePanel = () => {
    if (autoCloseRef.current) clearTimeout(autoCloseRef.current)
    setActiveBadge(null)
    exitRef.current = setTimeout(() => setPanelBadge(null), ANIM_MS)
  }

  const handleBadgeClick = (label: string) => {
    if (exitRef.current) clearTimeout(exitRef.current)
    if (autoCloseRef.current) clearTimeout(autoCloseRef.current)

    if (activeBadge === label) {
      closePanel()
    } else {
      // Open or switch badge — content updates immediately, CSS transition stays open
      setPanelBadge(label)
      setActiveBadge(label)
      autoCloseRef.current = setTimeout(closePanel, CLOSE_DELAY)
    }
  }

  useEffect(() => {
    return () => {
      if (autoCloseRef.current) clearTimeout(autoCloseRef.current)
      if (exitRef.current) clearTimeout(exitRef.current)
    }
  }, [])

  return (
    <div className="rounded-xl border border-border bg-surface p-6 sm:p-10 card-elevated">
      <h2 className="text-lg font-semibold text-text-primary mb-4">About Me</h2>
      <p className="text-text-muted leading-relaxed">
        I&apos;m Tommy, a maker and tinkerer who can&apos;t resist taking things apart to see
        how they work, and occasionally getting them back together.
      </p>
      <p className="mt-4 text-text-muted leading-relaxed">
        My career has been a single thread connecting art and technology: a decade of video
        programming and projection supervision for international live shows, deep dives into
        media-server technology at{' '}
        <a
          href="https://www.vyv.ca/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-text-primary font-medium underline decoration-transparent decoration-dotted underline-offset-2 hover:text-accent hover:decoration-accent/60 transition-colors duration-200"
        >VYV</a>, and now{' '}
        <a
          href="https://www.epicgames.com/site/en-US/home"
          target="_blank"
          rel="noopener noreferrer"
          className="text-text-primary font-medium underline decoration-transparent decoration-dotted underline-offset-2 hover:text-accent hover:decoration-accent/60 transition-colors duration-200"
        >Virtual Production at Epic Games</a>{' '}
        where I get to push Unreal Engine into territory that would have felt like science
        fiction ten years ago.
      </p>
      <p className="mt-4 text-text-muted leading-relaxed">
        This site is a side-effect of how I work. When I solve something hard, I write it down.
        These are the debugging notes, editor tricks, and QA patterns that came out of building
        real things on real projects. No padding, no filler. Just the stuff that actually mattered.
      </p>

      <div className="mt-6 pt-6 border-t border-border flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Credibility signal */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-medium text-text-muted uppercase tracking-widest">Working at</span>
          <span className="text-xs font-semibold text-accent bg-accent/10 border border-accent/30 px-2.5 py-1 rounded-md">
            Epic Games
          </span>
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-4 bg-border" />

        {/* Tech stack */}
        <div className="flex flex-wrap gap-2">
          {badges.map(({ label, glow, border, text }) => (
            <button
              key={label}
              onClick={() => handleBadgeClick(label)}
              className="badge-glow text-xs font-medium text-text-muted bg-surface-raised border border-border px-2.5 py-1 rounded-md cursor-pointer transition-all"
              style={{ '--badge-glow': glow, '--badge-border': border, '--badge-text': text } as React.CSSProperties}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Description panel — always in DOM, animated via max-height + opacity */}
      <div
        style={{
          maxHeight: isOpen ? '200px' : '0px',
          opacity: isOpen ? 1 : 0,
          marginTop: isOpen ? '1rem' : '0',
          transition: `max-height ${ANIM_MS}ms ease, opacity ${ANIM_MS}ms ease, margin-top ${ANIM_MS}ms ease`,
          overflow: 'hidden',
        }}
      >
        {panel && (
          <div
            className="rounded-lg border px-4 pt-3 pb-0 text-sm leading-relaxed"
            style={{
              borderColor: panel.border,
              backgroundColor: `color-mix(in srgb, ${panel.glow} 8%, transparent)`,
              color: panel.text,
            }}
          >
            <p className="pb-3">{panel.description}</p>
            {/* Countdown progress bar */}
            <div className="h-px w-full bg-current opacity-10 relative">
              <div
                key={activeBadge}
                className="absolute inset-y-0 left-0 bg-current opacity-50"
                style={{ animation: `shrink-width ${CLOSE_DELAY}ms linear forwards` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
