"use client"

import { useCallback, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { FileText, Link2, Loader2, RotateCcw, Scissors, Upload } from "lucide-react"
import type { Conversation } from "@/lib/types"
import { parseText } from "@/lib/parser"

interface Props {
  isDemo: boolean
  conversation: Conversation
  onImport: (conversation: Conversation) => void
  onSelectClips: () => void
}

const PLATFORM_LABEL: Record<string, string> = {
  deepseek: "DeepSeek",
  chatgpt: "ChatGPT",
  claude: "Claude",
  text: "Text import",
}

export function ImportBar({ isDemo, conversation, onImport, onSelectClips }: Props) {
  const [expanded, setExpanded] = useState(true)
  const [urlInput, setUrlInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleParse = async () => {
    const trimmed = urlInput.trim()
    if (!trimmed) return
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: trimmed }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error ?? "Parse failed")
        return
      }
      const conv: Conversation = json.conversation
      if (!conv.turns.length) {
        setError("No dialogue turns were found.")
        return
      }
      onImport(conv)
      setExpanded(false)
      setUrlInput("")
    } catch {
      setError("Network error. Try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleFile = useCallback((file: File) => {
    if (!file.name.endsWith(".txt")) {
      setError("Only .txt files are supported.")
      return
    }
    setError("")
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const conv = parseText(text)
      if (!conv.turns.length) {
        setError("No dialogue turns were found. Check the text format.")
        return
      }
      onImport(conv)
      setExpanded(false)
    }
    reader.readAsText(file)
  }, [onImport])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const platform = conversation.platform ? (PLATFORM_LABEL[conversation.platform] ?? conversation.platform) : null
  const turnCount = conversation.turns.length

  return (
    <div className="shrink-0 border-b-2 border-foreground bg-[var(--paper-soft)]">
      <AnimatePresence mode="wait" initial={false}>
        {expanded ? (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="space-y-3 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-editorial text-xl font-black leading-none">Import a conversation</p>
                <p className="mt-1 text-[11px] font-semibold text-muted-foreground">
                  Paste a share link, or drop a prepared transcript.
                </p>
              </div>
              {isDemo ? (
                <span className="border border-foreground bg-[var(--accent)] px-2 py-0.5 text-[10px] font-black uppercase">
                  sample
                </span>
              ) : (
                <button
                  onClick={() => setExpanded(false)}
                  className="border border-foreground px-2 py-1 text-[11px] font-bold uppercase hover:bg-foreground hover:text-background"
                >
                  Collapse
                </button>
              )}
            </div>

            <div className="grid gap-3 lg:grid-cols-[1.3fr_1fr]">
              <div className="border-2 border-foreground bg-background p-3">
                <label className="mb-2 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em]">
                  <Link2 className="h-3.5 w-3.5" />
                  Share link
                </label>
                <div className="flex gap-2">
                  <input
                    className="h-9 min-w-0 flex-1 border-2 border-foreground bg-[var(--paper-soft)] px-3 text-xs font-semibold placeholder:text-muted-foreground/55 focus:outline-none focus:ring-2 focus:ring-[var(--proof)]"
                    placeholder="DeepSeek / ChatGPT / Claude share URL"
                    value={urlInput}
                    onChange={(e) => { setUrlInput(e.target.value); setError("") }}
                    onKeyDown={(e) => e.key === "Enter" && handleParse()}
                  />
                  <button
                    onClick={handleParse}
                    disabled={loading || !urlInput.trim()}
                    className="grid h-9 w-10 place-items-center border-2 border-foreground bg-foreground text-background transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:proof-shadow disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Parse share link"
                    title="Parse"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div
                className={`border-2 border-dashed p-3 transition-colors ${
                  isDragOver
                    ? "border-[var(--proof)] bg-[var(--accent)]"
                    : "border-foreground bg-background"
                }`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
              >
                <div className="mb-2 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em]">
                  <FileText className="h-3.5 w-3.5" />
                  Transcript file
                </div>
                <p className="text-xs font-semibold text-muted-foreground">
                  Drop a .txt file here, or click to choose one.
                </p>
                <p className="mt-1 text-[10px] text-muted-foreground/70">
                  Supports AI: / Human: turns and alternating blocks.
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) handleFile(f)
                    e.target.value = ""
                  }}
                />
              </div>
            </div>

            {error && (
              <p className="border-l-4 border-[var(--proof)] bg-[var(--proof)]/10 px-3 py-2 text-xs font-bold text-[var(--proof)]">
                {error}
              </p>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="compact"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-2 px-4 py-2.5"
          >
            <div className="min-w-0 flex-1 overflow-hidden">
              <p className="truncate text-xs font-black uppercase tracking-[0.16em]">
                {platform ?? "Imported copy"} / {turnCount} turns
              </p>
            </div>
            <button
              onClick={() => setExpanded(true)}
              className="flex items-center gap-1.5 border border-foreground px-2.5 py-1 text-[11px] font-bold uppercase hover:bg-foreground hover:text-background"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reimport
            </button>
            <button
              onClick={onSelectClips}
              className="flex items-center gap-1.5 border-2 border-foreground bg-[var(--accent)] px-2.5 py-1 text-[11px] font-black uppercase transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:ink-shadow"
            >
              <Scissors className="h-3.5 w-3.5" />
              Select
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
