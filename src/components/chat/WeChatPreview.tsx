"use client"

import { ChevronLeft, Mic, MoreHorizontal, Plus, Smile, Volume2 } from "lucide-react"
import type { CardSettings, ConversationTurn, PlatformId } from "@/lib/types"

function isHtml(content: string) {
  return content.trimStart().startsWith("<")
}

const BUBBLE_SENT = "#95EC69"
const CHAT_BG = "#EDEDED"
const TOP_BG = "#F2F2F2"
const BORDER = "0.5px solid #D9D9D9"
const ICON = "#1F1F1F"
const BUBBLE_LINE_HEIGHT = 1.38
const BUBBLE_PADDING_Y = 19

function getAvatarSize(fontSize: number) {
  return Math.round(fontSize * BUBBLE_LINE_HEIGHT + BUBBLE_PADDING_Y)
}

function StatusBar() {
  return (
    <div
      className="shrink-0 flex items-center justify-between"
      style={{ height: 34, padding: "6px 24px 0", background: TOP_BG }}
    >
      <span style={{ fontSize: 15, fontWeight: 700, color: "#000", letterSpacing: -0.1 }}>20:33</span>
      <div className="flex items-center gap-1.5">
        <div className="flex items-end gap-[2px]">
          {([5, 8, 11, 14] as const).map((h, i) => (
            <div
              key={i}
              style={{
                width: 3,
                height: h,
                background: i === 3 ? "rgba(0,0,0,0.28)" : "#000",
                borderRadius: 1.5,
              }}
            />
          ))}
        </div>
        <div className="flex items-center gap-[1px]">
          <div
            style={{
              position: "relative",
              width: 24,
              height: 12,
              border: "1.3px solid rgba(0,0,0,0.38)",
              borderRadius: 3.5,
            }}
          >
            <div style={{ position: "absolute", inset: 1.5, right: 5, background: "#000", borderRadius: 2 }} />
          </div>
          <div style={{ width: 1.5, height: 4.5, background: "rgba(0,0,0,0.28)", borderRadius: 1 }} />
        </div>
      </div>
    </div>
  )
}

function NavBar({ aiLabel }: { aiLabel: string }) {
  return (
    <div
      className="shrink-0 relative flex items-center justify-between"
      style={{ height: 42, padding: "0 14px", background: TOP_BG, borderBottom: BORDER }}
    >
      <div className="flex items-center">
        <ChevronLeft size={27} strokeWidth={2.1} color={ICON} />
      </div>

      <div className="absolute inset-x-0 flex justify-center pointer-events-none">
        <span style={{ fontSize: 18, fontWeight: 600, color: "#141414", letterSpacing: 0 }}>{aiLabel}</span>
      </div>

      <MoreHorizontal size={25} strokeWidth={3} color={ICON} />
    </div>
  )
}

function Avatar({ label, isUser, size }: { label: string; isUser: boolean; size: number }) {
  return (
    <div
      className="shrink-0"
      style={{
        width: size,
        height: size,
        borderRadius: 6,
        background: isUser ? "#F5E8B9" : "#FFFFFF",
        border: isUser ? "0.5px solid rgba(0,0,0,0.10)" : "0.5px solid rgba(0,0,0,0.08)",
        boxShadow: "0 0.5px 1px rgba(0,0,0,0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#1F1F1F",
        fontSize: label.length > 2 ? Math.max(11, size * 0.31) : Math.max(12, size * 0.36),
        fontWeight: 700,
        lineHeight: 1,
      }}
    >
      {label}
    </div>
  )
}

function Bubble({ isUser, children, fontSize }: { isUser: boolean; children: React.ReactNode; fontSize: number }) {
  return (
    <div style={{ position: "relative", display: "inline-block", maxWidth: "72%" }}>
      <div
        style={{
          position: "absolute",
          top: 13,
          ...(isUser
            ? { right: -8, clipPath: "polygon(0 0, 100% 50%, 0 100%)", background: BUBBLE_SENT }
            : { left: -8, clipPath: "polygon(100% 0, 0 50%, 100% 100%)", background: "#FFF" }),
          width: 11,
          height: 13,
        }}
      />
      <div
        style={{
          padding: "9px 13px 10px",
          borderRadius: 5,
          background: isUser ? BUBBLE_SENT : "#FFF",
          boxShadow: "0 0.5px 1px rgba(0,0,0,0.06)",
          fontSize,
          color: "#171717",
          lineHeight: BUBBLE_LINE_HEIGHT,
          wordBreak: "break-word",
        }}
      >
        {children}
      </div>
    </div>
  )
}

function InputBar() {
  const circleStyle = {
    width: 30,
    height: 30,
    borderRadius: "50%",
    border: "1.8px solid #1F1F1F",
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
  } as const

  return (
    <div
      className="shrink-0 flex items-center gap-2"
      style={{ height: 50, padding: "6px 10px 8px", background: "#F7F7F7", borderTop: BORDER }}
    >
      <div style={circleStyle}>
        <Volume2 size={17} strokeWidth={2.3} color={ICON} />
      </div>
      <div
        style={{
          flex: 1,
          height: 34,
          borderRadius: 6,
          background: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          padding: "0 14px",
          minWidth: 0,
        }}
      >
        <Mic size={20} strokeWidth={2.5} color="#777" />
      </div>
      <div style={circleStyle}>
        <Smile size={22} strokeWidth={2} color={ICON} />
      </div>
      <div style={circleStyle}>
        <Plus size={23} strokeWidth={2} color={ICON} />
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
  const avatarSize = getAvatarSize(fs)
  const aiLabel = settings.avatarAI || "AI"
  const userLabel = settings.avatarUser || "我"
  const showAvatars = settings.showAvatars

  return (
    <div
      id="card-export"
      className="relative w-full h-full overflow-hidden flex flex-col"
      style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'PingFang SC', 'Helvetica Neue', sans-serif",
        borderRadius: 36,
        background: TOP_BG,
      }}
    >
      <StatusBar />
      <NavBar aiLabel={aiLabel} />

      <div
        className="flex-1 relative overflow-hidden"
        style={{ background: CHAT_BG, ...(pageViewportHeight ? { height: pageViewportHeight, flex: "none" } : {}) }}
      >
        <div
          style={{
            padding: "16px 14px 18px",
            display: "flex",
            flexDirection: "column",
            gap: 18,
            ...(paginated ? { transform: `translateY(-${pageOffset}px)` } : {}),
          }}
        >
          {turns.map((turn) => {
            const isUser = turn.role === "user"
            return (
              <div
                key={turn.id}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  gap: 12,
                  flexDirection: isUser ? "row-reverse" : "row",
                }}
              >
                {showAvatars && <Avatar label={isUser ? userLabel : aiLabel} isUser={isUser} size={avatarSize} />}
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
