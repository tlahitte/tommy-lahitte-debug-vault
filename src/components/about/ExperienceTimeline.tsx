'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { useHydrated } from '@/hooks/useHydrated'
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  AnimatePresence,
} from 'motion/react'

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface HighlightBadge {
  label: string
  url?: string
}

interface TimelineEntry {
  id: string
  role: string
  company: string
  companyUrl?: string
  period: string
  location: string
  description: string
  highlights?: (string | HighlightBadge)[]
  highlightsLabel?: string
  year: number
}

const experiences: TimelineEntry[] = [
  {
    id: 'epic-mocap',
    role: 'Motion Capture Operator',
    company: 'Epic Games',
    companyUrl: 'https://www.epicgames.com/site/en-US/home',
    period: 'Jan 2025 - Present',
    location: 'London, UK',
    description:
      'Running motion capture sessions at the London Innovation Lab. Operating suits and camera systems for real-time character animation in Unreal Engine, pushing the boundaries of live performance capture for virtual production pipelines.',
    highlights: [
      'Vicon Shogun',
      'Captury Markerless',
      'Live Link',
      'Full-Body MoCap',
      'Real-Time Retargeting',
    ],
    highlightsLabel: 'technologies',
    year: 2025,
  },
  {
    id: 'epic-stage-op',
    role: 'VP Stage Operator',
    company: 'Epic Games',
    companyUrl: 'https://www.epicgames.com/site/en-US/home',
    period: 'Jan 2024 - Present',
    location: 'London, UK',
    description:
      'Operating LED volumes and nDisplay setups for virtual production stages at the London Innovation Lab. Managing real-time content delivery, camera tracking integration, and on-set technical direction for film and broadcast productions.',
    highlights: [
      'nDisplay',
      'LED Volume',
      'Camera Tracking',
      'Mo-Sys',
      'DMX',
    ],
    highlightsLabel: 'technologies',
    year: 2024,
  },
  {
    id: 'epic-senior',
    role: 'Senior QA Engineer, Virtual Production',
    company: 'Epic Games',
    companyUrl: 'https://www.epicgames.com/site/en-US/home',
    period: 'Dec 2022 - Present',
    location: 'London, UK',
    description:
      'Promotion focused on test automation and CI/CD maintenance for Virtual Production features. Building tools and expanding existing testing frameworks in Unreal Engine to support Virtual Production workflows.',
    highlights: [
      'EXR Playback',
      'Composure',
      'LiveLinkHub',
      'Motion Design',
      'nDisplay',
      'Media Framework',
      'Virtual Camera',
    ],
    highlightsLabel: 'features',
    year: 2022,
  },
  {
    id: 'epic-qa',
    role: 'QA Engineer, Virtual Production',
    company: 'Epic Games',
    companyUrl: 'https://www.epicgames.com/site/en-US/home',
    period: 'Apr 2021 - Dec 2022',
    location: 'Montreal, Canada',
    description:
      'Virtual Production division, pioneering new storytelling techniques with Unreal Engine. Assisted VP workflows on major film and TV productions.',
    highlights: [
      'Ahsoka (Star Wars, Disney)',
      'The Mandalorian (Disney)',
      'Gladiator II',
      'The Batman (2022)',
      'Avatar: The Last Airbender (Netflix)',
    ],
    highlightsLabel: 'productions',
    year: 2021,
  },
  {
    id: 'vyv',
    role: 'Projection Supervisor',
    company: 'VYV Corporation',
    companyUrl: 'https://www.vyv.ca/',
    period: 'Nov 2015 - Apr 2021',
    location: 'Montreal, Canada',
    description:
      'Major international projects across live entertainment, theme parks, and broadcast.',
    highlights: [
      { label: 'Cirque du Soleil: Drawn to Life', url: 'https://www.vyv.ca/portfolio/cirque-du-soleil-drawn-to-life/' },
      'Cirque du Soleil: R.U.N',
      { label: 'Cirque du Soleil: MJ One', url: 'https://www.vyv.ca/portfolio/cirque-du-soleil-mj-one/' },
      { label: 'Roger Waters Us+Them Tour', url: 'https://www.vyv.ca/portfolio/roger-waters-us-and-them-2017/' },
      'Planet Hollywood Las Vegas',
      'Carnival Cruise Lines',
      'NFL Experience Times Square',
      'Intel CES 2017',
      { label: 'CCTV New Year Gala (China)', url: 'https://www.vyv.ca/portfolio/cctv-schi/' },
      'Lido de Paris',
      { label: 'National Day Parade Singapore', url: 'https://www.vyv.ca/portfolio/hexogon-solution-snd/' },
    ],
    year: 2015,
  },
  {
    id: 'pqds',
    role: 'Multimedia Equipment Technician',
    company: 'Partenariat du Quartier des spectacles',
    companyUrl: 'https://www.quartierdesspectacles.com/en',
    period: 'Nov 2014 - Nov 2015',
    location: 'Montreal, Canada',
    description: 'As a technician on the Urban Digital Lab, I was responsible for all interactive installations and projection mapping on the entire PQDS site. I installed the 21 musical swings from Daily tous les jours and maintained the 7 projection mapping surfaces.',
    highlights: [
      { label: '21 Musical Swings - Daily tous les jours', url: 'https://www.dailytouslesjours.com/en/work/21-swings' },
      { label: '7 Projection Mapping Surfaces', url: 'https://www.quartierdesspectacles.com/en/videoprojections-2' },
    ],
    highlightsLabel: 'installations',
    year: 2014,
  },
]

