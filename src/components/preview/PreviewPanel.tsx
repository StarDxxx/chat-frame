"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, ImageDown, Settings2, Type } from "lucide-react"
import { CardPreview } from "@/components/card/CardPreview"
import { MemoPreview } from "@/components/memo/MemoPreview"
import { WeChatPreview } from "@/components/chat/WeChatPreview"
import { WhatsAppPreview } from "@/components/chat/WhatsAppPreview"
import { ClassicPreview } from "@/components/classic/ClassicPreview"
import type { ClassicVariant } from "@/components/classic/ClassicPreview"
import { THEMES } from "@/lib/themes"
import { CARD_SIZES, getCardSize } from "@/lib/card-sizes"
import type { CardSettings, CardSizeId, ConversationTurn, EmotionThemeId, PlatformId, ThemeCategoryId } from "@/lib/types"

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

const THEME_CATEGORIES: { id: ThemeCategoryId; label: string }[] = [
  { id: "card", label: "Editorial card" },
  { id: "chat-app", label: "Chat app" },
  { id: "classic", label: "Native AI" },
]

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

function isHtml(content: string) {
  return content.trimStart().startsWith("<")
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
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [chatVariant, setChatVariant] = useState<ChatVariant>("wechat")
  const [classicVariant, setClassicVariant] = useState<ClassicVariant>("claude")
  const [currentPage, setCurrentPage] = useState(0)
  const [pageOffsets, setPageOffsets] = useState<number[]>([0])
  const [rawAvail, setRawAvail] = useState(0)
  const [cardDims, setCardDims] = useState({ w: 0, h: 0 })

  const cardWrapperRef = useRef<HTMLDivElement>(null)
  const rulerRef = useRef<HTMLDivElement>(null)

  const size = getCardSize(settings.sizeId)
  const aspectRatio = themeCategory === "chat-app" ? "9/19" : size.ratio

  useEffect(() => {
    const el = cardWrapperRef.current
    if (!el) return
    const obs = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setCardDims({ w: Math.round(width), h: Math.round(height) })
    })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useLayoutEffect(() => {
    if (!rulerRef.current || cardDims.h === 0 || themeCategory !== "card") return
    const rulerEl = rulerRef.current
    const children = Array.from(rulerEl.children)
    if (children.length !== turns.length || children.length === 0) {
      setPageOffsets([0])
      return
    }

    const rulerTop = rulerEl.getBoundingClientRect().top
    const lastChild = children[children.length - 1] as HTMLElement
    const totalH = lastChild.getBoundingClientRect().bottom - rulerTop
    const paddingV = 48
    const footerH = settings.showFooter ? 38 : 0
    const avail = Math.max(1, cardDims.h - paddingV - footerH)
    const lineH = settings.fontSize * 1.625
    const bubblePad = 12

    const safeCuts: number[] = []
    for (const child of children) {
      const turnEl = child as HTMLElement
      const bubbleEl = turnEl.children[turnEl.children.length - 1] as HTMLElement
      if (!bubbleEl) continue
      const r = bubbleEl.getBoundingClientRect()
      const top = r.top - rulerTop
      const bottom = r.bottom - rulerTop
      for (let y = top + bubblePad + lineH; y <= bottom - bubblePad + 0.5; y += lineH) {
        safeCuts.push(y)
      }
      safeCuts.push(bottom)
    }
    safeCuts.sort((a, b) => a - b)

    const offsets: number[] = [0]
    let pos = 0
    while (pos < totalH - 1) {
      const target = pos + avail
      if (target >= totalH) break
      const candidates = safeCuts.filter((y) => y > pos && y <= target)
      const next = candidates.length > 0 ? Math.max(...candidates) : target
      if (next <= pos) break
      offsets.push(next)
      pos = next
    }

    setPageOffsets(offsets)
    setRawAvail(avail)
    setCurrentPage((prev) => Math.min(prev, offsets.length - 1))
  }, [turns, cardDims.w, cardDims.h, settings.fontSize, settings.showFooter, settings.showAvatars, themeCategory])

  const totalPages = pageOffsets.length
  const currentOffset = pageOffsets[currentPage] ?? 0
  const nextOffset = pageOffsets[currentPage + 1]
  const currentViewportH = nextOffset !== undefined ? nextOffset - currentOffset : rawAvail
  const pageOffset = totalPages > 1 ? currentOffset : undefined
  const pageViewportH = totalPages > 1 ? currentViewportH : undefined
  const rulerWidth = cardDims.w > 0 ? cardDims.w - 48 : 240

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 overflow-hidden bg-[var(--paper)] p-6">
        <div
          ref={cardWrapperRef}
          className="max-h-full max-w-full border-2 border-foreground bg-background p-2 ink-shadow"
          style={{ aspectRatio }}
        >
          {themeCategory === "chat-app" ? (
            chatVariant === "wechat"
              ? <WeChatPreview turns={turns} platform={platform} settings={settings} />
              : chatVariant === "whatsapp"
                ? <WhatsAppPreview turns={turns} platform={platform} settings={settings} />
                : <MemoPreview turns={turns} platform={platform} settings={settings} />
          ) : themeCategory === "classic" ? (
            <ClassicPreview variant={classicVariant} turns={turns} platform={platform} settings={settings} />
          ) : (
            <CardPreview
              turns={turns}
              themeId={themeId}
              platform={platform}
              settings={settings}
              pageOffset={pageOffset}
              pageViewportHeight={pageViewportH}
            />
          )}
        </div>

        {themeCategory === "card" && pageOffsets.length > 1 && (
          <div className="flex items-center gap-2 border-2 border-foreground bg-[var(--paper-soft)] p-1 ink-shadow">
            <button
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="grid h-7 w-7 place-items-center hover:bg-foreground hover:text-background disabled:opacity-25"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-1 px-1">
              {pageOffsets.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`h-2 border border-foreground transition-all ${
                    i === currentPage ? "w-5 bg-[var(--proof)]" : "w-2 bg-background"
                  }`}
                  aria-label={`Go to page ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={() => setCurrentPage((p) => Math.min(pageOffsets.length - 1, p + 1))}
              disabled={currentPage === pageOffsets.length - 1}
              className="grid h-7 w-7 place-items-center hover:bg-foreground hover:text-background disabled:opacity-25"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <div
        ref={rulerRef}
        className="fixed pointer-events-none overflow-visible opacity-0"
        style={{ left: -9999, top: 0, width: rulerWidth, fontSize: settings.fontSize + "px" }}
      >
        {turns.map((turn) => {
          const user = turn.role === "user"
          return (
            <div key={turn.id} className={`flex items-end gap-2 ${user ? "flex-row-reverse" : ""}`}>
              {settings.showAvatars && <div className="h-6 w-6 shrink-0" />}
              <div className="max-w-[78%] border-2 px-3 py-2" style={{ lineHeight: "1.625" }}>
                {isHtml(turn.content)
                  ? <div className="prose-card" dangerouslySetInnerHTML={{ __html: turn.content }} />
                  : <p className="whitespace-pre-wrap">{turn.content}</p>
                }
              </div>
            </div>
          )
        })}
      </div>

      <div className="shrink-0 space-y-2 border-t-2 border-foreground bg-[var(--paper-soft)] p-3">
        <div className="flex gap-1.5 overflow-x-auto pb-0.5">
          {THEME_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onThemeCategoryChange(cat.id)}
              className={`shrink-0 border-2 border-foreground px-3 py-1 text-xs font-black uppercase transition-transform ${
                themeCategory === cat.id
                  ? "bg-foreground text-background"
                  : "bg-background text-foreground hover:-translate-x-0.5 hover:-translate-y-0.5 hover:ink-shadow"
              }`}
            >
              {cat.label}
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
          <>
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
                  {theme.label}
                </button>
              ))}
            </div>

            <div className="flex gap-1.5 overflow-x-auto pb-0.5">
              {CARD_SIZES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => onSizeChange(s.id)}
                  title={`${s.exportWidth} x ${s.exportHeight}`}
                  className={`shrink-0 border border-foreground px-3 py-1 text-xs font-bold uppercase ${
                    settings.sizeId === s.id ? "bg-foreground text-background" : "bg-background hover:bg-muted"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </>
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
                      Type size
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
                    label="Top-down flow"
                    checked={settings.layoutFlow === "top-down"}
                    onChange={(v) => onSettingsChange({ layoutFlow: v ? "top-down" : "bottom-up" })}
                  />
                  <Toggle
                    label="Show avatars"
                    checked={settings.showAvatars}
                    onChange={(v) => onSettingsChange({ showAvatars: v })}
                  />
                  {settings.showAvatars && (
                    <div className="grid grid-cols-2 gap-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.12em] text-muted-foreground">
                        User
                        <input
                          className="mt-1 h-7 w-full border border-foreground bg-background px-1.5 text-center text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[var(--proof)]"
                          maxLength={4}
                          placeholder="Me"
                          value={settings.avatarUser}
                          onChange={(e) => onSettingsChange({ avatarUser: e.target.value })}
                        />
                      </label>
                      <label className="text-[10px] font-black uppercase tracking-[0.12em] text-muted-foreground">
                        AI
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
                    label="Show footer"
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
            Export PNG
          </button>
        </div>
      </div>
    </div>
  )
}
