import { NextRequest, NextResponse } from "next/server"
import { getParser } from "@/lib/platforms"
import { parseText } from "@/lib/parser"

export async function POST(req: NextRequest) {
  const { input } = await req.json()

  if (!input || typeof input !== "string") {
    return NextResponse.json({ error: "Missing input" }, { status: 400 })
  }

  const trimmed = input.trim()
  const parser = getParser(trimmed)

  if (parser) {
    try {
      const conversation = await parser.parse(trimmed)
      return NextResponse.json({ conversation })
    } catch (err) {
      const message = err instanceof Error ? err.message : "Parse failed"
      return NextResponse.json({ error: message }, { status: 502 })
    }
  }

  // Fallback: plain text parsing
  const conversation = parseText(trimmed)
  return NextResponse.json({ conversation })
}