interface EducationEntry {
  institution: string
  degree: string
  years: string
  logo: string
}

const education: EducationEntry[] = [
  {
    institution: 'UQAM',
    degree: "Bachelor's, Communication & Interactive Media",
    years: '2012 - 2015',
    logo: '/logos/uqam.svg',
  },
  {
    institution: 'Universite de Montreal',
    degree: 'Cinema Studies Minor',
    years: '2011 - 2012',
    logo: '/logos/udem.svg',
  },
  {
    institution: 'I.U.T Annecy-le-Vieux',
    degree: 'Bac+2, Computer Science',
    years: '2008 - 2010',
    logo: '/logos/usmb.svg',
  },
]

interface CertificationEntry {
  name: string
  issuer: string
  logo: string
}

const certifications: CertificationEntry[] = [
  { name: 'Certified Tester, Foundation Level', issuer: 'ISTQB', logo: '/logos/istqb.svg' },
  { name: 'Unreal Fellowship: Animation', issuer: 'Epic Games', logo: '/logos/epic-games.svg' },
  { name: 'C# for Programmers: A Practical Guide', issuer: 'Coursera', logo: '/logos/coursera.svg' },
]

/* ------------------------------------------------------------------ */
/*  TimelineCard — scoped useInView per card                           */
/* ------------------------------------------------------------------ */

