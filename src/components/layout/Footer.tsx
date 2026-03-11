export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
        <p className="text-center text-sm text-zinc-500">
          © {new Date().getFullYear()} Tommy Lahitte · QA Engineer &amp; Unreal Engine Debug Notes
        </p>
      </div>
    </footer>
  )
}
