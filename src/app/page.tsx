"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { ImageDown, Newspaper, Scissors } from "lucide-react"
import { ConversationEditor } from "@/components/editor/ConversationEditor"
import { PreviewPanel } from "@/components/preview/PreviewPanel"
import { SelectModal } from "@/components/dashboard/SelectModal"
import { ImportBar } from "@/components/import/ImportBar"
import { getPlaceholderForLocale } from "@/lib/placeholder"
import { DEFAULT_FONT_ID } from "@/lib/fonts"

const DEFAULT_AVATAR_USER: Record<Locale, string> = { zh: "我", en: "Me", ja: "私" }
import { getCardSize } from "@/lib/card-sizes"
import { LocaleProvider, useLocale, type Locale } from "@/lib/i18n"
import { TAGLINES } from "@/lib/i18n/taglines"
import type { CardSettings, CardSizeId, Conversation, ConversationTurn, EmotionThemeId, ThemeCategoryId } from "@/lib/types"

interface PageState {
  isDemo: boolean
  conversation: Conversation
  selectedTurnIds: string[]
  selectedTurns: ConversationTurn[]
  editedTurns: ConversationTurn[]
  themeCategory: ThemeCategoryId
  selectedTheme: EmotionThemeId
  settings: CardSettings
  selectModalOpen: boolean
}

function buildDemoState(locale: Locale): Partial<PageState> {
  const { conversation, selectedIds } = getPlaceholderForLocale(locale)
  const selected = conversation.turns.filter((t) => selectedIds.includes(t.id))
  return {
    isDemo: true,
    conversation,
    selectedTurnIds: selectedIds,
    selectedTurns: selected,
    editedTurns: selected,
  }
}

const { conversation: initConv, selectedIds: initIds } = getPlaceholderForLocale("zh")
const initSelected = initConv.turns.filter((t) => initIds.includes(t.id))

const INITIAL: PageState = {
  isDemo: true,
  conversation: initConv,
  selectedTurnIds: initIds,
  selectedTurns: initSelected,
  editedTurns: initSelected,
  themeCategory: "card",
  selectedTheme: "graphite",
  settings: {
    showAvatars: true,
    showFooter: true,
    showDate: false,
    sizeId: "xiaohongshu",
    layoutFlow: "bottom-up",
    fontSize: 12,
    avatarUser: "我",
    avatarAI: "",
    fontId: DEFAULT_FONT_ID["zh"],
  },
  selectModalOpen: false,
}

const LOCALE_LABELS: { id: Locale; label: string }[] = [
  { id: "zh", label: "中文" },
  { id: "en", label: "EN" },
  { id: "ja", label: "日本語" },
]

function RotatingTagline() {
  const { locale } = useLocale()
  const lines = TAGLINES[locale]

  // Shuffle once per locale, then step through
  const [shuffled, setShuffled] = useState<string[]>(() => shuffle(lines))
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const next = shuffle(TAGLINES[locale])
    setShuffled(next)
    setIdx(0)
  }, [locale])

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % shuffled.length), 4000)
    return () => clearInterval(id)
  }, [shuffled])

  return (
    <AnimatePresence mode="wait">
      <motion.p
        key={`${locale}-${idx}`}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground"
      >
        {shuffled[idx]}
      </motion.p>
    </AnimatePresence>
  )
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function Home() {
  return (
    <LocaleProvider>
      <AppContent />
    </LocaleProvider>
  )
}

