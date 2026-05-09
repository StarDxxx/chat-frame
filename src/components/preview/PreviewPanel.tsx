"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { CardPreview } from "@/components/card/CardPreview"
import { THEMES } from "@/lib/themes"
import { CARD_SIZES, getCardSize } from "@/lib/card-sizes"
import type { CardSettings, CardSizeId, ConversationTurn, EmotionThemeId, PlatformId, ThemeCategoryId } from "@/lib/types"

const THEME_CATEGORIES: { id: ThemeCategoryId; label: string; icon: string }[] = [
  { id: "chat-app", label: "聊天 APP", icon: "💬" },
  { id: "card",     label: "卡片",     icon: "🎴" },
  { id: "memo",     label: "备忘录",   icon: "📋" },
  { id: "classic",  label: "经典原生", icon: "🖥" },
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
    <label className="flex items-center justify-between gap-3 cursor-pointer">
      <span className="text-xs text-muted-foreground">{label}</span>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-8 h-4 rounded-full transition-colors overflow-hidden ${checked ? "bg-primary" : "bg-muted-foreground/30"}`}
      >
        <span className={`absolute left-0.5 top-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-transform ${checked ? "translate-x-4" : "translate-x-0"}`} />
      </button>
    </label>
  )
}

function isHtml(content: string) {
  return content.trimStart().startsWith("<")
}

export function PreviewPanel({ turns, themeCategory, themeId, platform, settings, onThemeCategoryChange, onThemeChange, onSizeChange, onSettingsChange, onExport }: Props) {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  // pageOffsets[N] = translateY start of page N (px from content top)
  const [pageOffsets, setPageOffsets] = useState<number[]>([0])
  const [rawAvail, setRawAvail] = useState(0)
  const [cardDims, setCardDims] = useState({ w: 0, h: 0 })

  const cardWrapperRef = useRef<HTMLDivElement>(null)
  const rulerRef = useRef<HTMLDivElement>(null)

  const size = getCardSize(settings.sizeId)

  // Track card element dimensions so the hidden ruler matches
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

  // Reset to page 0 whenever the set of turns changes (new conversation / selection)
  const turnsKey = turns.map((t) => t.id).join(",")
  useEffect(() => {
    setCurrentPage(0)
  }, [turnsKey])

  // Compute per-page safe cut positions using actual rendered bubble geometry
  useLayoutEffect(() => {
    if (!rulerRef.current || cardDims.h === 0) return
    const rulerEl = rulerRef.current
    const children = Array.from(rulerEl.children)
    if (children.length !== turns.length || children.length === 0) return

    const rulerTop = rulerEl.getBoundingClientRect().top
    const lastChild = children[children.length - 1] as HTMLElement
    const totalH = lastChild.getBoundingClientRect().bottom - rulerTop

    const PADDING_V = 40
    const FOOTER_H = settings.showFooter ? 32 : 0
    const avail = Math.max(1, cardDims.h - PADDING_V - FOOTER_H)
    const lineH = settings.fontSize * 1.625
    const BUBBLE_PAD = 8 // py-2

    // Build a sorted list of Y positions that are safe to cut at
    // (bottom of each text line, bottom of each bubble, midpoint of each gap)
    const safeCuts: number[] = []
    for (const child of children) {
      const turnEl = child as HTMLElement
      // Bubble is always the last child of the turn flex row
      const bubbleEl = turnEl.children[turnEl.children.length - 1] as HTMLElement
      if (!bubbleEl) continue
      const r = bubbleEl.getBoundingClientRect()
      const top = r.top - rulerTop
      const bottom = r.bottom - rulerTop
      // Bottom of each line within this bubble
      for (let y = top + BUBBLE_PAD + lineH; y <= bottom - BUBBLE_PAD + 0.5; y += lineH) {
        safeCuts.push(y)
      }
      safeCuts.push(bottom) // bottom padding area — safe
    }
    safeCuts.sort((a, b) => a - b)

    // Walk through content, snapping each page break to the nearest safe cut ≤ target
    const offsets: number[] = [0]
    let pos = 0
    while (pos < totalH - 1) {
      const target = pos + avail
      if (target >= totalH) break
      // Largest safe cut that is > pos (no overlap) and ≤ target
      const candidates = safeCuts.filter((y) => y > pos && y <= target)
      const next = candidates.length > 0 ? Math.max(...candidates) : target
      if (next <= pos) break
      offsets.push(next)
      pos = next
    }

    setPageOffsets(offsets)
    setRawAvail(avail)
    setCurrentPage((prev) => Math.min(prev, offsets.length - 1))
  }, [turns, cardDims.w, cardDims.h, settings.fontSize, settings.showFooter, settings.showAvatars])

  const totalPages = pageOffsets.length
  const currentOffset = pageOffsets[currentPage] ?? 0
  const nextOffset = pageOffsets[currentPage + 1]
  // Viewport height = distance to next page start; last page uses full rawAvail
  const currentViewportH = nextOffset !== undefined ? nextOffset - currentOffset : rawAvail
  const pageOffset = totalPages > 1 ? currentOffset : undefined
  const pageViewportH = totalPages > 1 ? currentViewportH : undefined

  // Ruler content-area width: card width minus horizontal padding (p-5 * 2)
  const rulerWidth = cardDims.w > 0 ? cardDims.w - 40 : 240

  return (
    <div className="flex flex-col h-full">
      {/* Card area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-3 overflow-hidden min-h-0">
        {themeCategory !== "card" ? (
          <div className="flex flex-col items-center justify-center gap-3 text-center select-none">
            <div className="text-4xl opacity-20">
              {THEME_CATEGORIES.find((c) => c.id === themeCategory)?.icon}
            </div>
            <p className="text-sm font-medium text-muted-foreground/50">
              {THEME_CATEGORIES.find((c) => c.id === themeCategory)?.label}
            </p>
            <p className="text-xs text-muted-foreground/35">即将推出</p>
          </div>
        ) : (
          <>
        <div
          ref={cardWrapperRef}
          className="max-h-full max-w-full"
          style={{ aspectRatio: size.ratio }}
        >
          <CardPreview
            turns={turns}
            themeId={themeId}
            platform={platform}
            settings={settings}
            pageOffset={pageOffset}
            pageViewportHeight={pageViewportH}
          />
        </div>

        {/* Page indicator */}
        {pageOffsets.length > 1 && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="w-6 h-6 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-25 transition text-lg leading-none"
            >‹</button>
            <div className="flex gap-1.5 items-center">
              {pageOffsets.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`rounded-full transition-all duration-200 ${
                    i === currentPage
                      ? "w-4 h-1.5 bg-foreground"
                      : "w-1.5 h-1.5 bg-muted-foreground/35 hover:bg-muted-foreground/60"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => setCurrentPage((p) => Math.min(pageOffsets.length - 1, p + 1))}
              disabled={currentPage === pageOffsets.length - 1}
              className="w-6 h-6 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-25 transition text-lg leading-none"
            >›</button>
          </div>
        )}
          </>
        )}
      </div>

      {/*
        Hidden ruler — mirrors card content area width & font size.
        Each direct child corresponds to one turn; offsetHeight is used for pagination.
      */}
      <div
        ref={rulerRef}
        className="fixed pointer-events-none opacity-0 overflow-visible"
        style={{ left: -9999, top: 0, width: rulerWidth, fontSize: settings.fontSize + "px" }}
      >
        {turns.map((turn) => {
          const user = turn.role === "user"
          return (
            <div key={turn.id} className={`flex items-end gap-2 ${user ? "flex-row-reverse" : ""}`}>
              {settings.showAvatars && <div className="shrink-0 w-6 h-6" />}
              <div className="max-w-[78%] px-3 py-2" style={{ lineHeight: "1.625" }}>
                {isHtml(turn.content)
                  ? <div className="prose-card" dangerouslySetInnerHTML={{ __html: turn.content }} />
                  : <p className="whitespace-pre-wrap">{turn.content}</p>
                }
              </div>
            </div>
          )
        })}
      </div>

      {/* Bottom controls */}
      <div className="shrink-0 border-t bg-background/80 backdrop-blur-sm px-4 py-3 space-y-2">
        {/* Size chips — only for card */}
        {themeCategory === "card" && <div className="flex gap-1.5 overflow-x-auto pb-0.5">
          {CARD_SIZES.map((s) => (
            <div key={s.id} className="relative group/sz shrink-0">
              <button
                onClick={() => onSizeChange(s.id)}
                className={`rounded-full px-3 py-1 text-xs font-medium border transition-all
                  ${settings.sizeId === s.id
                    ? "bg-foreground text-background border-foreground scale-105"
                    : "text-muted-foreground border-border hover:border-foreground/40 hover:text-foreground"
                  }`}
              >
                {s.label}
              </button>
              <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/sz:block z-50">
                <div className="bg-gray-900 text-white text-[10px] rounded-md px-2 py-1 shadow-lg whitespace-nowrap">
                  {s.exportWidth} × {s.exportHeight}
                </div>
                <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900 mx-auto" />
              </div>
            </div>
          ))}
        </div>}

        {/* Theme category tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-0.5">
          {THEME_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onThemeCategoryChange(cat.id)}
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium border transition-all
                ${themeCategory === cat.id
                  ? "bg-foreground text-background border-foreground"
                  : "text-muted-foreground border-border hover:border-foreground/50 hover:text-foreground"
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Card color sub-row — only for "card" category */}
        {themeCategory === "card" && (
          <div className="flex gap-2 overflow-x-auto pb-0.5">
            {THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => onThemeChange(theme.id as EmotionThemeId)}
                className={`shrink-0 flex items-center gap-1.5 rounded-full pl-1.5 pr-3 py-1 text-xs font-medium border transition-all
                  ${themeId === theme.id
                    ? "border-foreground/60 text-foreground scale-105"
                    : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                  }`}
              >
                <span className={`w-4 h-4 rounded-full bg-gradient-to-br ${theme.gradient} shrink-0`} />
                {theme.label}
              </button>
            ))}
          </div>
        )}

        {/* Action row */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setSettingsOpen((v) => !v)}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground border rounded-lg px-2.5 py-1.5 transition-colors"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 16 16">
                <path d="M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M13.3 6.5a5.5 5.5 0 0 0-.4-1l1-1.4-1.4-1.4-1.4 1a5.5 5.5 0 0 0-1-.4L9.5 2h-2l-.6 1.3a5.5 5.5 0 0 0-1 .4l-1.4-1L3 4.1l1 1.4a5.5 5.5 0 0 0-.4 1L2.2 7v2l1.3.6c.1.34.24.68.4 1l-1 1.4 1.4 1.4 1.4-1c.32.16.66.3 1 .4l.6 1.3h2l.6-1.3a5.5 5.5 0 0 0 1-.4l1.4 1 1.4-1.4-1-1.4c.16-.32.3-.66.4-1l1.3-.6V7l-1.3-.5Z" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
              设置
            </button>

            {settingsOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setSettingsOpen(false)} />
                <div className="absolute bottom-full left-0 mb-2 z-20 w-48 bg-popover border rounded-xl shadow-lg p-3 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">文字大小</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onSettingsChange({ fontSize: Math.max(10, settings.fontSize - 1) })}
                        className="w-5 h-5 rounded flex items-center justify-center text-sm font-medium hover:bg-muted transition-colors"
                      >−</button>
                      <span className="text-xs w-10 text-center tabular-nums">{settings.fontSize} px</span>
                      <button
                        onClick={() => onSettingsChange({ fontSize: Math.min(22, settings.fontSize + 1) })}
                        className="w-5 h-5 rounded flex items-center justify-center text-sm font-medium hover:bg-muted transition-colors"
                      >+</button>
                    </div>
                  </div>
                  <Toggle
                    label="从上往下排列"
                    checked={settings.layoutFlow === "top-down"}
                    onChange={(v) => onSettingsChange({ layoutFlow: v ? "top-down" : "bottom-up" })}
                  />
                  <Toggle
                    label="显示头像"
                    checked={settings.showAvatars}
                    onChange={(v) => onSettingsChange({ showAvatars: v })}
                  />
                  {settings.showAvatars && (
                    <div className="flex gap-2 -mt-1">
                      <div className="flex-1">
                        <p className="text-[10px] text-muted-foreground mb-1">用户</p>
                        <input
                          className="h-6 w-full rounded-md border bg-muted/40 px-1.5 text-xs text-center focus:outline-none focus:ring-1 focus:ring-primary"
                          maxLength={4}
                          placeholder="我"
                          value={settings.avatarUser}
                          onChange={(e) => onSettingsChange({ avatarUser: e.target.value })}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] text-muted-foreground mb-1">AI</p>
                        <input
                          className="h-6 w-full rounded-md border bg-muted/40 px-1.5 text-xs text-center focus:outline-none focus:ring-1 focus:ring-primary"
                          maxLength={4}
                          placeholder="AI"
                          value={settings.avatarAI}
                          onChange={(e) => onSettingsChange({ avatarAI: e.target.value })}
                        />
                      </div>
                    </div>
                  )}
                  <Toggle
                    label="显示底部标签"
                    checked={settings.showFooter}
                    onChange={(v) => onSettingsChange({ showFooter: v })}
                  />
                </div>
              </>
            )}
          </div>

          <button
            onClick={onExport}
            className="flex-1 bg-primary text-primary-foreground rounded-lg py-1.5 text-xs font-semibold hover:bg-primary/90 transition-colors"
          >
            导出图片
          </button>
        </div>
      </div>
    </div>
  )
}
