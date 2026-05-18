export interface ConversationTurn {
  id: string
  role: "user" | "assistant"
  content: string
  thinking?: string
}

export type PlatformId = "deepseek" | "chatgpt" | "claude" | "text"

export interface Conversation {
  source: "url" | "text"
  platform?: PlatformId
  rawUrl?: string
  title?: string
  turns: ConversationTurn[]
}

// Card color variants (sub-selection under "card" category)
export type CardColorId = "graphite" | "sky" | "ocean"

// Keep EmotionThemeId as alias for backwards compat with CardPreview etc.
export type EmotionThemeId = CardColorId

// Top-level template categories
export type ThemeCategoryId = "chat-app" | "card" | "memo" | "classic"

export interface EmotionTheme {
  id: EmotionThemeId
  label: string
  description: string
  gradient: string
  cardBg: string
  textColor: string
  accentColor: string
  fontStyle: string
}

export type CardSizeId = "square" | "xiaohongshu" | "xiaohongshu-long" | "douyin"

export interface CardSettings {
  showAvatars: boolean
  showFooter: boolean
  showDate: boolean
  sizeId: CardSizeId
  layoutFlow: "top-down" | "bottom-up"
  fontSize: number
  avatarUser: string
  avatarAI: string
  fontId: string
}

export interface DashboardState {
  conversation: Conversation | null
  selectedTurnIds: string[]
  selectedTheme: EmotionThemeId
  settings: CardSettings
  selectModalOpen: boolean
}
