import type { PlatformParser } from "./types"
import { deepseekParser } from "./deepseek"

// Registry — add ChatGPT / Claude parsers here when ready
export const parsers: PlatformParser[] = [deepseekParser]

export function getParser(url: string): PlatformParser | null {
  return parsers.find((p) => p.canHandle(url)) ?? null
}
