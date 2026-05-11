import type { PlatformParser } from "./types"
import type { Conversation, ConversationTurn } from "@/lib/types"

const SHARE_URL_RE = /chatgpt\.com\/share\/([a-z0-9-]+)/i

function makeId() {
  return Math.random().toString(36).slice(2, 9)
}

export const chatgptParser: PlatformParser = {
  id: "chatgpt",
  name: "ChatGPT",

  canHandle(url: string) {
    return SHARE_URL_RE.test(url)
  },

  async parse(url: string): Promise<Conversation> {
    if (!SHARE_URL_RE.test(url)) throw new Error("Invalid ChatGPT share URL")

    // ChatGPT renders messages client-side — must scrape via puppeteer
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
      await page.setViewport({ width: 1280, height: 800 })

      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 })
      await page.waitForSelector("[data-message-author-role]", { timeout: 60000 })

      const raw = await page.evaluate(() => {
        const els = document.querySelectorAll("[data-message-author-role]")
        return Array.from(els).map((el) => ({
          role: el.getAttribute("data-message-author-role") ?? "",
          content: (el as HTMLElement).innerText.trim(),
        }))
      })

      const turns: ConversationTurn[] = raw
        .filter((m) => (m.role === "user" || m.role === "assistant") && m.content.length > 0)
        .map((m) => ({
          id: makeId(),
          role: m.role as "user" | "assistant",
          content: m.content,
        }))

      return {
        source: "url",
        rawUrl: url,
        platform: "chatgpt",
        title: "ChatGPT 对话",
        turns,
      }
    } finally {
      await browser.close()
    }
  },
}
