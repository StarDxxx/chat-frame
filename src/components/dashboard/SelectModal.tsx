"use client"

import { useState } from "react"
import { Check, X } from "lucide-react"
import type { Conversation } from "@/lib/types"
import { useLocale } from "@/lib/i18n"

interface Props {
  conversation: Conversation
  selectedIds: string[]
  onSelect: (ids: string[]) => void
  onClose: () => void
}

function stripMarkdown(text: string): string {
  return text
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[.*?\]\(.*?\)/g, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_~>]/g, "")
    .replace(/\n+/g, " ")
    .trim()
}

export function SelectModal({ conversation, selectedIds, onSelect, onClose }: Props) {
  const { t } = useLocale()
  const [local, setLocal] = useState<string[]>(selectedIds)

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
      <div className="absolute inset-0 bg-stone-950/55 backdrop-blur-[2px]" onClick={onClose} />

      <div className="newsprint-panel relative mx-4 flex max-h-[82vh] w-full max-w-2xl flex-col overflow-hidden">
        <div className="flex shrink-0 items-start justify-between gap-4 border-b-2 border-foreground bg-[var(--paper)] px-5 py-4">
          <div>
            <h3 className="font-editorial text-2xl font-black leading-none">{t("select.title")}</h3>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
              {t("select.summary", { total: conversation.turns.length, selected: local.length })}
            </p>
          </div>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center border-2 border-foreground bg-background hover:bg-foreground hover:text-background"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          <div className="space-y-2">
            {conversation.turns.map((turn, index) => {
              const selected = local.includes(turn.id)
              const preview = stripMarkdown(turn.content)

              return (
                <button
                  key={turn.id}
                  onClick={() => toggle(turn.id)}
                  className={`group block w-full border-2 p-3 text-left transition-transform ${
                    selected
                      ? "border-foreground bg-[var(--accent)] proof-shadow"
                      : "border-foreground bg-background hover:-translate-x-0.5 hover:-translate-y-0.5 hover:ink-shadow"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center border-2 border-foreground ${
                      selected ? "bg-foreground text-background" : "bg-[var(--paper-soft)]"
                    }`}>
                      {selected && <Check className="h-3.5 w-3.5" />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1.5 flex flex-wrap items-center gap-2">
                        <span className="border border-foreground bg-[var(--paper-soft)] px-2 py-0.5 text-[10px] font-black uppercase">
                          {turn.role === "user" ? t("select.prompt") : t("select.response")}
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground">
                          {t("select.turn", { n: index + 1 })}
                        </span>
                      </div>
                      <p className="line-clamp-1 text-sm text-foreground group-hover:line-clamp-4">
                        {preview}
                      </p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex shrink-0 justify-end gap-2 border-t-2 border-foreground bg-[var(--paper)] px-5 py-4">
          <button
            onClick={onClose}
            className="border-2 border-foreground bg-background px-4 py-2 text-xs font-black uppercase hover:bg-muted"
          >
            {t("select.cancel")}
          </button>
          <button
            onClick={confirm}
            disabled={local.length === 0}
            className="border-2 border-foreground bg-foreground px-4 py-2 text-xs font-black uppercase text-background transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:proof-shadow disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t("select.confirm")}
          </button>
        </div>
      </div>
    </div>
  )
}
