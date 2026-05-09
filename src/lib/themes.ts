import type { EmotionTheme } from "./types"

export const THEMES: EmotionTheme[] = [
  {
    id: "graphite",
    label: "石墨",
    description: "深灰 · 沉静",
    gradient: "from-slate-700 via-slate-800 to-zinc-900",
    cardBg: "bg-white/5 backdrop-blur-md",
    textColor: "text-slate-100",
    accentColor: "text-slate-400",
    fontStyle: "font-sans",
  },
  {
    id: "sky",
    label: "天蓝",
    description: "晴空 · 通透",
    gradient: "from-sky-300 via-blue-400 to-indigo-500",
    cardBg: "bg-white/15 backdrop-blur-md",
    textColor: "text-white",
    accentColor: "text-sky-100",
    fontStyle: "font-serif",
  },
  {
    id: "ocean",
    label: "碧蓝",
    description: "清透 · 灵动",
    gradient: "from-[#6cd4c4] to-[#5797f8]",
    cardBg: "bg-white/15 backdrop-blur-md",
    textColor: "text-white",
    accentColor: "text-cyan-100",
    fontStyle: "font-sans",
  },
]

export function getTheme(id: string): EmotionTheme {
  return THEMES.find((t) => t.id === id) ?? THEMES[0]
}
