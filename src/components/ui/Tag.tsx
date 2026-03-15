interface TagProps {
  label: string
}

export default function Tag({ label }: TagProps) {
  return (
    <span className="inline-block rounded px-2 py-0.5 text-xs font-medium bg-surface-raised text-text-muted border border-border">
      {label}
    </span>
  )
}
