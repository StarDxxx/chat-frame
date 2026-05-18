import type { CardSizeId } from "@/lib/types"

export interface CardSizePreset {
  id: CardSizeId
  label: string
  ratio: string          // reserved for future pagination mode
  previewWidth: number   // on-screen card width in px
  exportWidth: number
  exportHeight: number   // reserved for future pagination mode
}

export const CARD_SIZES: CardSizePreset[] = [
  { id: "square",           label: "方格",      ratio: "1/1",  previewWidth: 320, exportWidth: 1080, exportHeight: 1080 },
  { id: "xiaohongshu",      label: "小红书",    ratio: "3/4",  previewWidth: 300, exportWidth: 900,  exportHeight: 1200 },
  { id: "xiaohongshu-long", label: "小红书长文", ratio: "3/5", previewWidth: 280, exportWidth: 900,  exportHeight: 1500 },
  { id: "douyin",           label: "抖音",      ratio: "9/16", previewWidth: 250, exportWidth: 1080, exportHeight: 1920 },
]

export function getCardSize(id: CardSizeId): CardSizePreset {
  return CARD_SIZES.find((s) => s.id === id) ?? CARD_SIZES[0]
}
