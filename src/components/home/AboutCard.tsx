export default function AboutCard() {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-10">
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
    </div>
  )
}
