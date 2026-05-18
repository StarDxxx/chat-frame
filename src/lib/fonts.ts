import type { Locale } from "./i18n"

export type FontId =
  | "noto-serif-sc" | "zcool-xiaowei" | "ma-shan-zheng"
  | "noto-serif-jp" | "shippori-mincho" | "klee-one"
  | "eb-garamond" | "cormorant" | "sacramento"

export interface FontOption {
  id: FontId
  label: string
  sample: string   // preview character shown on button
  cssVar: string   // CSS variable set by next/font
  fallback: string
}

export const FONT_OPTIONS: Record<Locale, FontOption[]> = {
  zh: [
    { id: "noto-serif-sc",  label: "思源宋体", sample: "永", cssVar: "--font-zh",           fallback: "serif" },
    { id: "zcool-xiaowei",  label: "小薇体",   sample: "诗", cssVar: "--font-zcool-xiaowei", fallback: "serif" },
    { id: "ma-shan-zheng",  label: "毛笔楷",   sample: "笔", cssVar: "--font-ma-shan-zheng", fallback: "cursive" },
  ],
  ja: [
    { id: "noto-serif-jp",   label: "明朝体",       sample: "永", cssVar: "--font-ja",       fallback: "serif" },
    { id: "shippori-mincho", label: "しっぽり明朝", sample: "月", cssVar: "--font-shippori",  fallback: "serif" },
    { id: "klee-one",        label: "クリー体",     sample: "花", cssVar: "--font-klee",      fallback: "cursive" },
  ],
  en: [
    { id: "eb-garamond", label: "EB Garamond", sample: "Ag", cssVar: "--font-eb-garamond", fallback: "serif" },
    { id: "cormorant",   label: "Cormorant",   sample: "Ag", cssVar: "--font-cormorant",   fallback: "serif" },
    { id: "sacramento",  label: "Sacramento",  sample: "Ag", cssVar: "--font-sacramento",  fallback: "cursive" },
  ],
}

export const DEFAULT_FONT_ID: Record<Locale, FontId> = {
  zh: "noto-serif-sc",
  ja: "noto-serif-jp",
  en: "eb-garamond",
}

export function getFontFamily(locale: Locale, fontId: string): string {
  const option = FONT_OPTIONS[locale].find((f) => f.id === fontId) ?? FONT_OPTIONS[locale][0]
  return `var(${option.cssVar}), ${option.fallback}`
}
