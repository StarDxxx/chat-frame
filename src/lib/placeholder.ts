import type { Conversation } from "./types"
import type { Locale } from "./i18n"

export interface LocalePlaceholder {
  conversation: Conversation
  selectedIds: string[]
}

export const PLACEHOLDERS: Record<Locale, LocalePlaceholder> = {
  zh: {
    conversation: {
      source: "text",
      platform: "text",
      turns: [
        { id: "zh-1", role: "user",      content: "我不知道该把这些话说给谁听。" },
        { id: "zh-2", role: "assistant", content: "可以先放在这里。" },
        { id: "zh-3", role: "user",      content: "你又不是真的懂。" },
        { id: "zh-4", role: "assistant", content: "也许。" },
        { id: "zh-5", role: "user",      content: "那有什么用？" },
        { id: "zh-6", role: "assistant", content: "有时候，一个地方不需要懂。\n只需要不打断你。" },
      ],
    },
    selectedIds: ["zh-1", "zh-2", "zh-3", "zh-4", "zh-5", "zh-6"],
  },

  ja: {
    conversation: {
      source: "text",
      platform: "text",
      turns: [
        { id: "ja-1", role: "user",      content: "最近、夜が長い気がする。" },
        { id: "ja-2", role: "assistant", content: "眠れない夜ですか。それとも、思い出してしまう夜ですか。" },
        { id: "ja-3", role: "user",      content: "たぶん、後者。" },
        { id: "ja-4", role: "assistant", content: "誰かのことを考える時間は、時計より長くなりますね。" },
        { id: "ja-5", role: "user",      content: "もう忘れたと思ってたのに。" },
        { id: "ja-6", role: "assistant", content: "忘れたものは、こんなに静かには戻ってきません。" },
      ],
    },
    selectedIds: ["ja-1", "ja-2", "ja-3", "ja-4", "ja-5", "ja-6"],
  },

  en: {
    conversation: {
      source: "text",
      platform: "text",
      turns: [
        { id: "en-1", role: "user",      content: "I almost texted them last night." },
        { id: "en-2", role: "assistant", content: "What stopped you?" },
        { id: "en-3", role: "user",      content: "Pride, maybe." },
        { id: "en-4", role: "assistant", content: "Or self-respect." },
        { id: "en-5", role: "user",      content: "I don't know which one it was." },
        { id: "en-6", role: "assistant", content: "Sometimes they feel the same when you're still hurting." },
      ],
    },
    selectedIds: ["en-1", "en-2", "en-3", "en-4", "en-5", "en-6"],
  },
}

export function getPlaceholderForLocale(locale: Locale): LocalePlaceholder {
  return PLACEHOLDERS[locale] ?? PLACEHOLDERS.zh
}

// Backwards-compat exports (default to zh)
export const PLACEHOLDER_CONVERSATION: Conversation = PLACEHOLDERS.zh.conversation
export const PLACEHOLDER_SELECTED_IDS: string[] = PLACEHOLDERS.zh.selectedIds
