"use client"

import { useState } from "react"
import { ImageDown, Settings2, Type } from "lucide-react"
import { CardPreview } from "@/components/card/CardPreview"
import { MemoPreview } from "@/components/memo/MemoPreview"
import { WeChatPreview } from "@/components/chat/WeChatPreview"
import { WhatsAppPreview } from "@/components/chat/WhatsAppPreview"
import { ClassicPreview } from "@/components/classic/ClassicPreview"
import type { ClassicVariant } from "@/components/classic/ClassicPreview"
import { THEMES } from "@/lib/themes"
import { CARD_SIZES, getCardSize } from "@/lib/card-sizes"
import type { CardSettings, CardSizeId, ConversationTurn, EmotionThemeId, PlatformId, ThemeCategoryId } from "@/lib/types"
import { useLocale } from "@/lib/i18n"

type ChatVariant = "wechat" | "whatsapp" | "imessage"

const CHAT_VARIANTS: { id: ChatVariant; label: string }[] = [
  { id: "wechat", label: "WeChat" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "imessage", label: "iMessage" },
]

const CLASSIC_VARIANTS: { id: ClassicVariant; label: string }[] = [
  { id: "claude", label: "Claude" },
  { id: "chatgpt", label: "ChatGPT" },
  { id: "deepseek", label: "DeepSeek" },
]

const THEME_CATEGORY_IDS: ThemeCategoryId[] = ["card", "classic", "chat-app"]

const SIZE_I18N_KEY: Record<CardSizeId, string> = {
  square: "square",
  xiaohongshu: "xiaohongshu",
  "xiaohongshu-long": "xiaohongshuLong",
  douyin: "douyin",
}

