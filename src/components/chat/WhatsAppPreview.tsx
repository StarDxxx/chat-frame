"use client"

import type { CardSettings, ConversationTurn, PlatformId } from "@/lib/types"

function isHtml(content: string) {
  return content.trimStart().startsWith("<")
}

const WA_DARK = "#075E54"
const WA_MID  = "#128C7E"
const BUBBLE_SENT = "#DCF8C6"
const CHAT_BG = "#E5DDD5"

function StatusBar() {
  return (
    <div
      className="shrink-0 flex items-center justify-between"
      style={{ height: 44, padding: "0 18px", background: WA_DARK }}
    >
      <span style={{ fontSize: 15, fontWeight: 600, color: "#fff", letterSpacing: -0.3 }}>9:41</span>
      <div className="flex items-center gap-1.5">
        <div className="flex items-end gap-[2px]">
          {([4, 6, 9, 12] as const).map((h, i) => (
            <div key={i} style={{ width: 3, height: h, background: "rgba(255,255,255,0.9)", borderRadius: 1 }} />
          ))}
        </div>
        <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
          <circle cx="7.5" cy="9.5" r="1.2" fill="rgba(255,255,255,0.9)" />
          <path d="M3.8 6.3a5.2 5.2 0 0 1 7.4 0" stroke="rgba(255,255,255,0.9)" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M1 3.5A9.5 9.5 0 0 1 14 3.5" stroke="rgba(255,255,255,0.9)" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
        <div className="flex items-center gap-[1px]">
          <div style={{ position: "relative", width: 22, height: 11, border: "1.5px solid rgba(255,255,255,0.45)", borderRadius: 3 }}>
            <div style={{ position: "absolute", inset: 1.5, right: 1.5, background: "rgba(255,255,255,0.9)", borderRadius: 1.5, width: "80%" }} />
          </div>
          <div style={{ width: 1.5, height: 4.5, background: "rgba(255,255,255,0.38)", borderRadius: 1 }} />
        </div>
      </div>
    </div>
  )
}

function NavBar({ aiLabel }: { aiLabel: string }) {
  const initial = aiLabel.charAt(0).toUpperCase()
  return (
    <div
      className="shrink-0 flex items-center gap-3"
      style={{ height: 56, padding: "0 12px", background: WA_MID }}
    >
      {/* 返回 */}
      <svg width="9" height="15" viewBox="0 0 9 15" fill="none">
        <path d="M8 1L1.5 7.5L8 14" stroke="rgba(255,255,255,0.9)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      {/* 头像 */}
      <div style={{
        width: 38, height: 38, borderRadius: "50%",
        background: "linear-gradient(135deg, #25D366, #128C7E)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 16, fontWeight: 700, color: "#fff", flexShrink: 0,
      }}>
        {initial}
      </div>

      {/* 联系人 */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 16, fontWeight: 600, color: "#fff", margin: 0, lineHeight: 1.2 }}>{aiLabel}</p>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.72)", margin: 0 }}>online</p>
      </div>

      {/* 右侧图标 */}
      <div className="flex items-center gap-4">
        {/* 视频 */}
        <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
          <path d="M1 2a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2z" fill="rgba(255,255,255,0.9)" />
          <path d="M12 4.5l6-3v11l-6-3V4.5z" fill="rgba(255,255,255,0.9)" />
        </svg>
        {/* 电话 */}
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M5 2c.2.8.5 1.7 1 2.5L4.8 5.7a9 9 0 0 0 7.5 7.5l1.2-1.2c.8.5 1.7.8 2.5 1v2.2A13 13 0 0 1 2.8 2H5z" fill="rgba(255,255,255,0.9)" />
        </svg>
        {/* 更多 */}
        <svg width="4" height="18" viewBox="0 0 4 18">
          <circle cx="2" cy="3" r="2" fill="rgba(255,255,255,0.9)" />
          <circle cx="2" cy="9" r="2" fill="rgba(255,255,255,0.9)" />
          <circle cx="2" cy="15" r="2" fill="rgba(255,255,255,0.9)" />
        </svg>
      </div>
    </div>
  )
}

