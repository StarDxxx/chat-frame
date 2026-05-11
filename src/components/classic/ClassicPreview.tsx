"use client"

import type { CardSettings, ConversationTurn, PlatformId } from "@/lib/types"

export type ClassicVariant = "claude" | "chatgpt" | "deepseek"

function isHtml(s: string) { return s.trimStart().startsWith("<") }

// ── Brand configs ────────────────────────────────────────────────────────────

interface Cfg {
  bg: string
  border: string
  brandName: string
  modelName: string
  brandColor: string
  userBubbleBg: string
  userText: string
  assistantText: string
  muted: string
  inputBg: string
  avatarBg: string
  placeholder: string
}

const CONFIGS: Record<ClassicVariant, Cfg> = {
  claude: {
    bg:           "#0d0d0d",
    border:       "#1e1e1e",
    brandName:    "Claude",
    modelName:    "claude-sonnet-4-5",
    brandColor:   "#d97757",
    userBubbleBg: "#2655de",
    userText:     "#ffffff",
    assistantText:"#e0e0e0",
    muted:        "#4a4a4a",
    inputBg:      "#1a1a1a",
    avatarBg:     "#d97757",
    placeholder:  "Message Claude…",
  },
  chatgpt: {
    bg:           "#141414",
    border:       "#242424",
    brandName:    "ChatGPT",
    modelName:    "GPT-4o",
    brandColor:   "#ffffff",
    userBubbleBg: "#303030",
    userText:     "#ececec",
    assistantText:"#ececec",
    muted:        "#4a4a4a",
    inputBg:      "#1c1c1c",
    avatarBg:     "#000000",
    placeholder:  "Message ChatGPT…",
  },
  deepseek: {
    bg:           "#131313",
    border:       "#1f1f2e",
    brandName:    "DeepSeek",
    modelName:    "DeepSeek-V3",
    brandColor:   "#4D6BFE",
    userBubbleBg: "#1c2033",
    userText:     "#e2e8f0",
    assistantText:"#d0d0d0",
    muted:        "#404060",
    inputBg:      "#0d0d1a",
    avatarBg:     "#4D6BFE",
    placeholder:  "Message DeepSeek…",
  },
}

// ── Avatar icons ─────────────────────────────────────────────────────────────

function ClaudeIcon() {
  // 4-pointed star / sparkle  ✦
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="white">
      <path d="M7 0 C7 0 7.6 4.4 7.6 7 C7.6 9.6 7 14 7 14 C7 14 6.4 9.6 6.4 7 C6.4 4.4 7 0 7 0Z" />
      <path d="M0 7 C0 7 4.4 6.4 7 6.4 C9.6 6.4 14 7 14 7 C14 7 9.6 7.6 7 7.6 C4.4 7.6 0 7 0 7Z" />
    </svg>
  )
}

function ChatGPTIcon() {
  // Simplified OpenAI-style asterisk
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="white" opacity="0.9">
      <circle cx="7" cy="7" r="2" />
      {[0,60,120,180,240,300].map((deg, i) => {
        const rad = (deg * Math.PI) / 180
        const x1 = 7 + 2.5 * Math.cos(rad)
        const y1 = 7 + 2.5 * Math.sin(rad)
        const x2 = 7 + 6 * Math.cos(rad)
        const y2 = 7 + 6 * Math.sin(rad)
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth="1.4" strokeLinecap="round" />
      })}
    </svg>
  )
}

function DeepSeekIcon() {
  // Simplified whale/wave
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 10 Q4 4 7 7 Q10 10 12 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <circle cx="11.5" cy="3.5" r="1" fill="white" />
    </svg>
  )
}

const AVATAR_ICON: Record<ClassicVariant, React.ReactNode> = {
  claude:   <ClaudeIcon />,
  chatgpt:  <ChatGPTIcon />,
  deepseek: <DeepSeekIcon />,
}

// ── Header ───────────────────────────────────────────────────────────────────

