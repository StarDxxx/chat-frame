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
  onClose: () => void
}

export function SelectModal({ conversation, selectedIds, onSelect, onClose }: Props) {
  const [local, setLocal] = useState<string[]>(selectedIds)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const toggle = (id: string) =>
    setLocal((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )

  const confirm = () => {
    onSelect(local)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-background rounded-2xl shadow-2xl w-full max-w-lg mx-4 flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b flex items-center justify-between shrink-0">
          <div>
            <h3 className="font-semibold">选择要展示的片段</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              共 {conversation.turns.length} 轮 · 已选 {local.length} 轮
            </p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Turn list */}
        <ScrollArea className="flex-1 px-5 py-3">
          <div className="space-y-2">
            {conversation.turns.map((turn, index) => {
              const selected = local.includes(turn.id)
              const long = turn.content.length > 200
              const isExpanded = expanded[turn.id]
              const displayContent = long && !isExpanded ? turn.content.slice(0, 200) + "..." : turn.content

              return (
                <div
                  key={turn.id}
                  onClick={() => toggle(turn.id)}
                  className={`rounded-xl border p-3 cursor-pointer transition-all ${
                    selected ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/30"
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className={`mt-0.5 shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                      selected ? "border-primary bg-primary" : "border-muted-foreground/40"
                    }`}>
                      {selected && (
                        <svg className="w-2.5 h-2.5 text-primary-foreground" fill="none" viewBox="0 0 10 10">
                          <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={turn.role === "user" ? "outline" : "secondary"} className="text-xs">
                          {turn.role === "user" ? "你" : "AI"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">第 {index + 1} 轮</span>
                      </div>
                      <MarkdownRenderer content={displayContent} className="text-sm text-foreground" />
                      {long && (
                        <button
                          className="text-xs text-primary hover:underline"
                          onClick={(e) => {
                            e.stopPropagation()
                            setExpanded((p) => ({ ...p, [turn.id]: !p[turn.id] }))
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

        {/* Footer */}
        <div className="px-5 py-4 border-t flex justify-end gap-2 shrink-0">
          <Button variant="ghost" onClick={onClose}>取消</Button>
          <Button onClick={confirm} disabled={local.length === 0}>
            确认选择
          </Button>
        </div>
      </div>
    </div>
  )
}
