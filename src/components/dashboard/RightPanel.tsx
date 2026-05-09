"use client"

import { Separator } from "@/components/ui/separator"
import type { CardSettings } from "@/lib/types"

interface Props {
  settings: CardSettings
  onChange: (patch: Partial<CardSettings>) => void
}

function Toggle({ label, description, checked, onChange }: {
  label: string
  description?: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <div className="min-w-0">
        <p className="text-sm font-medium">{label}</p>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`
          relative shrink-0 w-9 h-5 rounded-full transition-colors overflow-hidden
          ${checked ? "bg-primary" : "bg-muted"}
        `}
      >
        <span
          className={`
            absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform
            ${checked ? "translate-x-4" : "translate-x-0"}
          `}
        />
      </button>
    </div>
  )
}

export function RightPanel({ settings, onChange }: Props) {
  return (
    <div className="flex flex-col gap-1 p-4">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-2">
        卡片设置
      </p>

      <div className="rounded-xl border bg-card px-4 divide-y">
        <div>
          <Toggle
            label="显示头像"
            checked={settings.showAvatars}
            onChange={(v) => onChange({ showAvatars: v })}
          />
          {settings.showAvatars && (
            <div className="flex gap-2 pb-3 -mt-1">
              <div className="flex-1 flex flex-col gap-1">
                <p className="text-[10px] text-muted-foreground">用户</p>
                <input
                  className="h-7 w-full rounded-lg border bg-muted/40 px-2 text-xs text-center focus:outline-none focus:ring-1 focus:ring-primary"
                  maxLength={4}
                  placeholder="我"
                  value={settings.avatarUser}
                  onChange={(e) => onChange({ avatarUser: e.target.value })}
                />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <p className="text-[10px] text-muted-foreground">AI</p>
                <input
                  className="h-7 w-full rounded-lg border bg-muted/40 px-2 text-xs text-center focus:outline-none focus:ring-1 focus:ring-primary"
                  maxLength={4}
                  placeholder="AI"
                  value={settings.avatarAI}
                  onChange={(e) => onChange({ avatarAI: e.target.value })}
                />
              </div>
            </div>
          )}
        </div>
        <Toggle
          label="显示底部标签"
          description="情绪主题名称"
          checked={settings.showFooter}
          onChange={(v) => onChange({ showFooter: v })}
        />
      </div>

      <Separator className="my-3" />

      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-2">
        关于
      </p>
      <p className="text-xs text-muted-foreground px-1 leading-relaxed">
        将 AI 对话转化为可传播的情绪卡片。
        支持 DeepSeek · ChatGPT · Claude。
      </p>
    </div>
  )
}