function Header({ cfg, variant }: { cfg: Cfg; variant: ClassicVariant }) {
  return (
    <div
      style={{
        height: 48,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        borderBottom: `1px solid ${cfg.border}`,
        flexShrink: 0,
      }}
    >
      {/* Brand icon */}
      <div style={{ width: 22, height: 22, borderRadius: "50%", background: cfg.avatarBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {AVATAR_ICON[variant]}
      </div>

      <span style={{ fontSize: 15, fontWeight: 600, color: cfg.brandColor, letterSpacing: -0.2 }}>
        {cfg.brandName}
      </span>

      <span style={{
        fontSize: 11,
        color: cfg.muted,
        background: `${cfg.muted}22`,
        padding: "2px 8px",
        borderRadius: 10,
        letterSpacing: 0.1,
      }}>
        {cfg.modelName}
      </span>
    </div>
  )
}

// ── Input bar ────────────────────────────────────────────────────────────────

function InputBar({ cfg }: { cfg: Cfg }) {
  return (
    <div style={{ flexShrink: 0, padding: "10px 14px 12px", borderTop: `1px solid ${cfg.border}` }}>
      <div style={{
        height: 38,
        borderRadius: 10,
        background: cfg.inputBg,
        border: `1px solid ${cfg.border}`,
        display: "flex",
        alignItems: "center",
        padding: "0 10px 0 14px",
        gap: 8,
      }}>
        <span style={{ flex: 1, fontSize: 13, color: cfg.muted }}>{cfg.placeholder}</span>
        {/* Send button */}
        <div style={{ width: 26, height: 26, borderRadius: "50%", background: `${cfg.muted}44`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 10V2M2.5 5.5L6 2l3.5 3.5" stroke={cfg.muted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  )
}

// ── Main component ───────────────────────────────────────────────────────────

interface Props {
  variant: ClassicVariant
  turns: ConversationTurn[]
  platform?: PlatformId
  settings: CardSettings
  pageOffset?: number
  pageViewportHeight?: number
}

export function ClassicPreview({ variant, turns, settings, pageOffset, pageViewportHeight }: Props) {
  const paginated = pageOffset !== undefined
  const fs = settings.fontSize || 14
  const cfg = CONFIGS[variant]

  return (
    <div
      id="card-export"
      className="relative w-full h-full overflow-hidden flex flex-col"
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        borderRadius: 16,
        background: cfg.bg,
      }}
    >
      <Header cfg={cfg} variant={variant} />

      {/* Messages */}
      <div
        className="flex-1 relative overflow-hidden"
        style={pageViewportHeight ? { height: pageViewportHeight, flex: "none" } : {}}
      >
        <div
          style={{
            padding: "16px 18px 12px",
            display: "flex",
            flexDirection: "column",
            gap: 18,
            ...(paginated ? { transform: `translateY(-${pageOffset}px)` } : {}),
          }}
        >
          {turns.map((turn) => {
            const isUser = turn.role === "user"

            if (isUser) {
              return (
                <div key={turn.id} style={{ display: "flex", justifyContent: "flex-end" }}>
                  <div style={{
                    maxWidth: "78%",
                    padding: "10px 14px",
                    borderRadius: "18px 18px 4px 18px",
                    background: cfg.userBubbleBg,
                    color: cfg.userText,
                    fontSize: fs,
                    lineHeight: 1.55,
                  }}>
                    {isHtml(turn.content)
                      ? <div className="prose-card" dangerouslySetInnerHTML={{ __html: turn.content }} />
                      : <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{turn.content}</p>
                    }
                  </div>
                </div>
              )
            }

            // Assistant: avatar + flowing text, no bubble
            return (
              <div key={turn.id} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: cfg.avatarBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: 1,
                }}>
                  {AVATAR_ICON[variant]}
                </div>
                <div style={{
                  flex: 1,
                  color: cfg.assistantText,
                  fontSize: fs,
                  lineHeight: 1.65,
                  paddingTop: 2,
                }}>
                  {isHtml(turn.content)
                    ? <div className="prose-card" dangerouslySetInnerHTML={{ __html: turn.content }} />
                    : <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{turn.content}</p>
                  }
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <InputBar cfg={cfg} />
    </div>
  )
}
