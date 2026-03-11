interface TagProps {
  label: string
}

export default function Tag({ label }: TagProps) {
  return (
    <span className="inline-block rounded px-2 py-0.5 text-xs font-medium bg-zinc-800 text-zinc-300 border border-zinc-700">
      {label}
    </span>
  )
}