function Bubble({ isUser, children, fontSize }: { isUser: boolean; children: React.ReactNode; fontSize: number }) {
  const bg = isUser ? BUBBLE_SENT : "#FFF"
  return (
    <div style={{ position: "relative", maxWidth: "74%", display: "inline-block" }}>
      {/* 气泡尾角 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          ...(isUser
            ? { right: -7, clipPath: "polygon(0 0, 0 100%, 100% 0)", background: bg }
            : { left: -7, clipPath: "polygon(100% 0, 100% 100%, 0 0)", background: bg }),
          width: 10,
          height: 10,
        }}
      />
      <div
        style={{
          padding: "7px 10px 10px",
          borderRadius: isUser ? "8px 8px 2px 8px" : "8px 8px 8px 2px",
          background: bg,
          boxShadow: "0 1px 2px rgba(0,0,0,0.12)",
          fontSize,
          color: "#111",
          lineHeight: 1.5,
        }}
      >
        {children}
        {/* 时间戳 + 双勾 */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 3, marginTop: 3 }}>
          <span style={{ fontSize: 10, color: "#999" }}>9:41</span>
          {isUser && (
            <svg width="16" height="9" viewBox="0 0 16 9" fill="none">
              <path d="M1 4.5l3 3L10 1" stroke="#53BDEB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M6 4.5l3 3L15 1" stroke="#53BDEB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
      </div>
    </div>
  )
}

function InputBar() {
  return (
    <div
      className="shrink-0 flex items-center gap-2"
      style={{ height: 58, padding: "0 10px", background: "#F0F0F0" }}
    >
      {/* 表情 */}
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="#888" strokeWidth="1.5">
        <circle cx="13" cy="13" r="11" />
        <path d="M9 15s1.5 2 4 2 4-2 4-2" strokeLinecap="round" />
        <circle cx="9.5" cy="10.5" r="1.2" fill="#888" stroke="none" />
        <circle cx="16.5" cy="10.5" r="1.2" fill="#888" stroke="none" />
      </svg>

      {/* 输入框 */}
      <div style={{ flex: 1, height: 36, borderRadius: 18, background: "#fff", display: "flex", alignItems: "center", padding: "0 12px" }}>
        <span style={{ fontSize: 14, color: "#bbb" }}>Message</span>
      </div>

      {/* 附件 */}
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5" strokeLinecap="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
      </svg>

      {/* 发送 / 麦克风 */}
      <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M9 2v10M5 7l4-5 4 5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M3 14h12" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  )
}

interface Props {
  turns: ConversationTurn[]
  platform?: PlatformId
  settings: CardSettings
  minHeight?: number
}

export function WhatsAppPreview({ turns, settings, minHeight }: Props) {
  const fs = settings.fontSize || 14
  const aiLabel = settings.avatarAI || "AI"

  return (
    <div
      id="card-export"
      className="relative w-full flex flex-col"
      style={{
        fontFamily: "'SF Pro Text', 'Helvetica Neue', 'Segoe UI', sans-serif",
        borderRadius: 44,
        background: "#fff",
        ...(minHeight ? { minHeight } : {}),
      }}
    >
      <StatusBar />
      <NavBar aiLabel={aiLabel} />

      {/* 聊天区域 */}
      <div
        className="flex-1 relative"
        style={{ background: CHAT_BG }}
      >
        <div
          style={{
            padding: "10px 12px 14px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {turns.map((turn) => {
            const isUser = turn.role === "user"
            return (
              <div key={turn.id} style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start" }}>
                <Bubble isUser={isUser} fontSize={fs}>
                  {isHtml(turn.content) ? (
                    <div className="prose-card" dangerouslySetInnerHTML={{ __html: turn.content }} />
                  ) : (
                    <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{turn.content}</p>
                  )}
                </Bubble>
              </div>
            )
          })}
        </div>
      </div>

      <InputBar />
    </div>
  )
}
