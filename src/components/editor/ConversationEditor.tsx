"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { marked } from "marked"
import { TurnEditor } from "./TurnEditor"
import type { ConversationTurn } from "@/lib/types"

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
  const [editables, setEditables] = useState<EditableTurn[]>([])
  const initKeyRef = useRef("")

  const turnsKey = initialTurns.map((t) => t.id).join(",")

  useEffect(() => {
    if (turnsKey === initKeyRef.current) return
    initKeyRef.current = turnsKey

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
    if (isFirstRender.current) { isFirstRender.current = false; return }
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
      <div className="flex-1 flex items-center justify-center p-12">
        <p className="text-muted-foreground text-sm text-center">
          导入对话后，内容将显示在这里
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 p-6">
      {isDemo && (
        <p className="text-[10px] text-muted-foreground/35 text-center select-none">
          — 示例内容，导入你的对话以替换 —
        </p>
      )}
      <AnimatePresence initial={false}>
        {editables.map(({ turn, html }, i) => (
          <motion.div
            key={turn.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.22, delay: i * 0.055, ease: "easeOut" }}
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
