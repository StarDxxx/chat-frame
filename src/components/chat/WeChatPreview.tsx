"use client"

import type { CardSettings, ConversationTurn, PlatformId } from "@/lib/types"

function isHtml(content: string) {
  return content.trimStart().startsWith("<")
}

const WECHAT_GREEN = "#07C160"
const BUBBLE_SENT = "#95EC69"
const CHAT_BG = "#EDEDED"
const BORDER = "0.5px solid #E0E0E0"

function StatusBar() {
  return (
    <div
      className="shrink-0 flex items-center justify-between"
      style={{ height: 44, padding: "0 18px", background: "#fff" }}
    >
      <span style={{ fontSize: 15, fontWeight: 600, color: "#000", letterSpacing: -0.3 }}>9:41</span>
      <div className="flex items-center gap-1.5">
        <div className="flex items-end gap-[2px]">
          {([4, 6, 9, 12] as const).map((h, i) => (
            <div key={i} style={{ width: 3, height: h, background: "#000", borderRadius: 1 }} />
          ))}
        </div>
        <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
          <circle cx="7.5" cy="9.5" r="1.2" fill="#000" />
          <path d="M3.8 6.3a5.2 5.2 0 0 1 7.4 0" stroke="#000" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M1 3.5A9.5 9.5 0 0 1 14 3.5" stroke="#000" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
        <div className="flex items-center gap-[1px]">
          <div style={{ position: "relative", width: 22, height: 11, border: "1.5px solid rgba(0,0,0,0.4)", borderRadius: 3 }}>
            <div style={{ position: "absolute", inset: 1.5, right: 1.5, background: "#000", borderRadius: 1.5, width: "80%" }} />
          </div>
          <div style={{ width: 1.5, height: 4.5, background: "rgba(0,0,0,0.4)", borderRadius: 1 }} />
        </div>
      </div>
    </div>
  )
}

function NavBar({ aiLabel }: { aiLabel: string }) {
  return (
    <div
      className="shrink-0 relative flex items-center justify-between"
      style={{ height: 44, padding: "0 14px", background: "#fff", borderBottom: BORDER }}
    >
      {/* 返回 */}
      <div className="flex items-center gap-0.5">
        <svg width="9" height="15" viewBox="0 0 9 15" fill="none">
          <path d="M8 1L1.5 7.5L8 14" stroke={WECHAT_GREEN} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span style={{ fontSize: 16, color: WECHAT_GREEN, marginLeft: 2 }}>1</span>
      </div>

      {/* 联系人名 */}
      <div className="absolute inset-x-0 flex justify-center pointer-events-none">
        <span style={{ fontSize: 17, fontWeight: 600, color: "#000" }}>{aiLabel}</span>
      </div>

      {/* 更多 */}
      <svg width="22" height="6" viewBox="0 0 22 6">
        <circle cx="3" cy="3" r="2" fill="#000" />
        <circle cx="11" cy="3" r="2" fill="#000" />
        <circle cx="19" cy="3" r="2" fill="#000" />
      </svg>
    </div>
  )
}

function Bubble({ isUser, children, fontSize }: { isUser: boolean; children: React.ReactNode; fontSize: number }) {
  return (
    <div style={{ position: "relative", display: "inline-block", maxWidth: "72%" }}>
      {/* 气泡尾角 */}
      <div
        style={{
          position: "absolute",
          bottom: 8,
          ...(isUser
            ? { right: -6, clipPath: "polygon(0 0, 100% 50%, 0 100%)", background: BUBBLE_SENT }
            : { left: -6, clipPath: "polygon(100% 0, 0 50%, 100% 100%)", background: "#FFF" }),
          width: 10,
          height: 10,
        }}
      />
      <div
        style={{
          padding: "9px 12px",
          borderRadius: 8,
          background: isUser ? BUBBLE_SENT : "#FFF",
          boxShadow: isUser ? "none" : "0 1px 2px rgba(0,0,0,0.10)",
          fontSize,
          color: "#111",
          lineHeight: 1.5,
        }}
      >
        {children}
      </div>
    </div>
  )
}

function InputBar() {
  return (
    <div
      className="shrink-0 flex items-center gap-2"
      style={{ height: 58, padding: "0 10px", background: "#F7F7F7", borderTop: BORDER }}
    >
      {/* 声音 */}
      <div style={{ width: 32, height: 32, borderRadius: 6, border: BORDER, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#888" strokeWidth="1.4" strokeLinecap="round">
          <path d="M4 5v6M7 3v10M10 5v6M13 7v2" />
        </svg>
      </div>
      {/* 输入框 */}
      <div style={{ flex: 1, height: 34, borderRadius: 6, background: "#fff", border: BORDER, display: "flex", alignItems: "center", padding: "0 10px" }}>
        <span style={{ fontSize: 14, color: "#bbb" }}>发消息...</span>
      </div>
      {/* 表情 */}
      <div style={{ width: 32, height: 32, borderRadius: 6, border: BORDER, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#888" strokeWidth="1.4">
          <circle cx="9" cy="9" r="7.5" />
          <path d="M6 10.5s1 1.5 3 1.5 3-1.5 3-1.5" strokeLinecap="round" />
          <circle cx="6.5" cy="7.5" r="1" fill="#888" stroke="none" />
          <circle cx="11.5" cy="7.5" r="1" fill="#888" stroke="none" />
        </svg>
      </div>
      {/* 加号 */}
      <div style={{ width: 32, height: 32, borderRadius: 6, border: BORDER, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="14" height="14" viewBox="0 0 14 14">
          <path d="M7 1v12M1 7h12" stroke="#888" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  )
}

interface Props {
  turns: ConversationTurn[]
  platform?: PlatformId
  settings: CardSettings
  pageOffset?: number
  pageViewportHeight?: number
}

export function WeChatPreview({ turns, settings, pageOffset, pageViewportHeight }: Props) {
  const paginated = pageOffset !== undefined
  const fs = settings.fontSize || 14
  const aiLabel = settings.avatarAI || "AI"

  return (
    <div
      id="card-export"
      className="relative w-full h-full overflow-hidden flex flex-col"
      style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'PingFang SC', 'Helvetica Neue', sans-serif",
        borderRadius: 44,
        background: "#fff",
      }}
    >
      <StatusBar />
      <NavBar aiLabel={aiLabel} />

      {/* 聊天区域 */}
      <div
        className="flex-1 relative overflow-hidden"
        style={{ background: CHAT_BG, ...(pageViewportHeight ? { height: pageViewportHeight, flex: "none" } : {}) }}
      >
        <div
          style={{
            padding: "12px 14px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
            ...(paginated ? { transform: `translateY(-${pageOffset}px)` } : {}),
          }}
        >
          {turns.map((turn) => {
            const isUser = turn.role === "user"
            return (
              <div
                key={turn.id}
                style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start" }}
              >
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
