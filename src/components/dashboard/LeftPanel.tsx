"use client"

import { THEMES } from "@/lib/themes"
import type { EmotionThemeId } from "@/lib/types"

interface Props {
  selected: EmotionThemeId
  onSelect: (id: EmotionThemeId) => void
}

export function LeftPanel({ selected, onSelect }: Props) {
  return (
    <div className="flex flex-col gap-2 p-4">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-1">
        情绪主题
      </p>
      {THEMES.map((theme) => (
        <button
          key={theme.id}
          onClick={() => onSelect(theme.id)}
          className={`
            relative w-full rounded-xl overflow-hidden h-16 text-left transition-all
            ${selected === theme.id ? "ring-2 ring-primary ring-offset-1 scale-[1.02]" : "hover:scale-[1.01] opacity-80 hover:opacity-100"}
          `}
        >
          <div className={`absolute inset-0 bg-gradient-to-r ${theme.gradient}`} />
          <div className="relative px-3 h-full flex flex-col justify-center">
            <p className="text-white font-semibold text-sm drop-shadow">{theme.label}</p>
            <p className="text-white/70 text-[10px]">{theme.description}</p>
          </div>
          {selected === theme.id && (
            <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-white/90 flex items-center justify-center">
              <svg className="w-2.5 h-2.5 text-primary" fill="none" viewBox="0 0 10 10">
                <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}
        </button>
      ))}
    </div>
  )
}
