import type { PlatformParser } from "./types"
import { deepseekParser } from "./deepseek"
import { claudeParser } from "./claude"
import { chatgptParser } from "./chatgpt"

export const parsers: PlatformParser[] = [claudeParser, chatgptParser, deepseekParser]

export function getParser(url: string): PlatformParser | null {
  return parsers.find((p) => p.canHandle(url)) ?? null
}
