import type { PlatformParser } from "./types"
import type { Conversation, ConversationTurn } from "@/lib/types"

const SHARE_URL_RE = /claude\.ai\/share\/([a-f0-9-]+)/i

function makeId() {
  return Math.random().toString(36).slice(2, 9)
}

interface ClaudeContent { type: string; text?: string }
interface ClaudeMessage { sender: "human" | "assistant"; content: ClaudeContent[] }
interface ClaudeSnapshot { snapshot_name?: string; chat_messages: ClaudeMessage[] }

export const claudeParser: PlatformParser = {
  id: "claude",
  name: "Claude",

  canHandle(url: string) {
    return SHARE_URL_RE.test(url)
  },

  async parse(url: string): Promise<Conversation> {
    const match = url.match(SHARE_URL_RE)
    if (!match) throw new Error("Invalid Claude share URL")
    const shareId = match[1]

    // claude.ai is behind Cloudflare — must run in-browser context via puppeteer
    const { default: puppeteer } = await import("puppeteer")
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-blink-features=AutomationControlled"],
    })

    try {
      const page = await browser.newPage()
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
      )
      await page.goto(`https://claude.ai/share/${shareId}`, {
        waitUntil: "domcontentloaded",
        timeout: 30000,
      })

      const snapshot: ClaudeSnapshot = await page.evaluate(async (id: string) => {
        const r = await fetch(
          `/api/chat_snapshots/${id}?rendering_mode=messages&render_all_tools=true`
        )
        return r.json()
      }, shareId)

      const turns: ConversationTurn[] = snapshot.chat_messages
        .map((m) => ({
          id: makeId(),
          role: (m.sender === "human" ? "user" : "assistant") as "user" | "assistant",
          content: m.content
            .filter((c) => c.type === "text" && c.text)
            .map((c) => c.text!)
            .join("")
            .trim(),
        }))
        .filter((t) => t.content.length > 0)

      return {
        source: "url",
        rawUrl: url,
        platform: "claude",
        title: snapshot.snapshot_name || "Claude 对话",
        turns,
      }
    } finally {
      await browser.close()
    }
  },
}
