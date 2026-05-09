"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CardPreview } from "@/components/card/CardPreview"
import { THEMES } from "@/lib/themes"
import type { ConversationTurn, EmotionThemeId, PlatformId } from "@/lib/types"

interface Props {
  turns: ConversationTurn[]
  themeId: EmotionThemeId
  platform?: PlatformId
  onThemeChange: (id: EmotionThemeId) => void
  onBack: () => void
  onRestart: () => void
}

export function PreviewStep({ turns, themeId, platform, onThemeChange, onBack, onRestart }: Props) {
  const [exporting, setExporting] = useState(false)

  const handleExport = async () => {
    setExporting(true)
    try {
      const { toPng } = await import("html-to-image")
      const el = document.getElementById("card-export")
      if (!el) return
      const dataUrl = await toPng(el, { pixelRatio: 3 })
      const link = document.createElement("a")
      link.download = "ai-emo-card.png"
      link.href = dataUrl
      link.click()
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="border-b px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="font-semibold">预览与导出</h2>
          <p className="text-xs text-muted-foreground mt-0.5">确认效果后一键导出图片</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={onBack}>
            ← 返回
          </Button>
          <Button variant="outline" size="sm" onClick={onRestart}>
            重新开始
          </Button>
          <Button size="sm" onClick={handleExport} disabled={exporting}>
            {exporting ? "导出中..." : "导出图片"}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-8 px-6 py-8 max-w-5xl mx-auto w-full">
        {/* Card preview */}
        <div className="flex-1 flex items-start justify-center">
          <div className="w-full max-w-sm">
            <CardPreview turns={turns} themeId={themeId} platform={platform} settings={{ showAvatars: true, showFooter: true, sizeId: "xiaohongshu", layoutFlow: "bottom-up", fontSize: 12, avatarUser: "我", avatarAI: "" }} />
          </div>
        </div>

        {/* Theme switcher sidebar */}
        <div className="w-full lg:w-56 space-y-3 shrink-0">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">切换主题</p>
          {THEMES.map((theme) => (
            <button
              key={theme.id}
              onClick={() => onThemeChange(theme.id)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all text-left
                ${themeId === theme.id ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/40"}
              `}
            >
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${theme.gradient} shrink-0`} />
              <div>
                <p className="text-sm font-medium">{theme.label}</p>
                <p className="text-xs text-muted-foreground">{theme.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
