import type { Conversation } from "@/lib/types"

export interface PlatformParser {
  id: string
  name: string
  canHandle(url: string): boolean
  parse(url: string): Promise<Conversation>
}
