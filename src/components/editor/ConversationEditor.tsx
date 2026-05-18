"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { marked } from "marked"
import { TurnEditor } from "./TurnEditor"
import type { ConversationTurn } from "@/lib/types"
import { useLocale } from "@/lib/i18n"

interface EditableTurn {
  turn: ConversationTurn
  html: string
}

interface Props {
  initialTurns: ConversationTurn[]
  isDemo?: boolean
  avatarUser?: string
  avatarAI?: string
  onChange: (turns: ConversationTurn[]) => void
}

async function mdToHtml(md: string): Promise<string> {
  return await marked.parse(md)
}

export function ConversationEditor({ initialTurns, isDemo, avatarUser, avatarAI, onChange }: Props) {
  const { t } = useLocale()
  const [editables, setEditables] = useState<EditableTurn[]>([])

  const turnsKey = initialTurns.map((t) => t.id).join(",")

  useEffect(() => {
    let cancelled = false
    Promise.all(
      initialTurns.map(async (turn) => ({
        turn,
        html: await mdToHtml(turn.content),
      }))
    ).then((result) => {
      if (!cancelled) setEditables(result)
    })
    return () => { cancelled = true }
  }, [turnsKey, initialTurns])

  const isFirstRender = useRef(true)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    onChange(editables.map((e) => ({ ...e.turn, content: e.html })))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editables])

  const handleChange = (id: string, html: string) => {
    setEditables((prev) => prev.map((e) => e.turn.id === id ? { ...e, html } : e))
  }

  const handleDelete = (id: string) => {
    setEditables((prev) => prev.filter((e) => e.turn.id !== id))
  }

  if (editables.length === 0) {
    return (
      <div className="flex min-h-full items-center justify-center p-12">
        <div className="max-w-xs border-2 border-foreground bg-[var(--paper-soft)] p-5 text-center ink-shadow">
          <p className="font-editorial text-xl font-black">{t("editor.emptyTitle")}</p>
          <p className="mt-2 text-xs font-semibold text-muted-foreground">
            {t("editor.emptySubtitle")}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1.5 p-2">
      {isDemo && (
        <div className="mx-auto border border-foreground bg-[var(--accent)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em]">
          {t("editor.sampleBanner")}
        </div>
      )}
      <AnimatePresence initial={false}>
        {editables.map(({ turn, html }, i) => (
          <motion.div
            key={turn.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0 } }}
            transition={{ duration: 0.22, delay: i * 0.04, ease: "easeOut" }}
          >
            <TurnEditor
              turn={turn}
              initialHtml={html}
              avatarUser={avatarUser}
              avatarAI={avatarAI}
              onChange={(newHtml) => handleChange(turn.id, newHtml)}
              onDelete={() => handleDelete(turn.id)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
