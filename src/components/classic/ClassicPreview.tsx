"use client"

import { ChevronDown, Mic, Plus } from "lucide-react"
import type { CardSettings, ConversationTurn, PlatformId } from "@/lib/types"

export type ClassicVariant = "claude" | "chatgpt" | "deepseek"

function isHtml(s: string) {
  return s.trimStart().startsWith("<")
}

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
    bg: "#0d0d0d",
    border: "#1e1e1e",
    brandName: "Claude",
    modelName: "claude-sonnet-4-5",
    brandColor: "#d97757",
    userBubbleBg: "#2655de",
    userText: "#ffffff",
    assistantText: "#e0e0e0",
    muted: "#4a4a4a",
    inputBg: "#1a1a1a",
    avatarBg: "#d97757",
    placeholder: "Message Claude...",
  },
  chatgpt: {
    bg: "#141414",
    border: "#242424",
    brandName: "ChatGPT",
    modelName: "GPT-4o",
    brandColor: "#ffffff",
    userBubbleBg: "#303030",
    userText: "#ececec",
    assistantText: "#ececec",
    muted: "#4a4a4a",
    inputBg: "#1c1c1c",
    avatarBg: "#000000",
    placeholder: "Message ChatGPT...",
  },
  deepseek: {
    bg: "#ffffff",
    border: "#e8ebf2",
    brandName: "DeepSeek",
    modelName: "Fast mode",
    brandColor: "#3468ff",
    userBubbleBg: "#eef4ff",
    userText: "#111827",
    assistantText: "#111827",
    muted: "#8d949f",
    inputBg: "#ffffff",
    avatarBg: "#3468ff",
    placeholder: "Message DeepSeek",
  },
}

function ClaudeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="white">
      <path d="M7 0 C7 0 7.6 4.4 7.6 7 C7.6 9.6 7 14 7 14 C7 14 6.4 9.6 6.4 7 C6.4 4.4 7 0 7 0Z" />
      <path d="M0 7 C0 7 4.4 6.4 7 6.4 C9.6 6.4 14 7 14 7 C14 7 9.6 7.6 7 7.6 C4.4 7.6 0 7 0 7Z" />
    </svg>
  )
}

function ChatGPTIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="white" opacity="0.9">
      <circle cx="7" cy="7" r="2" />
      {[0, 60, 120, 180, 240, 300].map((deg) => {
        const rad = (deg * Math.PI) / 180
        const x1 = 7 + 2.5 * Math.cos(rad)
        const y1 = 7 + 2.5 * Math.sin(rad)
        const x2 = 7 + 6 * Math.cos(rad)
        const y2 = 7 + 6 * Math.sin(rad)
        return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth="1.4" strokeLinecap="round" />
      })}
    </svg>
  )
}

function DeepSeekIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56.6 41.4" fill="none">
      <path
        d="M55.6128,3.4712c-.5953-.2917-.8517.2642-1.1998.5466-.1191.0911-.2198.2095-.3206.3188-.8701.9292-1.8867,1.5398-3.2148,1.4668-1.9417-.1094-3.5995.5012-5.065,1.9863-.3114-1.8313-1.3463-2.9248-2.9217-3.6262-.8242-.3645-1.6577-.729-2.2348-1.5217-.403-.5647-.5129-1.1934-.7144-1.813-.1283-.3735-.2565-.7563-.687-.8201-.4671-.0728-.6503.3188-.8335.647-.7327,1.3394-1.0166,2.8154-.9892,4.3096.0641,3.3621,1.4838,6.0406,4.3047,7.9449.3206.2187.403.4372.3023.7563-.1924.656-.4214,1.2937-.6228,1.9497-.1283.4192-.3207.5103-.7694.3279-1.5479-.6467-2.8852-1.6035-4.0667-2.7605-2.0058-1.9407-3.8193-4.0818-6.0815-5.7583-.5312-.3918-1.0625-.7561-1.6121-1.1025-2.3081-2.2412.3023-4.0818.9068-4.3003.6319-.2278.2198-1.0115-1.8227-1.0022-2.0425.009-3.9109.6924-6.2922,1.6035-.348.1367-.7145.2368-1.09.3188-2.1615-.4099-4.4055-.5012-6.7502-.2368-4.4147.4919-7.9408,2.5784-10.5328,6.1409C.1914,13.1289-.5413,17.9941.3563,23.0691c.9434,5.3481,3.6727,9.7761,7.8676,13.2385,4.3506,3.5896,9.3606,5.3481,15.0758,5.011,3.4713-.2004,7.3364-.665,11.6961-4.355,1.099.5467,2.2531.7652,4.1674.9292,1.4746.1367,2.8943-.0728,3.9933-.3005,1.7219-.3645,1.6029-1.959.9801-2.2505-5.0466-2.3506-3.9385-1.394-4.9459-2.1685,2.5645-3.0339,6.4297-6.1865,7.9409-16.4001.119-.8108.0183-1.3211,0-1.9771-.0092-.4008.0824-.5556.5404-.6013,1.2639-.1458,2.4912-.4919,3.6178-1.1115,3.2698-1.7857,4.5886-4.7195,4.9-8.2364.0459-.5376-.0091-1.0935-.577-1.3757ZM27.119,35.123c-4.8909-3.8447-7.263-5.1113-8.2431-5.0566-.9159.0547-.751,1.1025-.5496,1.7859.2107.6741.4855,1.1389.8701,1.731.2656.3918.4489.9748-.2655,1.4123-1.5754.9749-4.314-.3281-4.4423-.3918-3.1872-1.877-5.8525-4.3553-7.7302-7.7444-1.8135-3.262-2.8667-6.7605-3.0408-10.4961-.0458-.9019.2198-1.221,1.1174-1.3848,1.1815-.2187,2.3997-.2644,3.5812-.0913,4.9918.729,9.2415,2.9612,12.8043,6.4963,2.0333,2.0135,3.572,4.419,5.1566,6.7696,1.6852,2.4963,3.4987,4.8745,5.8068,6.8242.8151.6833,1.4654,1.2026,2.0882,1.5854-1.8775.2095-5.01.2552-7.1532-1.4397ZM29.4637,20.0442c0-.4009.3206-.7197.7237-.7197.0916,0,.174.018.2473.0453.1008.0366.1924.0913.2656.1731.1283.1277.2015.3098.2015.5012,0,.4009-.3205.7197-.7234.7197s-.7145-.3188-.7145-.7197ZM36.7452,23.7798c-.4671.1914-.9342.3552-1.383.3735-.6961.0364-1.4563-.2461-1.8684-.5923-.6411-.5376-1.0991-.8381-1.2914-1.7766-.0825-.4009-.0367-1.0205.0367-1.3757.1648-.7654-.0184-1.2573-.5587-1.7039-.4397-.3645-.9984-.4646-1.6121-.4646-.229,0-.4395-.1003-.5953-.1823-.2565-.1275-.467-.4464-.2656-.8382.0641-.1274.3756-.4373.4489-.4919.8335-.4739,1.7952-.3189,2.6836.0364.8244.3371,1.4472.9567,2.3447,1.8313.9159,1.0568,1.0807,1.3486,1.6028,2.1411.4123.6196.7878,1.2573,1.0442,1.9863.1557.4556-.0458.8291-.5862,1.0569Z"
        fill="currentColor"
      />
    </svg>
  )
}

const AVATAR_ICON: Record<ClassicVariant, React.ReactNode> = {
  claude: <ClaudeIcon />,
  chatgpt: <ChatGPTIcon />,
  deepseek: <DeepSeekIcon size={16} />,
}

