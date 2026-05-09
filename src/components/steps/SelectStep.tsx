"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MarkdownRenderer } from "@/components/MarkdownRenderer"
import type { Conversation } from "@/lib/types"

interface Props {
  conversation: Conversation
  selectedIds: string[]
  onSelect: (ids: string[]) => void
  onBack: () => void
  onNext: () => void
}

export function SelectStep({
  conversation,
  selectedIds,
  onSelect,
  onBack,
  onNext,
}: Props) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const toggle = (id: string) => {
    onSelect(
      selectedIds.includes(id)
        ? selectedIds.filter((s) => s !== id)
        : [...selectedIds, id]
    )
  }

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const isLong = (content: string) => content.length > 200

  return (
    <div className="flex flex-col min-h-screen">
      <div className="border-b px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="font-semibold">选择要分享的片段</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            共 {conversation.turns.length} 轮对话，已选 {selectedIds.length} 轮
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={onBack}>
            ← 返回
          </Button>
          <Button size="sm" onClick={onNext} disabled={selectedIds.length === 0}>
            选好了 →
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 px-6 py-4">
        <div className="max-w-2xl mx-auto space-y-3">
          {conversation.turns.map((turn, index) => {
            const selected = selectedIds.includes(turn.id)
            const long = isLong(turn.content)
            const isExpanded = expanded[turn.id]
            const displayContent =
              long && !isExpanded
                ? turn.content.slice(0, 200) + "..."
                : turn.content

            return (
              <div
                key={turn.id}
                onClick={() => toggle(turn.id)}
                className={`
                  rounded-xl border p-4 cursor-pointer transition-all
                  ${selected
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-muted-foreground/40"
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center gap-1 pt-0.5 shrink-0">
                    <div
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                        selected ? "border-primary bg-primary" : "border-muted-foreground/40"
                      }`}
                    >
                      {selected && (
                        <svg className="w-2.5 h-2.5 text-primary-foreground" fill="none" viewBox="0 0 10 10">
                          <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={turn.role === "user" ? "outline" : "secondary"}
                        className="text-xs"
                      >
                        {turn.role === "user" ? "你" : "AI"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">第 {index + 1} 轮</span>
                    </div>
                    <MarkdownRenderer
                      content={displayContent}
                      className="text-sm text-foreground"
                    />
                    {long && (
                      <button
                        className="text-xs text-primary hover:underline"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleExpand(turn.id)
                        }}
                      >
                        {isExpanded ? "收起" : "展开全部"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}