function TimelineCard({
  entry,
  index,
}: {
  entry: TimelineEntry
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const hydrated = useHydrated()
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [showHighlights, setShowHighlights] = useState(false)

  const isLeft = index % 2 === 0

  return (
    <motion.div
      ref={ref}
      initial={hydrated ? { opacity: 0, x: isLeft ? -40 : 40 } : false}
      animate={inView ? { opacity: 1, x: 0 } : hydrated ? { opacity: 0, x: isLeft ? -40 : 40 } : { opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="rounded-xl bg-surface-raised p-5"
      whileHover={{ scale: 1.015, y: -2 }}
    >
      {/* Company */}
      {entry.companyUrl ? (
        <a
          href={entry.companyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent font-semibold underline decoration-dotted underline-offset-2 hover:text-accent hover:decoration-accent/60 transition-colors"
        >
          {entry.company}
        </a>
      ) : (
        <span className="text-accent font-semibold">{entry.company}</span>
      )}

      {/* Role */}
      <p className="text-text-primary font-medium mt-1">{entry.role}</p>

      {/* Period & location */}
      <p className="text-text-muted text-sm mt-1">
        {entry.period} &middot; {entry.location}
      </p>

      {/* Description */}
      <p className="text-text-muted text-sm leading-relaxed mt-3">
        {entry.description}
      </p>

      {/* VYV expandable highlights */}
      {entry.highlights && (
        <div className="mt-3">
          <button
            onClick={() => setShowHighlights((v) => !v)}
            className="text-xs font-medium text-accent hover:text-accent-hover transition-colors cursor-pointer"
          >
            {showHighlights ? `Hide ${entry.highlightsLabel || 'projects'}` : `Show ${entry.highlightsLabel || 'projects'}`}
          </button>
          <AnimatePresence initial={false}>
            {showHighlights && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {entry.highlights.map((h) => {
                    const label = typeof h === 'string' ? h : h.label
                    const url = typeof h === 'string' ? undefined : h.url
                    const baseClass =
                      'text-xs bg-surface-raised border border-border rounded-md px-2 py-0.5 text-text-muted'

                    return url ? (
                      <a
                        key={label}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${baseClass} underline decoration-dotted underline-offset-2 hover:text-accent hover:border-accent/40 transition-colors`}
                      >
                        {label}
                      </a>
                    ) : (
                      <span key={label} className={baseClass}>
                        {label}
                      </span>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  EducationRow — animated with useInView                             */
/* ------------------------------------------------------------------ */

function EducationRow({ entry }: { entry: EducationEntry }) {
  const ref = useRef<HTMLDivElement>(null)
  const hydrated = useHydrated()
  const inView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={hydrated ? { opacity: 0, y: 16 } : false}
      animate={inView ? { opacity: 1, y: 0 } : hydrated ? { opacity: 0, y: 16 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex items-center gap-3"
    >
      <Image
        src={entry.logo}
        alt={`${entry.institution} logo`}
        width={28}
        height={28}
        className="shrink-0 rounded"
      />
      <span className="text-text-primary font-medium text-sm">
        {entry.institution}
      </span>
      <span className="text-text-muted text-sm">{entry.degree}</span>
      <span className="text-text-muted text-xs sm:ml-auto">{entry.years}</span>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  CertificationRow                                                   */
/* ------------------------------------------------------------------ */

function CertificationRow({ entry }: { entry: CertificationEntry }) {
  const ref = useRef<HTMLDivElement>(null)
  const hydrated = useHydrated()
  const inView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={hydrated ? { opacity: 0, y: 16 } : false}
      animate={inView ? { opacity: 1, y: 0 } : hydrated ? { opacity: 0, y: 16 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex items-center gap-3"
    >
      <Image
        src={entry.logo}
        alt={`${entry.issuer} logo`}
        width={28}
        height={28}
        className="shrink-0 rounded"
      />
      <span className="text-text-primary font-medium text-sm">
        {entry.name}
      </span>
      <span className="text-text-muted text-sm sm:ml-auto">{entry.issuer}</span>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  ExperienceTimeline — main component                                */
/* ------------------------------------------------------------------ */

export default function ExperienceTimeline() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const rawHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  const smoothHeight = useSpring(rawHeight, { stiffness: 100, damping: 30 })

  return (
    <section className="pt-2 pb-10 sm:pb-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Section heading */}
        <h2 className="text-2xl font-bold text-text-primary font-display mb-10 text-center">
          Experience
        </h2>

        {/* Timeline grid */}
        <div
          ref={containerRef}
          className="relative grid grid-cols-[auto_1fr] md:grid-cols-[1fr_auto_1fr] gap-x-4 md:gap-x-8"
        >
          {/* Spine — background track */}
          <div className="absolute left-[7px] md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-border" />

          {/* Spine — scroll-driven fill */}
          <motion.div
            className="absolute left-[7px] md:left-1/2 md:-translate-x-1/2 top-0 w-0.5 rounded-full"
            style={{
              height: smoothHeight,
              backgroundColor: 'var(--accent)',
              opacity: 0.3,
            }}
          />

          {experiences.map((entry, i) => {
            const isLeft = i % 2 === 0

            return (
              <div
                key={entry.id}
                className="contents"
              >
                {/* Desktop: left card or empty */}
                <div className="hidden md:block py-4">
                  {isLeft ? (
                    <TimelineCard entry={entry} index={i} />
                  ) : (
                    <div />
                  )}
                </div>

                {/* Spine marker — year dot */}
                <div className="relative flex flex-col items-center py-4">
                  <div className="w-4 h-4 rounded-full bg-accent border-2 border-surface z-10 shrink-0" />
                  <span className="absolute top-full mt-0.5 text-[10px] font-medium text-text-muted whitespace-nowrap">
                    {entry.year}
                  </span>
                </div>

                {/* Desktop: right card or empty / Mobile: always show card */}
                <div className="py-4">
                  {/* Mobile: always render card */}
                  <div className="md:hidden">
                    <TimelineCard entry={entry} index={i} />
                  </div>
                  {/* Desktop: only render on right side for odd index */}
                  <div className="hidden md:block">
                    {!isLeft ? (
                      <TimelineCard entry={entry} index={i} />
                    ) : (
                      <div />
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Education sub-section */}
        <div className="mt-16 pt-8 border-t border-border">
          <h3 className="text-lg font-semibold text-text-primary font-display mb-6 text-center">
            Education
          </h3>
          <div className="space-y-4 max-w-xl mx-auto">
            {education.map((entry) => (
              <EducationRow key={entry.institution} entry={entry} />
            ))}
          </div>
        </div>

        {/* Certifications sub-section */}
        <div className="mt-12 pt-8 border-t border-border">
          <h3 className="text-lg font-semibold text-text-primary font-display mb-6 text-center">
            Licenses & Certifications
          </h3>
          <div className="space-y-4 max-w-xl mx-auto">
            {certifications.map((entry) => (
              <CertificationRow key={entry.name} entry={entry} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
