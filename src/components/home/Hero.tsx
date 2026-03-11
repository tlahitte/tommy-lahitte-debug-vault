import Link from 'next/link'
import Image from 'next/image'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#1c1535] -mt-14">
      {/* Bottom fade into page background */}
      <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-b from-transparent to-[#09090b] z-0 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex flex-col-reverse sm:flex-row sm:items-stretch gap-4 sm:gap-6 pt-[5.5rem] pb-0 sm:pt-[6.5rem]">

          {/* Photo — on mobile: below text, centered; on sm+: left column stretching to text height */}
          <div className="shrink-0 w-40 mx-auto sm:mx-0 sm:w-44 md:w-52 lg:w-60 flex items-end overflow-hidden">
            <Image
              src="/tommy-lahitte.webp"
              alt="Tommy Lahitte"
              width={700}
              height={700}
              sizes="(max-width: 640px) 160px, (max-width: 768px) 176px, (max-width: 1024px) 208px, 240px"
              className="w-full h-auto object-contain scale-x-[-1]"
              priority
            />
          </div>

          {/* Text content */}
          <div className="flex-1 pb-2">
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-100">
              Tommy Lahitte
            </h1>
            <p className="mt-2 sm:mt-3 text-base sm:text-xl font-medium">
              <span className="text-violet-400">Senior QA Engineer</span>
              <span className="text-zinc-500 mx-2">|</span>
              <em className="text-violet-300 not-italic"><span className="hidden sm:inline">Unreal Engine</span><span className="sm:hidden">UE</span> Expert</em>
            </p>
            <hr className="my-4 border-zinc-700/50" />
            <p className="max-w-xl text-base text-zinc-400 leading-relaxed">
              Tips and tricks for mastering Unreal Engine debugging and QA.
            </p>
            <div className="mt-5">
              <Link
                href="/tips"
                className="inline-flex items-center gap-2 rounded-lg bg-violet-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-600 transition-colors"
              >
                Browse All Tips
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