function Header({ cfg, variant }: { cfg: Cfg; variant: ClassicVariant }) {
  return (
    <div style={{ height: 48, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, borderBottom: `1px solid ${cfg.border}`, flexShrink: 0 }}>
      <div style={{ width: 22, height: 22, borderRadius: "50%", background: cfg.avatarBg, color: "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {AVATAR_ICON[variant]}
      </div>
      <span style={{ fontSize: 15, fontWeight: 600, color: cfg.brandColor, letterSpacing: -0.2 }}>{cfg.brandName}</span>
      <span style={{ fontSize: 11, color: cfg.muted, background: `${cfg.muted}22`, padding: "2px 8px", borderRadius: 10, letterSpacing: 0.1 }}>{cfg.modelName}</span>
    </div>
  )
}

function InputBar({ cfg }: { cfg: Cfg }) {
  return (
    <div style={{ flexShrink: 0, padding: "10px 14px 12px", borderTop: `1px solid ${cfg.border}` }}>
      <div style={{ height: 38, borderRadius: 10, background: cfg.inputBg, border: `1px solid ${cfg.border}`, display: "flex", alignItems: "center", padding: "0 10px 0 14px", gap: 8 }}>
        <span style={{ flex: 1, fontSize: 13, color: cfg.muted }}>{cfg.placeholder}</span>
        <div style={{ width: 26, height: 26, borderRadius: "50%", background: `${cfg.muted}44`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 10V2M2.5 5.5L6 2l3.5 3.5" stroke={cfg.muted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  )
}

function DeepSeekPreview({ turns, settings, pageOffset, pageViewportHeight }: {
  turns: ConversationTurn[]
  settings: CardSettings
  pageOffset?: number
  pageViewportHeight?: number
}) {
  const paginated = pageOffset !== undefined
  const fs = settings.fontSize || 14
  const userAvatar = settings.avatarUser || "我"
  const aiAvatar = settings.avatarAI

  return (
    <div id="card-export" className="relative w-full h-full overflow-hidden flex flex-col" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", borderRadius: 16, background: "#ffffff", color: "#111827" }}>
      <div style={{ height: 52, display: "flex", alignItems: "center", padding: "0 16px", gap: 10, flexShrink: 0 }}>
        <div style={{ color: "#3468ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <DeepSeekIcon />
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#111827", lineHeight: 1.15 }}>DeepSeek</p>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden" style={pageViewportHeight ? { height: pageViewportHeight, flex: "none" } : {}}>
        <div style={{ minHeight: "100%", padding: "34px 24px 22px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 26, ...(paginated ? { transform: `translateY(-${pageOffset}px)` } : {}) }}>
          {turns.map((turn) => {
            const isUser = turn.role === "user"

            if (isUser) {
              return (
                <div key={turn.id} style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", gap: 8 }}>
                  <div style={{ maxWidth: "62%", padding: "10px 16px", borderRadius: 24, background: "#eef4ff", color: "#111827", fontSize: fs, lineHeight: 1.5 }}>
                    {isHtml(turn.content)
                      ? <div className="prose-card" dangerouslySetInnerHTML={{ __html: turn.content }} />
                      : <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{turn.content}</p>
                    }
                  </div>
                  {settings.showAvatars && (
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#eef4ff", color: "#3468ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 11, fontWeight: 700 }}>
                      {userAvatar}
                    </div>
                  )}
                </div>
              )
            }

            return (
              <div key={turn.id} style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                {settings.showAvatars && (
                  <div style={{ width: 28, height: 28, borderRadius: "50%", color: "#3468ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginRight: 10, marginTop: 2, fontSize: 11, fontWeight: 700 }}>
                    {aiAvatar ? aiAvatar : <DeepSeekIcon size={24} />}
                  </div>
                )}
                <div style={{ maxWidth: "76%", color: "#111827", fontSize: fs, lineHeight: 1.72 }}>
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

      {settings.showFooter && (
        <div style={{ flexShrink: 0, padding: "0 22px 16px" }}>
          <div style={{ minHeight: 54, borderRadius: 28, border: "1px solid #e7e9ef", boxShadow: "0 4px 18px rgba(20, 24, 31, 0.08)", padding: "0 12px 0 18px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ flex: 1, color: "#aeb5c0", fontSize: 14 }}>{CONFIGS.deepseek.placeholder}</div>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#aabaff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <p style={{ margin: "7px 0 0", textAlign: "center", fontSize: 10, color: "#9aa2af" }}>
            内容由 AI 生成，请仔细甄别
          </p>
        </div>
      )}
    </div>
  )
}

function ChatGPTVoiceButton() {
  return (
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        flexShrink: 0,
      }}
    >
      {[8, 14, 19, 13, 8].map((height, index) => (
        <span
          key={index}
          style={{
            width: 2.5,
            height,
            borderRadius: 2,
            background: "#fff",
            opacity: index === 0 || index === 4 ? 0.78 : 1,
          }}
        />
      ))}
    </div>
  )
}

function ChatGPTInputBar() {
  return (
    <div
      style={{
        flexShrink: 0,
        padding: "0 26px 12px",
        background: "linear-gradient(180deg, rgba(255,255,255,0) 0%, #fff 34%)",
      }}
    >
      <div
        style={{
          minHeight: 58,
          borderRadius: 30,
          border: "1px solid #d8d8d8",
          background: "#fff",
          boxShadow: "0 18px 45px rgba(0,0,0,0.11), 0 1px 2px rgba(0,0,0,0.08)",
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "8px 10px 8px 18px",
        }}
      >
        <Plus size={26} strokeWidth={1.8} color="#111" />
        <span
          style={{
            flex: 1,
            color: "#8e8e8e",
            fontSize: 17,
            lineHeight: 1,
            whiteSpace: "nowrap",
          }}
        >
          Ask anything
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#8a8a8a", fontSize: 14 }}>
          <span>Instant</span>
          <ChevronDown size={15} strokeWidth={2} />
        </div>
        <Mic size={24} strokeWidth={2.15} color="#111" />
        <ChatGPTVoiceButton />
      </div>
      <p
        style={{
          margin: "8px 0 0",
          textAlign: "center",
          color: "#5f6368",
          fontSize: 11,
          lineHeight: 1.25,
        }}
      >
        {"ChatGPT can make mistakes. OpenAI doesn't use star workspace data to train its models."}
      </p>
    </div>
  )
}

function ChatGPTPreview({ turns, settings, pageOffset, pageViewportHeight }: {
  turns: ConversationTurn[]
  settings: CardSettings
  pageOffset?: number
  pageViewportHeight?: number
}) {
  const paginated = pageOffset !== undefined
  const fs = settings.fontSize || 16

  return (
    <div
      id="card-export"
      className="relative w-full h-full overflow-hidden flex flex-col"
      style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif",
        borderRadius: 16,
        background: "#ffffff",
        color: "#000",
      }}
    >
      <div className="flex-1 relative overflow-hidden" style={pageViewportHeight ? { height: pageViewportHeight, flex: "none" } : {}}>
        <div
          style={{
            minHeight: "100%",
            padding: "54px 28px 120px",
            display: "flex",
            flexDirection: "column",
            gap: 48,
            ...(paginated ? { transform: `translateY(-${pageOffset}px)` } : {}),
          }}
        >
          {turns.map((turn) => {
            const isUser = turn.role === "user"

            if (isUser) {
              return (
                <div key={turn.id} style={{ display: "flex", justifyContent: "flex-end" }}>
                  <div
                    style={{
                      maxWidth: "68%",
                      padding: "13px 18px",
                      borderRadius: 28,
                      background: "#f1f1f1",
                      color: "#000",
                      fontSize: fs,
                      lineHeight: 1.45,
                    }}
                  >
                    {isHtml(turn.content)
                      ? <div className="prose-card" dangerouslySetInnerHTML={{ __html: turn.content }} />
                      : <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{turn.content}</p>
                    }
                  </div>
                </div>
              )
            }

            return (
              <div key={turn.id} style={{ maxWidth: "82%", color: "#000", fontSize: fs, lineHeight: 1.55 }}>
                {isHtml(turn.content)
                  ? <div className="prose-card" dangerouslySetInnerHTML={{ __html: turn.content }} />
                  : <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{turn.content}</p>
                }
              </div>
            )
          })}
        </div>
      </div>

      <ChatGPTInputBar />
    </div>
  )
}

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

  if (variant === "deepseek") {
    return <DeepSeekPreview turns={turns} settings={settings} pageOffset={pageOffset} pageViewportHeight={pageViewportHeight} />
  }

  if (variant === "chatgpt") {
    return <ChatGPTPreview turns={turns} settings={settings} pageOffset={pageOffset} pageViewportHeight={pageViewportHeight} />
  }

  return (
    <div id="card-export" className="relative w-full h-full overflow-hidden flex flex-col" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", borderRadius: 16, background: cfg.bg }}>
      <Header cfg={cfg} variant={variant} />

      <div className="flex-1 relative overflow-hidden" style={pageViewportHeight ? { height: pageViewportHeight, flex: "none" } : {}}>
        <div style={{ padding: "16px 18px 12px", display: "flex", flexDirection: "column", gap: 18, ...(paginated ? { transform: `translateY(-${pageOffset}px)` } : {}) }}>
          {turns.map((turn) => {
            const isUser = turn.role === "user"

            if (isUser) {
              return (
                <div key={turn.id} style={{ display: "flex", justifyContent: "flex-end" }}>
                  <div style={{ maxWidth: "78%", padding: "10px 14px", borderRadius: "18px 18px 4px 18px", background: cfg.userBubbleBg, color: cfg.userText, fontSize: fs, lineHeight: 1.55 }}>
                    {isHtml(turn.content)
                      ? <div className="prose-card" dangerouslySetInnerHTML={{ __html: turn.content }} />
                      : <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{turn.content}</p>
                    }
                  </div>
                </div>
              )
            }

            return (
              <div key={turn.id} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: cfg.avatarBg, color: "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                  {AVATAR_ICON[variant]}
                </div>
                <div style={{ flex: 1, color: cfg.assistantText, fontSize: fs, lineHeight: 1.65, paddingTop: 2 }}>
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
