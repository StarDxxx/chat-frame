import type { PlatformParser } from "./types"
import type { Conversation, ConversationTurn } from "@/lib/types"
import type { Browser } from "puppeteer-core"

const SHARE_URL_RE = /claude\.ai\/share\/([a-f0-9-]+)/i

function makeId() {
  return Math.random().toString(36).slice(2, 9)
}

interface ClaudeContent { type: string; text?: string }
interface ClaudeMessage { sender: "human" | "assistant"; content: ClaudeContent[] }
interface ClaudeSnapshot { snapshot_name?: string; chat_messages: ClaudeMessage[] }

// In serverless environments (Vercel/Lambda) the puppeteer Chrome cache is not
// available at runtime, so we use @sparticuz/chromium which ships its own binary.
async function launchBrowser(): Promise<Browser> {
  const { default: puppeteerCore } = await import("puppeteer-core")
  const isServerless = !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.AWS_EXECUTION_ENV)

  if (isServerless) {
    const { default: chromium } = await import("@sparticuz/chromium")
    return puppeteerCore.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    })
  }

  // Local dev: reuse the Chrome that puppeteer downloaded
  const { executablePath } = await import("puppeteer")
  return puppeteerCore.launch({
    headless: true,
    executablePath: executablePath(),
    args: ["--no-sandbox", "--disable-blink-features=AutomationControlled"],
  })
}

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

    const browser = await launchBrowser()

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
        return r.json() as Promise<unknown>
      }, shareId) as ClaudeSnapshot

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
