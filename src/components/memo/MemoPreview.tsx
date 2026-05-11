"use client"

import type { CardSettings, ConversationTurn, PlatformId } from "@/lib/types"

function isHtml(content: string) {
  return content.trimStart().startsWith("<")
}

// iOS 26 "aurora" wallpaper — 午夜深蓝底，带柔和紫/青光晕
const AURORA =
  "radial-gradient(ellipse at 22% 25%, rgba(120,50,220,0.32) 0%, transparent 48%)," +
  "radial-gradient(ellipse at 78% 75%, rgba(0,160,150,0.28) 0%, transparent 48%)," +
  "linear-gradient(160deg, #160a2e 0%, #0c1240 45%, #07162a 75%, #05101e 100%)"

const GLASS: React.CSSProperties = {
  background: "rgba(255,255,255,0.08)",
  backdropFilter: "blur(32px)",
  WebkitBackdropFilter: "blur(32px)",
}

// 状态栏：三列 flex，全部 items-center 对齐，不用绝对定位
function StatusBar() {
  return (
    <div
      className="shrink-0 flex items-center justify-between"
      style={{ height: 44, padding: "0 22px" }}
    >
      {/* 左：信号 + WiFi */}
      <div className="flex items-center gap-1.5">
        <div className="flex items-end gap-[2px]">
          {([4, 6, 9, 12] as const).map((h, i) => (
            <div key={i} style={{ width: 3, height: h, background: "rgba(255,255,255,0.88)", borderRadius: 1 }} />
          ))}
        </div>
        <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
          <circle cx="7.5" cy="9.5" r="1.2" fill="rgba(255,255,255,0.88)" />
          <path d="M3.8 6.3a5.2 5.2 0 0 1 7.4 0" stroke="rgba(255,255,255,0.88)" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M1 3.5A9.5 9.5 0 0 1 14 3.5" stroke="rgba(255,255,255,0.88)" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      </div>

      {/* 中：时间 */}
      <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: -0.3, color: "rgba(255,255,255,0.95)" }}>9:41</span>

      {/* 右：电池 */}
      <div className="flex items-center gap-[1px]">
        <div style={{ position: "relative", width: 24, height: 12, border: "1.5px solid rgba(255,255,255,0.4)", borderRadius: 3.5 }}>
          <div style={{ position: "absolute", inset: 1.5, right: 1.5, background: "rgba(255,255,255,0.88)", borderRadius: 2, width: "80%" }} />
        </div>
        <div style={{ width: 1.5, height: 5, background: "rgba(255,255,255,0.38)", borderRadius: 1 }} />
      </div>
    </div>
  )
}

function NavBar({ aiLabel }: { aiLabel: string }) {
  return (
    <div
      className="shrink-0 relative flex items-center justify-between"
      style={{
        height: 54,
        padding: "0 14px",
        ...GLASS,
        borderBottom: "0.5px solid rgba(255,255,255,0.12)",
      }}
    >
      {/* 返回 */}
      <div className="flex items-center gap-0.5">
        <svg width="9" height="15" viewBox="0 0 9 15" fill="none">
          <path d="M8 1L1.5 7.5L8 14" stroke="#0A84FF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span style={{ fontSize: 17, color: "#0A84FF" }}>Messages</span>
      </div>

      {/* 中间：只有头像，不重复文字 */}
      <div className="absolute inset-x-0 flex justify-center" style={{ pointerEvents: "none" }}>
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          background: "linear-gradient(135deg, rgba(10,122,255,0.6), rgba(90,86,214,0.6))",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1.5px solid rgba(255,255,255,0.28)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 15, color: "white", fontWeight: 700,
        }}>
          {aiLabel.charAt(0).toUpperCase()}
        </div>
      </div>

      {/* 右：通话图标 */}
      <div className="flex items-center gap-3">
        <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path d="M4.5 2c.2.7.5 1.4.8 2L4.2 5.2a7.5 7.5 0 0 0 5.6 5.6l1.2-1.1c.6.3 1.3.6 2 .8v1.8a11 11 0 0 1-11-11H4.5z" fill="#0A84FF" />
          </svg>
        </div>
        <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
            <path d="M1 2a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2z" fill="#0A84FF" />
            <path d="M10 4l4-2v6l-4-2V4z" fill="#0A84FF" />
          </svg>
        </div>
      </div>
    </div>
  )
}

function InputBar() {
  return (
    <div
      className="shrink-0 flex items-center gap-2"
      style={{
        height: 68,
        padding: "0 12px 12px",
        ...GLASS,
        borderTop: "0.5px solid rgba(255,255,255,0.12)",
      }}
    >
      {/* + */}
      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.13)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <svg width="13" height="13" viewBox="0 0 13 13">
          <path d="M6.5 1v11M1 6.5h11" stroke="rgba(255,255,255,0.75)" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </div>

      {/* 输入框 */}
      <div style={{ flex: 1, height: 34, borderRadius: 17, background: "rgba(255,255,255,0.1)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.18)", display: "flex", alignItems: "center", padding: "0 13px" }}>
        <span style={{ fontSize: 14, color: "rgba(255,255,255,0.28)" }}>iMessage</span>
      </div>

      {/* 发送 */}
      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(10,132,255,0.8)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <svg width="13" height="13" viewBox="0 0 13 13">
          <path d="M6.5 11V3M3 6.5l3.5-3.5 3.5 3.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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

export function MemoPreview({ turns, settings, pageOffset, pageViewportHeight }: Props) {
  const paginated = pageOffset !== undefined
  const fs = settings.fontSize || 14
  const aiLabel = settings.avatarAI || "AI"

  return (
    <div
      id="card-export"
      className="relative w-full h-full overflow-hidden flex flex-col"
      style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif",
        borderRadius: 44,
        background: AURORA,
      }}
    >
      <StatusBar />
      <NavBar aiLabel={aiLabel} />

      {/* 消息列表 */}
      <div
        className="flex-1 relative overflow-hidden"
        style={pageViewportHeight ? { height: pageViewportHeight, flex: "none" } : {}}
      >
        <div
          style={{
            padding: "12px 12px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 7,
            ...(paginated ? { transform: `translateY(-${pageOffset}px)` } : {}),
          }}
        >
          {turns.map((turn) => {
            const isUser = turn.role === "user"
            return (
              <div key={turn.id} style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start" }}>
                <div
                  style={{
                    maxWidth: "76%",
                    padding: "9px 13px",
                    borderRadius: isUser ? "20px 20px 5px 20px" : "20px 20px 20px 5px",
                    background: isUser ? "rgba(10,132,255,0.75)" : "rgba(255,255,255,0.14)",
                    backdropFilter: "blur(22px)",
                    WebkitBackdropFilter: "blur(22px)",
                    border: isUser
                      ? "1px solid rgba(120,190,255,0.25)"
                      : "1px solid rgba(255,255,255,0.2)",
                    color: "rgba(255,255,255,0.95)",
                    fontSize: fs,
                    lineHeight: 1.45,
                  }}
                >
                  {isHtml(turn.content) ? (
                    <div className="prose-card" dangerouslySetInnerHTML={{ __html: turn.content }} />
                  ) : (
                    <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{turn.content}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <InputBar />
    </div>
  )
}
