export default function AuthorBio() {
  return (
    <aside className="mt-12 pt-8 border-t border-border" aria-label="About the author">
      <div className="flex items-start gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/avatar/tommy-lahitte-480.webp"
          alt="Tommy Lahitte"
          width={64}
          height={64}
          className="rounded-full shrink-0"
          loading="lazy"
        />
        <div>
          <p className="font-semibold text-text-primary">Tommy Lahitte</p>
          <p className="text-sm text-text-muted">Senior QA Engineer at Epic Games</p>
          <p className="mt-1 text-sm text-text-muted leading-relaxed">
            QA engineer working on Unreal Engine Virtual Production. Previously a decade in live-show
            video programming and media-server development. Writes about debugging, automation, and
            the things worth taking apart.
          </p>
          <div className="mt-2 flex items-center gap-3">
            <a
              href="https://uk.linkedin.com/in/tlahitte"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-text-muted hover:text-accent transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/tlahitte"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-text-muted hover:text-accent transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </aside>
  )
}
