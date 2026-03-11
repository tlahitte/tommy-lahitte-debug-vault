export default function AboutCard() {
  return (
    <section className="pb-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-zinc-100 mb-3">About</h2>
          <p className="text-zinc-400 leading-relaxed">
            I&apos;m Tommy Lahitte, a QA Engineer at Epic Games working on Unreal Engine. This site
            is my personal collection of debugging techniques, editor workflows, and QA automation
            patterns — the kind of tips that save hours when you&apos;re deep in a tricky regression
            or trying to reproduce an elusive crash.
          </p>
          <p className="mt-3 text-zinc-400 leading-relaxed">
            Everything here is drawn from real experience. No filler, no padding — just the notes I
            wish I&apos;d had sooner.
          </p>
        </div>
      </div>
    </section>
  )
}
