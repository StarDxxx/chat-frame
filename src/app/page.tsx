"use client"

import { useState } from "react"
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
  settings: { showAvatars: true, showFooter: true, sizeId: "xiaohongshu", layoutFlow: "bottom-up", fontSize: 12, avatarUser: "我", avatarAI: "" },
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
      // open select modal for URL imports so user can pick clips
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
    link.download = "ai-emo-card.png"
    link.href = dataUrl
    link.click()
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="shrink-0 h-13 border-b flex items-center px-5">
        <span className="font-bold text-sm tracking-tight">✦ AI 对话卡片</span>
      </header>

      {/* Main */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: import bar + editable conversation */}
        <div className="flex-[6] min-w-0 flex flex-col border-r overflow-hidden">
          <ImportBar
            isDemo={state.isDemo}
            conversation={state.conversation}
            onImport={handleImport}
            onSelectClips={() => update({ selectModalOpen: true })}
          />
          <div className="flex-1 overflow-y-auto">
            <ConversationEditor
              initialTurns={state.selectedTurns}
              isDemo={state.isDemo}
              avatarUser={state.settings.avatarUser}
              avatarAI={state.settings.avatarAI}
              onChange={(turns) => update({ editedTurns: turns })}
            />
          </div>
        </div>

        {/* Right: card preview + controls */}
        <div className="flex-[4] min-w-0 flex flex-col">
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
        </div>
      </div>

      {/* Select modal */}
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
