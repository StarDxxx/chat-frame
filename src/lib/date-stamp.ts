import type { Locale } from "./i18n/locales"

export interface DateStamp {
  primary: string
}

const STEMS    = ["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"]
const BRANCHES = ["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"]

function ganzhiYear(year: number): string {
  const s = ((year - 1984) % 10 + 10) % 10
  const b = ((year - 1984) % 12 + 12) % 12
  return STEMS[s] + BRANCHES[b] + "年"
}

const LUNAR_DAYS = [
  "", "初一","初二","初三","初四","初五",
  "初六","初七","初八","初九","初十",
  "十一","十二","十三","十四","十五",
  "十六","十七","十八","十九","二十",
  "廿一","廿二","廿三","廿四","廿五",
  "廿六","廿七","廿八","廿九","三十",
]

const KANJI = ["","一","二","三","四","五","六","七","八","九","十",
  "十一","十二","十三","十四","十五","十六","十七","十八","十九","二十",
  "二十一","二十二","二十三","二十四","二十五","二十六","二十七","二十八","二十九","三十","三十一",
]

function toKanji(n: number): string {
  return KANJI[n] ?? String(n)
}

export function formatDateStamp(locale: Locale, date = new Date()): DateStamp {
  if (locale === "zh") {
    // Ganzhi year from formula (reliable), lunar month+day from Intl
    const year = ganzhiYear(date.getFullYear())
    try {
      const parts = new Intl.DateTimeFormat("zh-u-ca-chinese", {
        month: "long",
        day: "numeric",
      }).formatToParts(date)

      const month = parts.find(p => p.type === "month")?.value ?? ""
      const dayRaw = parts.find(p => p.type === "day")?.value ?? ""
      const dayNum = parseInt(dayRaw, 10)
      const day = !isNaN(dayNum) && dayNum >= 1 && dayNum <= 30
        ? LUNAR_DAYS[dayNum]
        : dayRaw

      return { primary: `${year}${month}${day}` }
    } catch {
      return { primary: year }
    }
  }

  if (locale === "ja") {
    // "令和八年五月十八日" — kanji numerals, ceremonial style
    try {
      const parts = new Intl.DateTimeFormat("ja-JP-u-ca-japanese", {
        era: "long",
        year: "numeric",
        month: "numeric",
        day: "numeric",
      }).formatToParts(date)

      const era  = parts.find(p => p.type === "era")?.value ?? ""
      const yr   = toKanji(parseInt(parts.find(p => p.type === "year")?.value ?? "0", 10))
      const mo   = toKanji(parseInt(parts.find(p => p.type === "month")?.value ?? "0", 10))
      const dy   = toKanji(parseInt(parts.find(p => p.type === "day")?.value ?? "0", 10))

      return { primary: `${era}${yr}年${mo}月${dy}日` }
    } catch {
      return {
        primary: new Intl.DateTimeFormat("ja-JP", {
          year: "numeric", month: "long", day: "numeric",
        }).format(date),
      }
    }
  }

  // EN: "May 18, 2026"
  return {
    primary: new Intl.DateTimeFormat("en-US", {
      month: "long", day: "numeric", year: "numeric",
    }).format(date),
  }
}
