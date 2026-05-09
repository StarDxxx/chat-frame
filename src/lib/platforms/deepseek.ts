import type { PlatformParser } from "./types"
import type { Conversation, ConversationTurn } from "@/lib/types"

// https://chat.deepseek.com/share/{share_id}
const SHARE_URL_RE = /chat\.deepseek\.com\/share\/([a-z0-9]+)/i

function makeId() {
  return Math.random().toString(36).slice(2, 9)
}

// [reference:N] tags are internal DeepSeek tool-call IDs with no URL/title data
function stripReferences(text: string): string {
  return text.replace(/\[reference:\d+\]/g, "").trim()
}

interface DSFragment {
  id: number
  type: "REQUEST" | "THINK" | "RESPONSE"
  content: string
}

interface DSMessage {
  message_id: number
  parent_id: number | null
  role: "USER" | "ASSISTANT"
  fragments: DSFragment[]
}

interface DSResponse {
  code: number
  data: {
    biz_data: {
      title: string
      messages: DSMessage[]
    }
  }
}

export const deepseekParser: PlatformParser = {
  id: "deepseek",
  name: "DeepSeek",

  canHandle(url: string) {
    return SHARE_URL_RE.test(url)
  },

  async parse(url: string): Promise<Conversation> {
    const match = url.match(SHARE_URL_RE)
    if (!match) throw new Error("Invalid DeepSeek share URL")
    const shareId = match[1]

    const res = await fetch(
      `https://chat.deepseek.com/api/v0/share/content?share_id=${shareId}`,
      {
        headers: {
          accept: "*/*",
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
          referer: `https://chat.deepseek.com/share/${shareId}`,
          "x-app-version": "2.0.0",
          "x-client-locale": "en_US",
          "x-client-platform": "web",
          "x-client-version": "2.0.0",
          "x-client-timezone-offset": "28800",
        },
      }
    )

    if (!res.ok) throw new Error(`DeepSeek API error: ${res.status}`)

    const json: DSResponse = await res.json()
    if (json.code !== 0) throw new Error("DeepSeek returned non-zero code")

    const { title, messages } = json.data.biz_data
    const turns: ConversationTurn[] = []

    for (const msg of messages) {
      if (msg.role === "USER") {
        const req = msg.fragments.find((f) => f.type === "REQUEST")
        if (req?.content) {
          turns.push({ id: makeId(), role: "user", content: req.content })
        }
      } else if (msg.role === "ASSISTANT") {
        const response = msg.fragments.find((f) => f.type === "RESPONSE")
        const thinking = msg.fragments.find((f) => f.type === "THINK")
        if (response?.content) {
          turns.push({
            id: makeId(),
            role: "assistant",
            content: stripReferences(response.content),
            thinking: thinking?.content,
          })
        }
      }
    }

    return { source: "url", rawUrl: url, platform: "deepseek", title, turns }
  },
}
