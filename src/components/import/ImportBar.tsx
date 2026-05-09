"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
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
  text: "文本导入",
}

export function ImportBar({ isDemo, conversation, onImport, onSelectClips }: Props) {
  const [expanded, setExpanded] = useState(true)
  const [urlInput, setUrlInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isDemo) setExpanded(false)
  }, [isDemo])

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
      if (!res.ok) { setError(json.error ?? "解析失败"); return }
      const conv: Conversation = json.conversation
      if (!conv.turns.length) { setError("未识别到对话内容"); return }
      onImport(conv)
      setUrlInput("")
    } catch {
      setError("网络错误，请重试")
    } finally {
      setLoading(false)
    }
  }

  const handleFile = useCallback((file: File) => {
    if (!file.name.endsWith(".txt")) {
      setError("仅支持 .txt 文件")
      return
    }
    setError("")
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const conv = parseText(text)
      if (!conv.turns.length) {
        setError("未识别到对话内容，请检查格式")
        return
      }
      onImport(conv)
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
    <div className="border-b bg-background shrink-0">
      <AnimatePresence mode="wait" initial={false}>
        {expanded ? (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="p-4 space-y-3"
          >
            {/* Title row */}
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-foreground/60 tracking-wide">导入你的 AI 对话</p>
              <div className="flex items-center gap-2">
                {isDemo && (
                  <span className="text-[10px] text-muted-foreground/50 border border-border/50 rounded-full px-2 py-0.5">
                    示例
                  </span>
                )}
                {!isDemo && (
                  <button
                    onClick={() => setExpanded(false)}
                    className="text-[11px] text-muted-foreground/60 hover:text-muted-foreground transition-colors"
                  >
                    收起
                  </button>
                )}
              </div>
            </div>

            {/* URL import */}
            <div className="space-y-1.5">
              <p className="text-[11px] text-muted-foreground/70 flex items-center gap-1.5">
                <span>🔗</span>粘贴分享链接
              </p>
              <div className="flex gap-2">
                <input
                  className="flex-1 h-8 rounded-lg border bg-muted/40 px-3 text-xs placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="DeepSeek · ChatGPT · Claude 分享链接..."
                  value={urlInput}
                  onChange={(e) => { setUrlInput(e.target.value); setError("") }}
                  onKeyDown={(e) => e.key === "Enter" && handleParse()}
                />
                <button
                  onClick={handleParse}
                  disabled={loading || !urlInput.trim()}
                  className="shrink-0 h-8 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-medium disabled:opacity-40 hover:bg-primary/90 transition-colors"
                >
                  {loading ? "…" : "解析"}
                </button>
              </div>
            </div>

            {/* File import */}
            <div className="space-y-1.5">
              <p className="text-[11px] text-muted-foreground/70 flex items-center gap-1.5">
                <span>📄</span>导入 .txt 文件
              </p>
              <motion.div
                animate={{
                  backgroundColor: isDragOver ? "hsl(var(--primary) / 0.06)" : "hsl(var(--muted) / 0.3)",
                  borderColor: isDragOver ? "hsl(var(--primary) / 0.5)" : "hsl(var(--border))",
                }}
                transition={{ duration: 0.12 }}
                className="rounded-lg border-2 border-dashed p-3.5 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
              >
                <p className="text-xs text-muted-foreground">
                  拖拽 .txt 文件至此，或<span className="text-primary font-medium"> 点击选择</span>
                </p>
                <p className="text-[10px] text-muted-foreground/40 mt-0.5">
                  格式：AI: / 人类: 开头，支持连续多条
                </p>
              </motion.div>
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

            {error && (
              <p className="text-[11px] text-destructive">{error}</p>
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
            <div className="flex-1 flex items-center gap-1.5 min-w-0 overflow-hidden">
              {platform && (
                <span className="text-[11px] font-medium text-foreground/60 shrink-0">{platform}</span>
              )}
              <span className="text-[11px] text-muted-foreground/50 truncate">· {turnCount} 条对话</span>
            </div>
            <button
              onClick={() => setExpanded(true)}
              className="shrink-0 text-[11px] text-muted-foreground hover:text-foreground border border-border rounded-md px-2.5 py-1 transition-colors"
            >
              重新导入
            </button>
            <button
              onClick={onSelectClips}
              className="shrink-0 text-[11px] text-primary hover:text-primary/80 border border-primary/30 rounded-md px-2.5 py-1 transition-colors"
            >
              选片段
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
