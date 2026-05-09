"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import type { Components } from "react-markdown"

interface Props {
  content: string
  className?: string
  // card mode: tighter, no large headings
  compact?: boolean
}

export function MarkdownRenderer({ content, className = "", compact = false }: Props) {
  const components: Components = {
    h1: ({ children }) => (
      <p className={`font-bold ${compact ? "text-base" : "text-lg"} mb-1`}>{children}</p>
    ),
    h2: ({ children }) => (
      <p className={`font-bold ${compact ? "text-sm" : "text-base"} mb-1`}>{children}</p>
    ),
    h3: ({ children }) => (
      <p className="font-semibold text-sm mb-1">{children}</p>
    ),
    p: ({ children }) => (
      <p className="leading-relaxed mb-2 last:mb-0">{children}</p>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold">{children}</strong>
    ),
    em: ({ children }) => (
      <em className="italic opacity-90">{children}</em>
    ),
    ul: ({ children }) => (
      <ul className="space-y-0.5 mb-2 pl-4 list-disc">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="space-y-0.5 mb-2 pl-4 list-decimal">{children}</ol>
    ),
    li: ({ children }) => (
      <li className="leading-relaxed">{children}</li>
    ),
    code: ({ children, className: codeClass }) => {
      const isBlock = codeClass?.includes("language-")
      if (isBlock) {
        return (
          <code className="block text-xs font-mono bg-black/10 rounded px-2 py-1.5 my-1 whitespace-pre-wrap break-all">
            {children}
          </code>
        )
      }
      return (
        <code className="text-xs font-mono bg-black/10 rounded px-1 py-0.5">{children}</code>
      )
    },
    pre: ({ children }) => <pre className="my-1">{children}</pre>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-current opacity-70 pl-3 my-1 italic">
        {children}
      </blockquote>
    ),
    // Flatten tables to avoid layout breaks inside cards
    table: ({ children }) => (
      <div className="text-xs opacity-80 my-1">{children}</div>
    ),
    hr: () => <hr className="border-current opacity-20 my-2" />,
    a: ({ children, href }) => (
      <a href={href} className="underline opacity-80" target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
  }

  return (
    <div className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
