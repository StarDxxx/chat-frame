"use client"

import { getTheme } from "@/lib/themes"
import type { CardSettings, ConversationTurn, EmotionThemeId, PlatformId } from "@/lib/types"

const PLATFORM_AVATAR: Record<PlatformId, string> = {
  deepseek: "D",
  chatgpt: "G",
  claude: "克",
  text: "AI",
}

// Detect if content is HTML (from Tiptap editor) or plain Markdown
function isHtml(content: string) {
  return content.trimStart().startsWith("<")
}

interface Props {
  turns: ConversationTurn[]
  themeId: EmotionThemeId
  platform?: PlatformId
  settings: CardSettings
  title?: string
  minHeight?: number
}

export function CardPreview({ turns, themeId, platform, settings, title, minHeight }: Props) {
  const aiAvatarDefault = PLATFORM_AVATAR[platform ?? "text"]
  const aiAvatar = settings.avatarAI || aiAvatarDefault
  const userAvatar = settings.avatarUser || "我"
  const theme = getTheme(themeId)

  return (
    <div
      id="card-export"
      className={`relative w-full rounded-3xl flex flex-col bg-gradient-to-br ${theme.gradient}`}
      style={minHeight ? { minHeight } : undefined}
    >
      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none rounded-3xl"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")" }}
      />

      {/* Spacer: pushes content to the bottom when card is at min-height */}
      <div className="flex-1" />

      <div className="relative w-full p-5 flex flex-col gap-3">
        {title && (
          <p className={`text-[10px] font-semibold uppercase tracking-widest ${theme.accentColor} opacity-70`}>
            {title}
          </p>
        )}

        <div className="flex flex-col gap-2.5">
          {turns.map((turn) => {
            const isUser = turn.role === "user"
            const html = isHtml(turn.content)

            return (
              <div
                key={turn.id}
                className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}
              >
                {settings.showAvatars && (
                  <div className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold mb-0.5
                    ${isUser ? "bg-white/30 text-white" : "bg-black/20 text-white/80"}`}
                  >
                    {isUser ? userAvatar : aiAvatar}
                  </div>
                )}
                <div
                  className={`
                  relative max-w-[78%] rounded-2xl px-3 py-2 leading-relaxed
                  ${isUser
                    ? "rounded-br-sm bg-white/25 backdrop-blur-sm border border-white/30"
                    : "rounded-bl-sm bg-black/20 backdrop-blur-sm border border-white/10"
                  }
                  ${theme.textColor} ${theme.fontStyle}
                `}
                  style={{ fontSize: settings.fontSize + "px" }}
                >
                  {html ? (
                    <div
                      className="prose-card"
                      dangerouslySetInnerHTML={{ __html: turn.content }}
                    />
                  ) : (
                    <p className="whitespace-pre-wrap">{turn.content}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {settings.showFooter && (
          <div className="pt-1 flex items-center justify-between">
            <span className={`text-[9px] ${theme.accentColor} opacity-50`}>AI 对话卡片</span>
            <span className={`text-[9px] ${theme.accentColor} opacity-50`}>{theme.label}</span>
          </div>
        )}
      </div>
    </div>
  )
}
