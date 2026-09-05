export default function TravelMapSection() {
  return (
    <div className="rounded-2xl bg-surface-raised p-6 sm:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-text-primary leading-tight">
            Where I&apos;ve been
          </h2>
          <p className="mt-2 max-w-lg text-text-muted">
            A living map of favourite spots from a decade of travel — restaurants, museums,
            hikes, and hidden corners across three continents.
          </p>
        </div>
        <a
          href="https://www.google.com/maps/d/edit?mid=1Mx4UATeVBzM5jw8dNYS3PF6e3tRId_E&usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:opacity-80 transition-opacity duration-200 shrink-0"
        >
          Open full map
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M7 17 17 7M7 7h10v10" />
          </svg>
        </a>
      </div>

      {/* Map embed */}
      <div className="relative aspect-[4/3] sm:aspect-[16/9] w-full overflow-hidden rounded-xl">
        <iframe
          src="https://www.google.com/maps/d/embed?mid=1Mx4UATeVBzM5jw8dNYS3PF6e3tRId_E&hl=en&ehbc=2E312F"
          title="Map of Tommy Lahitte's saved travel spots"
          className="absolute inset-0 h-full w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  )
}
