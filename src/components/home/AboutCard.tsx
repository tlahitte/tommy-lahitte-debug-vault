export default function AboutCard() {
  return (
    <div className="rounded-xl border border-zinc-700/60 bg-gradient-to-b from-zinc-800/60 to-zinc-900/50 p-6 sm:p-10">
      <h2 className="text-lg font-semibold text-zinc-100 mb-4">About Me</h2>
      <p className="text-zinc-400 leading-relaxed">
        I&apos;m Tommy, a maker and tinkerer who can&apos;t resist taking things apart to see
        how they work, and occasionally getting them back together.
      </p>
      <p className="mt-4 text-zinc-400 leading-relaxed">
        My career has been a single thread connecting art and technology: a decade of video
        programming and projection supervision for international live shows, deep dives into
        media-server technology at{' '}
        <span className="text-zinc-300 font-medium">VYV</span>, and now{' '}
        <span className="text-zinc-300 font-medium">Virtual Production at Epic Games</span>{' '}
        where I get to push Unreal Engine into territory that would have felt like science
        fiction ten years ago.
      </p>
      <p className="mt-4 text-zinc-400 leading-relaxed">
        This site is a side-effect of how I work. When I solve something hard, I write it down.
        These are the debugging notes, editor tricks, and QA patterns that came out of building
        real things on real projects. No padding, no filler. Just the stuff that actually mattered.
      </p>

      <div className="mt-6 pt-6 border-t border-zinc-700/50 flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Credibility signal */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-medium text-zinc-500 uppercase tracking-widest">Working at</span>
          <span className="text-xs font-semibold text-violet-400 bg-violet-950/50 border border-violet-800/50 px-2.5 py-1 rounded-md">
            Epic Games
          </span>
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-4 bg-zinc-700/60" />

        {/* Tech stack */}
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Unreal Engine',        glow: 'rgba(139,92,246,0.6)',  border: 'rgba(139,92,246,0.7)',  text: 'rgb(196,181,253)' },
            { label: 'Software Development', glow: 'rgba(106,115,238,0.6)', border: 'rgba(106,115,238,0.7)', text: 'rgb(186,190,255)' },
            { label: 'Technical Direction',  glow: 'rgba(73,137,229,0.6)',  border: 'rgba(73,137,229,0.7)',  text: 'rgb(172,210,255)' },
            { label: 'Electronics',          glow: 'rgba(40,160,221,0.6)',  border: 'rgba(40,160,221,0.7)',  text: 'rgb(154,222,255)' },
            { label: 'Film Photography',     glow: 'rgba(6,182,212,0.6)',   border: 'rgba(6,182,212,0.7)',   text: 'rgb(103,232,249)' },
          ].map(({ label, glow, border, text }) => (
            <span
              key={label}
              className="badge-glow text-xs font-medium text-zinc-400 bg-zinc-800/60 border border-zinc-700/50 px-2.5 py-1 rounded-md cursor-default"
              style={{ '--badge-glow': glow, '--badge-border': border, '--badge-text': text } as React.CSSProperties}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
