"use client"

import { ChevronLeft, Mic, Plus, Video } from "lucide-react"
import type { CSSProperties, ReactNode } from "react"
import type { CardSettings, ConversationTurn, PlatformId } from "@/lib/types"

function isHtml(content: string) {
  return content.trimStart().startsWith("<")
}

const IOS_BLUE = "#32A9F2"
const IOS_GRAY = "#E9E9EB"
const TEXT = "#050505"
const MUTED = "#8E8E93"

function StatusBar() {
  return (
    <div
      className="shrink-0 flex items-center justify-between"
      style={{ height: 37, padding: "8px 25px 0 31px", color: "#000" }}
    >
      <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: 0 }}>10:39</span>
      <div className="flex items-center">
        <div
          style={{
            minWidth: 27,
            height: 18,
            borderRadius: 5,
            background: "#000",
            color: "#fff",
            display: "grid",
            placeItems: "center",
            fontSize: 12,
            fontWeight: 800,
            lineHeight: 1,
            padding: "0 4px",
          }}
        >
          90
        </div>
      </div>
    </div>
  )
}

function CircleButton({ side, children }: { side: "left" | "right"; children: ReactNode }) {
  return (
    <div
      className="absolute grid place-items-center"
      style={{
        top: 14,
        [side]: 17,
        width: 42,
        height: 42,
        borderRadius: "50%",
        background: "rgba(255,255,255,0.82)",
        backdropFilter: "blur(22px)",
        WebkitBackdropFilter: "blur(22px)",
        boxShadow: "0 8px 20px rgba(0,0,0,0.11)",
        color: "#111",
      }}
    >
      {children}
    </div>
  )
}

function NavBar({ aiLabel }: { aiLabel: string }) {
  const avatarText = aiLabel.trim().charAt(0).toUpperCase() || "机"

  return (
    <div
      className="shrink-0 relative"
      style={{
        height: 92,
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.88) 64%, rgba(255,255,255,0) 100%)",
      }}
    >
      <CircleButton side="left">
        <ChevronLeft size={30} strokeWidth={2.4} />
      </CircleButton>
      <CircleButton side="right">
        <Video size={24} strokeWidth={2.1} />
      </CircleButton>

      <div
        className="absolute inset-x-0 flex flex-col items-center"
        style={{ top: 2, pointerEvents: "none" }}
      >
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 34% 26%, rgba(255,255,255,0.55), transparent 34%), linear-gradient(145deg, #9AAEEB 0%, #6F84CE 58%, #536DB7 100%)",
            display: "grid",
            placeItems: "center",
            boxShadow: "0 6px 14px rgba(84,103,180,0.22)",
            color: "#fff",
            fontSize: avatarText.length > 1 ? 19 : 27,
            fontWeight: 800,
            letterSpacing: 0,
          }}
        >
          {avatarText}
        </div>
        <div
          style={{
            minWidth: 72,
            height: 25,
            marginTop: -4,
            padding: "0 10px",
            borderRadius: 14,
            background: "rgba(255,255,255,0.90)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            boxShadow: "0 7px 16px rgba(0,0,0,0.09)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#000",
            fontSize: 14,
            fontWeight: 800,
            lineHeight: 1,
          }}
        >
          {aiLabel || "机器人"} <span style={{ color: "#9B9B9F", marginLeft: 4 }}>›</span>
        </div>
      </div>
    </div>
  )
}

function Bubble({
  isUser,
  fontSize,
  children,
}: {
  isUser: boolean
  fontSize: number
  children: ReactNode
}) {
  const bubbleStyle: CSSProperties = {
    position: "relative",
    maxWidth: isUser ? "70%" : "79%",
    padding: isUser ? "9px 15px 10px" : "13px 15px 14px",
    borderRadius: isUser ? "20px 20px 5px 20px" : "19px 19px 19px 5px",
    background: isUser ? IOS_BLUE : IOS_GRAY,
    color: isUser ? "#fff" : TEXT,
    fontSize,
    lineHeight: 1.34,
    fontWeight: 400,
    letterSpacing: 0,
    wordBreak: "break-word",
  }

  return (
    <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: isUser ? "flex-end" : "flex-start" }}>
      <div style={bubbleStyle}>
        <div
          style={{
            position: "absolute",
            bottom: -1,
            ...(isUser ? { right: -7 } : { left: -7 }),
            width: 15,
            height: 17,
            background: isUser ? IOS_BLUE : IOS_GRAY,
            clipPath: isUser
              ? "path('M0 0 C7 2 11 8 15 16 C9 14 3 10 0 4 Z')"
              : "path('M15 0 C8 2 4 8 0 16 C6 14 12 10 15 4 Z')",
          }}
        />
        {children}
      </div>
      {isUser && (
        <span
          style={{
            marginTop: 4,
            marginRight: 11,
            color: MUTED,
            fontSize: Math.max(10, fontSize - 4),
            fontWeight: 600,
          }}
        >
          已送达
        </span>
      )}
    </div>
  )
}

function InputBar() {
  return (
    <div
      className="shrink-0 flex items-center gap-2.5"
      style={{
        height: 59,
        padding: "7px 12px 12px",
        background: "rgba(255,255,255,0.78)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        boxShadow: "0 -14px 24px rgba(255,255,255,0.86)",
      }}
    >
      <div
        className="grid shrink-0 place-items-center"
        style={{
          width: 38,
          height: 38,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.86)",
          boxShadow: "0 6px 15px rgba(0,0,0,0.075)",
          color: "#000",
        }}
      >
        <Plus size={27} strokeWidth={1.8} />
      </div>
      <div
        className="flex min-w-0 flex-1 items-center"
        style={{
          height: 38,
          borderRadius: 20,
          background: "rgba(255,255,255,0.92)",
          boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.035), 0 6px 18px rgba(0,0,0,0.06)",
          padding: "0 11px 0 17px",
        }}
      >
        <span style={{ flex: 1, color: "#B5B5BA", fontSize: 15, fontWeight: 500, whiteSpace: "nowrap" }}>
          iMessage 信息
        </span>
        <Mic size={21} strokeWidth={2.1} color="#8E8E93" />
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
  const fs = settings.fontSize || 17
  const aiLabel = settings.avatarAI || "机器人"

  return (
    <div
      id="card-export"
      className="relative w-full h-full overflow-hidden flex flex-col"
      style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'PingFang SC', 'Helvetica Neue', sans-serif",
        borderRadius: 42,
        background: "#FFFFFF",
        color: TEXT,
      }}
    >
      <StatusBar />
      <NavBar aiLabel={aiLabel} />

      <div
        className="flex-1 relative overflow-hidden"
        style={pageViewportHeight ? { height: pageViewportHeight, flex: "none" } : {}}
      >
        <div
          style={{
            padding: "2px 21px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 15,
            ...(paginated ? { transform: `translateY(-${pageOffset}px)` } : {}),
          }}
        >
          {turns.map((turn) => {
            const isUser = turn.role === "user"
            return (
              <div key={turn.id} style={{ display: "contents" }}>
                <div style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start" }}>
                  <Bubble isUser={isUser} fontSize={fs}>
                    {isHtml(turn.content) ? (
                      <div className="prose-card" dangerouslySetInnerHTML={{ __html: turn.content }} />
                    ) : (
                      <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{turn.content}</p>
                    )}
                  </Bubble>
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
