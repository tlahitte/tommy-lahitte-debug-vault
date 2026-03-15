interface CodeBlockProps {
  code: string
  language?: string
}

export default function CodeBlock({ code, language }: CodeBlockProps) {
  return (
    <div className="my-4 rounded-lg overflow-hidden border border-border">
      {language && (
        <div className="bg-surface-raised px-4 py-1.5 text-xs font-mono text-text-muted border-b border-border">
          {language}
        </div>
      )}
      <pre className="bg-zinc-900 p-4 overflow-x-auto">
        <code className="text-sm font-mono text-zinc-200 whitespace-pre">{code}</code>
      </pre>
    </div>
  )
}
