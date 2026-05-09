import type { Conversation, ConversationTurn } from "./types"

function makeId() {
  return Math.random().toString(36).slice(2, 9)
}

// Parse plain text in Q&A format:
// Lines starting with "User:", "Human:", "Q:", "你:", "问:" → user turn
// Lines starting with "AI:", "Assistant:", "A:", "Claude:", "DeepSeek:", "ChatGPT:", "答:" → assistant turn
// Falls back to splitting by double newlines and alternating roles
export function parseText(raw: string): Conversation {
  const lines = raw.trim().split("\n")
  const turns: ConversationTurn[] = []

  const userPrefixes = /^(User|Human|Q|你|问|人类)\s*[:：]/i
  const assistantPrefixes = /^(AI|Assistant|A|Claude|ChatGPT|DeepSeek|答)\s*[:：]/i

  let hasExplicitRoles = lines.some(
    (l) => userPrefixes.test(l) || assistantPrefixes.test(l)
  )

  if (hasExplicitRoles) {
    let currentRole: "user" | "assistant" | null = null
    let currentLines: string[] = []

    const flush = () => {
      if (currentRole && currentLines.length > 0) {
        turns.push({
          id: makeId(),
          role: currentRole,
          content: currentLines.join("\n").trim(),
        })
      }
      currentLines = []
    }

    for (const line of lines) {
      if (userPrefixes.test(line)) {
        flush()
        currentRole = "user"
        currentLines.push(line.replace(userPrefixes, "").trim())
      } else if (assistantPrefixes.test(line)) {
        flush()
        currentRole = "assistant"
        currentLines.push(line.replace(assistantPrefixes, "").trim())
      } else {
        currentLines.push(line)
      }
    }
    flush()
  } else {
    // Fallback: split by blank lines, alternate user/assistant
    const blocks = raw
      .trim()
      .split(/\n{2,}/)
      .map((b) => b.trim())
      .filter(Boolean)

    blocks.forEach((block, i) => {
      turns.push({
        id: makeId(),
        role: i % 2 === 0 ? "user" : "assistant",
        content: block,
      })
    })
  }

  return { source: "text", turns }
}

// Placeholder for URL parsing — actual fetch/scraping handled server-side later
export function isShareUrl(input: string): boolean {
  return (
    input.startsWith("http://") ||
    input.startsWith("https://")
  )
}

export function parseInput(input: string): Conversation {
  const trimmed = input.trim()
  if (isShareUrl(trimmed)) {
    // URL path: return a placeholder; real parsing is async via API route
    return {
      source: "url",
      rawUrl: trimmed,
      turns: [],
    }
  }
  return parseText(trimmed)
}
