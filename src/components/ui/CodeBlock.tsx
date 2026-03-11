interface CodeBlockProps {
  code: string
  language?: string
}

export default function CodeBlock({ code, language }: CodeBlockProps) {
  return (
    <div className="my-4 rounded-lg overflow-hidden border border-zinc-800">
      {language && (
        <div className="bg-zinc-800 px-4 py-1.5 text-xs font-mono text-zinc-400 border-b border-zinc-700">
          {language}
        </div>
      )}
      <pre className="bg-zinc-900 p-4 overflow-x-auto">
        <code className="text-sm font-mono text-zinc-200 whitespace-pre">{code}</code>
      </pre>
    </div>
  )
}
