"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { Conversation } from "@/lib/types"

interface Props {
  onImport: (conversation: Conversation) => void
}

export function ImportStep({ onImport }: Props) {
  const [input, setInput] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    const trimmed = input.trim()
    if (!trimmed) {
      setError("请粘贴对话链接或内容")
      return
    }

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
        setError(json.error ?? "解析失败，请检查链接或内容格式")
        return
      }
      const conversation: Conversation = json.conversation
      if (conversation.turns.length === 0) {
        setError("未能识别对话内容，请检查格式")
        return
      }
      onImport(conversation)
    } catch {
      setError("网络错误，请稍后重试")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-xl space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">AI 对话卡片</h1>
          <p className="text-muted-foreground text-sm">
            粘贴 ChatGPT / Claude / DeepSeek 分享链接，或直接粘贴对话文本
          </p>
        </div>

        <div className="space-y-3">
          <Textarea
            placeholder={`粘贴分享链接，例如：\nhttps://chat.deepseek.com/share/...\n\n或直接粘贴对话内容`}
            className="min-h-[180px] resize-none text-sm font-mono"
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              setError("")
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit()
            }}
          />
          {error && <p className="text-destructive text-xs">{error}</p>}
          <Button className="w-full" onClick={handleSubmit} disabled={loading}>
            {loading ? "解析中..." : "解析对话 →"}
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          内容仅在本地处理，不会上传或存储
        </p>
      </div>
    </div>
  )
}
