"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { LOCALES, type Locale, type Translations } from "./locales"

export type { Locale, Translations }
export { LOCALES }

type VarsMap = Record<string, string | number>

type ContextValue = {
  locale: Locale
  setLocale: (l: Locale) => void
  t: (path: string, vars?: VarsMap) => string
}

function interpolate(str: string, vars?: VarsMap): string {
  if (!vars) return str
  return str.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`))
}

function resolve(obj: unknown, path: string): string {
  const parts = path.split(".")
  let curr = obj
  for (const p of parts) {
    if (typeof curr !== "object" || curr === null) return path
    curr = (curr as Record<string, unknown>)[p]
  }
  return typeof curr === "string" ? curr : path
}

const LocaleCtx = createContext<ContextValue | null>(null)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleRaw] = useState<Locale>("zh")

  const setLocale = (l: Locale) => {
    setLocaleRaw(l)
    document.documentElement.dataset.locale = l
    document.documentElement.lang = l === "zh" ? "zh-CN" : l === "ja" ? "ja" : "en"
    try { localStorage.setItem("locale", l) } catch {}
  }

  useEffect(() => {
    const saved = localStorage.getItem("locale") as Locale | null
    const initial: Locale = (saved === "en" || saved === "zh" || saved === "ja") ? saved : "zh"
    setLocale(initial)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const t = (path: string, vars?: VarsMap): string => {
    const str = resolve(LOCALES[locale], path)
    return interpolate(str, vars)
  }

  return <LocaleCtx.Provider value={{ locale, setLocale, t }}>{children}</LocaleCtx.Provider>
}

export function useLocale() {
  const ctx = useContext(LocaleCtx)
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider")
  return ctx
}
