"use client"

import { useState } from "react"
import { ImageDown, Newspaper, Scissors } from "lucide-react"
import { ConversationEditor } from "@/components/editor/ConversationEditor"
import { PreviewPanel } from "@/components/preview/PreviewPanel"
import { SelectModal } from "@/components/dashboard/SelectModal"
import { ImportBar } from "@/components/import/ImportBar"
import { PLACEHOLDER_CONVERSATION, PLACEHOLDER_SELECTED_IDS } from "@/lib/placeholder"
import { getCardSize } from "@/lib/card-sizes"
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

const initialSelectedTurns = PLACEHOLDER_CONVERSATION.turns.filter((t) =>
  PLACEHOLDER_SELECTED_IDS.includes(t.id)
)

const INITIAL: PageState = {
  isDemo: true,
  conversation: PLACEHOLDER_CONVERSATION,
  selectedTurnIds: PLACEHOLDER_SELECTED_IDS,
  selectedTurns: initialSelectedTurns,
  editedTurns: initialSelectedTurns,
  themeCategory: "card",
  selectedTheme: "graphite",
  settings: {
    showAvatars: true,
    showFooter: true,
    sizeId: "xiaohongshu",
    layoutFlow: "bottom-up",
    fontSize: 12,
    avatarUser: "我",
    avatarAI: "",
  },
  selectModalOpen: false,
}

export default function Home() {
  const [state, setState] = useState<PageState>(INITIAL)

  const update = (patch: Partial<PageState>) =>
    setState((prev) => ({ ...prev, ...patch }))

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
                AI Dialogue Press
              </p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
                Edit, clip, typeset, export
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <div className="flex items-center gap-1.5 border border-foreground bg-background px-2.5 py-1 text-[11px] font-bold uppercase">
              <Scissors className="h-3.5 w-3.5" />
              {state.selectedTurnIds.length} clips
            </div>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 border-2 border-foreground bg-foreground px-3 py-1.5 text-xs font-black uppercase text-background transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:proof-shadow"
            >
              <ImageDown className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex min-h-0 flex-1 gap-4 p-4">
        <section className="newsprint-panel flex min-w-0 flex-[6] flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b-2 border-foreground bg-[var(--paper)] px-4 py-2">
            <p className="font-editorial text-lg font-black">Copy Desk</p>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              source material
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
            <p className="font-editorial text-lg font-black">Print Proof</p>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              live plate
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