interface Props {
  turns: ConversationTurn[]
  themeCategory: ThemeCategoryId
  themeId: EmotionThemeId
  platform?: PlatformId
  settings: CardSettings
  onThemeCategoryChange: (id: ThemeCategoryId) => void
  onThemeChange: (id: EmotionThemeId) => void
  onSizeChange: (id: CardSizeId) => void
  onSettingsChange: (patch: Partial<CardSettings>) => void
  onExport: () => void
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3">
      <span className="text-xs font-bold text-muted-foreground">{label}</span>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-5 w-9 border-2 border-foreground transition-colors ${
          checked ? "bg-[var(--proof)]" : "bg-background"
        }`}
      >
        <span className={`absolute left-0.5 top-0.5 h-3 w-3 bg-foreground transition-transform ${
          checked ? "translate-x-4 bg-background" : "translate-x-0"
        }`} />
      </button>
    </label>
  )
}

export function PreviewPanel({
  turns,
  themeCategory,
  themeId,
  platform,
  settings,
  onThemeCategoryChange,
  onThemeChange,
  onSizeChange,
  onSettingsChange,
  onExport,
}: Props) {
  const { t } = useLocale()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [chatVariant, setChatVariant] = useState<ChatVariant>("imessage")
  const [classicVariant, setClassicVariant] = useState<ClassicVariant>("claude")

  const size = getCardSize(settings.sizeId)
  const [rw, rh] = size.ratio.split("/").map(Number)

  // Chat App uses a fixed iPhone 17 screen width regardless of the size selector
  const IPHONE_WIDTH = 390
  const isChatApp = themeCategory === "chat-app"
  const cardWidth = isChatApp ? IPHONE_WIDTH : size.previewWidth

  // Card wrapper has p-2 (8px each side), so inner card width = cardWidth - 16
  const innerWidth = cardWidth - 16
  const minHeight = isChatApp
    ? Math.round(innerWidth * 844 / 390)   // iPhone 390×844 logical resolution
    : Math.round(innerWidth * rh / rw)

  const categoryLabel = (id: ThemeCategoryId) => {
    if (id === "card") return t("preview.card")
    if (id === "classic") return t("preview.classic")
    return t("preview.chatApp")
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex min-h-0 flex-1 flex-col items-center gap-4 overflow-y-auto bg-[var(--paper)] p-6">
        <div
          className="border-2 border-foreground bg-background p-2 ink-shadow"
          style={{ width: cardWidth }}
        >
          {themeCategory === "chat-app" ? (
            chatVariant === "wechat"
              ? <WeChatPreview turns={turns} platform={platform} settings={settings} minHeight={minHeight} />
              : chatVariant === "whatsapp"
                ? <WhatsAppPreview turns={turns} platform={platform} settings={settings} minHeight={minHeight} />
                : <MemoPreview turns={turns} platform={platform} settings={settings} minHeight={minHeight} />
          ) : themeCategory === "classic" ? (
            <ClassicPreview variant={classicVariant} turns={turns} platform={platform} settings={settings} minHeight={minHeight} />
          ) : (
            <CardPreview
              turns={turns}
              themeId={themeId}
              platform={platform}
              settings={settings}
              minHeight={minHeight}
            />
          )}
        </div>
      </div>

      <div className="shrink-0 space-y-2 border-t-2 border-foreground bg-[var(--paper-soft)] p-3">
        <div className="flex gap-1.5 overflow-x-auto pb-0.5">
          {THEME_CATEGORY_IDS.map((id) => (
            <button
              key={id}
              onClick={() => onThemeCategoryChange(id)}
              className={`shrink-0 border-2 border-foreground px-3 py-1 text-xs font-black uppercase transition-transform ${
                themeCategory === id
                  ? "bg-foreground text-background"
                  : "bg-background text-foreground hover:-translate-x-0.5 hover:-translate-y-0.5 hover:ink-shadow"
              }`}
            >
              {categoryLabel(id)}
            </button>
          ))}
        </div>

        {themeCategory === "chat-app" && (
          <div className="flex gap-1.5 overflow-x-auto pb-0.5">
            {CHAT_VARIANTS.map((v) => (
              <button
                key={v.id}
                onClick={() => setChatVariant(v.id)}
                className={`shrink-0 border border-foreground px-3 py-1 text-xs font-bold uppercase ${
                  chatVariant === v.id ? "bg-[var(--accent)]" : "bg-background hover:bg-muted"
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
        )}

        {themeCategory === "card" && (
          <div className="flex gap-2 overflow-x-auto pb-0.5">
            {THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => onThemeChange(theme.id as EmotionThemeId)}
                className={`flex shrink-0 items-center gap-2 border border-foreground px-2 py-1 text-xs font-bold uppercase ${
                  themeId === theme.id ? "bg-[var(--accent)]" : "bg-background hover:bg-muted"
                }`}
              >
                <span className={`h-4 w-4 border border-foreground bg-gradient-to-br ${theme.gradient}`} />
                {t(`themes.${theme.id}`)}
              </button>
            ))}
          </div>
        )}

        {themeCategory === "classic" && (
          <div className="flex gap-1.5 overflow-x-auto pb-0.5">
            {CLASSIC_VARIANTS.map((v) => (
              <button
                key={v.id}
                onClick={() => setClassicVariant(v.id)}
                className={`shrink-0 border border-foreground px-3 py-1 text-xs font-bold uppercase ${
                  classicVariant === v.id ? "bg-[var(--accent)]" : "bg-background hover:bg-muted"
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
        )}

        {/* Width selector — hidden for Chat App (fixed iPhone width) */}
        {!isChatApp && (
          <div className="flex gap-1.5 overflow-x-auto pb-0.5">
            {CARD_SIZES.map((s) => (
              <button
                key={s.id}
                onClick={() => onSizeChange(s.id)}
                title={`${s.previewWidth}px`}
                className={`shrink-0 border border-foreground px-3 py-1 text-xs font-bold uppercase ${
                  settings.sizeId === s.id ? "bg-foreground text-background" : "bg-background hover:bg-muted"
                }`}
              >
                {t(`size.${SIZE_I18N_KEY[s.id]}`)}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setSettingsOpen((v) => !v)}
              className="grid h-9 w-9 place-items-center border-2 border-foreground bg-background hover:bg-foreground hover:text-background"
              aria-label="Card settings"
              title="Settings"
            >
              <Settings2 className="h-4 w-4" />
            </button>

            {settingsOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setSettingsOpen(false)} />
                <div className="absolute bottom-full left-0 z-20 mb-2 w-56 space-y-3 border-2 border-foreground bg-[var(--paper-soft)] p-3 ink-shadow">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                      <Type className="h-3.5 w-3.5" />
                      {t("preview.typeSize")}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onSettingsChange({ fontSize: Math.max(10, settings.fontSize - 1) })}
                        className="grid h-6 w-6 place-items-center border border-foreground hover:bg-foreground hover:text-background"
                      >
                        -
                      </button>
                      <span className="w-10 text-center text-xs font-black tabular-nums">{settings.fontSize}px</span>
                      <button
                        onClick={() => onSettingsChange({ fontSize: Math.min(22, settings.fontSize + 1) })}
                        className="grid h-6 w-6 place-items-center border border-foreground hover:bg-foreground hover:text-background"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <Toggle
                    label={t("preview.showAvatars")}
                    checked={settings.showAvatars}
                    onChange={(v) => onSettingsChange({ showAvatars: v })}
                  />
                  {settings.showAvatars && (
                    <div className="grid grid-cols-2 gap-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.12em] text-muted-foreground">
                        {t("preview.userLabel")}
                        <input
                          className="mt-1 h-7 w-full border border-foreground bg-background px-1.5 text-center text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[var(--proof)]"
                          maxLength={4}
                          placeholder="Me"
                          value={settings.avatarUser}
                          onChange={(e) => onSettingsChange({ avatarUser: e.target.value })}
                        />
                      </label>
                      <label className="text-[10px] font-black uppercase tracking-[0.12em] text-muted-foreground">
                        {t("preview.aiLabel")}
                        <input
                          className="mt-1 h-7 w-full border border-foreground bg-background px-1.5 text-center text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[var(--proof)]"
                          maxLength={4}
                          placeholder="AI"
                          value={settings.avatarAI}
                          onChange={(e) => onSettingsChange({ avatarAI: e.target.value })}
                        />
                      </label>
                    </div>
                  )}
                  <Toggle
                    label={t("preview.showFooter")}
                    checked={settings.showFooter}
                    onChange={(v) => onSettingsChange({ showFooter: v })}
                  />
                </div>
              </>
            )}
          </div>

          <button
            onClick={onExport}
            className="flex h-9 flex-1 items-center justify-center gap-2 border-2 border-foreground bg-foreground text-xs font-black uppercase text-background transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:proof-shadow"
          >
            <ImageDown className="h-4 w-4" />
            {t("preview.exportPng")}
          </button>
        </div>
      </div>
    </div>
  )
}