function AppContent() {
  const { locale, setLocale, t } = useLocale()
  const [state, setState] = useState<PageState>(INITIAL)

  const update = (patch: Partial<PageState>) =>
    setState((prev) => ({ ...prev, ...patch }))

  useEffect(() => {
    if (!state.isDemo) return
    update({
      ...buildDemoState(locale),
      settings: {
        ...state.settings,
        fontId: DEFAULT_FONT_ID[locale],
        avatarUser: DEFAULT_AVATAR_USER[locale],
      },
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale])

  const handleImport = (conversation: Conversation) => {
    const selectedIds = conversation.turns.map((t) => t.id)
    const selected = conversation.turns
    update({
      isDemo: false,
      conversation,
      selectedTurnIds: selectedIds,
      selectedTurns: selected,
      editedTurns: selected,
      selectModalOpen: conversation.source === "url",
    })
  }

  const handleSelectConfirm = (ids: string[]) => {
    const selected = state.conversation.turns.filter((t) => ids.includes(t.id))
    update({
      selectedTurnIds: ids,
      selectedTurns: selected,
      editedTurns: selected,
      selectModalOpen: false,
    })
  }

  const handleExport = async () => {
    const { toPng } = await import("html-to-image")
    const el = document.getElementById("card-export")
    if (!el) return
    const size = getCardSize(state.settings.sizeId)
    const pixelRatio = size.exportWidth / el.offsetWidth
    const dataUrl = await toPng(el, { pixelRatio })
    const link = document.createElement("a")
    link.download = "ai-dialogue-press-card.png"
    link.href = dataUrl
    link.click()
  }

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 opacity-[0.07] halftone text-foreground" />
      <div className="pointer-events-none absolute left-5 top-0 h-full w-px bg-foreground/35" />
      <div className="pointer-events-none absolute right-7 top-0 h-full w-px bg-[var(--proof)]/35" />

      <header className="relative z-10 shrink-0 border-b-2 border-foreground bg-[var(--paper-soft)] px-5 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center border-2 border-foreground bg-[var(--proof)] text-primary-foreground ink-shadow">
              <Newspaper className="h-5 w-5" />
            </div>
            <div>
              <p className="font-editorial text-2xl font-black leading-none tracking-normal">
                {t("brand.name")}
              </p>
              <div className="mt-1">
                <RotatingTagline />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-1.5 border border-foreground bg-background px-2.5 py-1 text-[11px] font-bold uppercase md:flex">
              <Scissors className="h-3.5 w-3.5" />
              {t("header.clips", { n: state.selectedTurnIds.length })}
            </div>

            <div className="flex items-center border border-foreground bg-background">
              {LOCALE_LABELS.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setLocale(id)}
                  className={`px-2.5 py-1 text-[11px] font-bold transition-colors ${
                    locale === id
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <button
              onClick={handleExport}
              className="hidden items-center gap-2 border-2 border-foreground bg-foreground px-3 py-1.5 text-xs font-black uppercase text-background transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:proof-shadow md:flex"
            >
              <ImageDown className="h-4 w-4" />
              {t("header.export")}
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex min-h-0 flex-1 gap-4 p-4">
        <section className="newsprint-panel flex min-w-0 flex-[6] flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b-2 border-foreground bg-[var(--paper)] px-4 py-2">
            <p className="font-editorial text-lg font-black">{t("panels.copyDesk")}</p>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              {t("panels.sourceMaterial")}
            </span>
          </div>
          <ImportBar
            isDemo={state.isDemo}
            conversation={state.conversation}
            onImport={handleImport}
            onSelectClips={() => update({ selectModalOpen: true })}
          />
          <div className="min-h-0 flex-1 overflow-y-auto ruled-paper">
            <ConversationEditor
              initialTurns={state.selectedTurns}
              isDemo={state.isDemo}
              avatarUser={state.settings.avatarUser}
              avatarAI={state.settings.avatarAI}
              onChange={(turns) => update({ editedTurns: turns })}
            />
          </div>
        </section>

        <section className="newsprint-panel flex min-w-0 flex-[4] flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b-2 border-foreground bg-[var(--paper)] px-4 py-2">
            <p className="font-editorial text-lg font-black">{t("panels.printProof")}</p>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              {t("panels.livePlate")}
            </span>
          </div>
          <PreviewPanel
            turns={state.editedTurns}
            themeCategory={state.themeCategory}
            themeId={state.selectedTheme}
            platform={state.conversation.platform}
            settings={state.settings}
            onThemeCategoryChange={(id: ThemeCategoryId) => update({ themeCategory: id })}
            onThemeChange={(id: EmotionThemeId) => update({ selectedTheme: id })}
            onSizeChange={(id: CardSizeId) => update({ settings: { ...state.settings, sizeId: id } })}
            onSettingsChange={(patch) => update({ settings: { ...state.settings, ...patch } })}
            onExport={handleExport}
          />
        </section>
      </main>

      {state.selectModalOpen && (
        <SelectModal
          conversation={state.conversation}
          selectedIds={state.selectedTurnIds}
          onSelect={handleSelectConfirm}
          onClose={() => update({ selectModalOpen: false })}
        />
      )}
    </div>
  )
}
