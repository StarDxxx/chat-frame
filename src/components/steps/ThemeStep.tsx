"use client"

import { Button } from "@/components/ui/button"
import { THEMES } from "@/lib/themes"
import type { EmotionThemeId } from "@/lib/types"

interface Props {
  selected: EmotionThemeId
  onSelect: (id: EmotionThemeId) => void
  onBack: () => void
  onNext: () => void
}

export function ThemeStep({ selected, onSelect, onBack, onNext }: Props) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="border-b px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="font-semibold">选择情绪主题</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            定义这段对话的情绪语境
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={onBack}>
            ← 返回
          </Button>
          <Button size="sm" onClick={onNext}>
            生成卡片 →
          </Button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {THEMES.map((theme) => (
            <button
              key={theme.id}
              onClick={() => onSelect(theme.id)}
              className={`
                relative rounded-2xl overflow-hidden h-32 text-left transition-all
                ${selected === theme.id ? "ring-2 ring-offset-2 ring-primary scale-[1.02]" : "hover:scale-[1.01]"}
              `}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient}`} />
              <div className="absolute inset-0 bg-black/10" />
              <div className="relative p-4 h-full flex flex-col justify-end">
                <p className="text-white font-bold text-lg leading-tight drop-shadow">
                  {theme.label}
                </p>
                <p className="text-white/70 text-xs mt-0.5">{theme.description}</p>
              </div>
              {selected === theme.id && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-white flex items-center justify-center">
                  <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 10 10">
                    <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
