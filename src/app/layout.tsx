import type { Metadata } from "next"
import {
  Noto_Serif_SC, Noto_Serif_JP,
  EB_Garamond, Cormorant_Garamond, Sacramento,
  Shippori_Mincho, Klee_One,
  ZCOOL_XiaoWei, Ma_Shan_Zheng,
} from "next/font/google"
import "./globals.css"

const notoSerifSC = Noto_Serif_SC({
  weight: ["400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-zh",
  display: "swap",
  preload: false,
})

const notoSerifJP = Noto_Serif_JP({
  weight: ["400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-ja",
  display: "swap",
  preload: false,
})

const ebGaramond = EB_Garamond({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-eb-garamond",
  display: "swap",
  preload: false,
})

const cormorant = Cormorant_Garamond({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
  preload: false,
})

const sacramento = Sacramento({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-sacramento",
  display: "swap",
  preload: false,
})

const shipporiMincho = Shippori_Mincho({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-shippori",
  display: "swap",
  preload: false,
})

const kleeOne = Klee_One({
  weight: ["400", "600"],
  subsets: ["latin"],
  variable: "--font-klee",
  display: "swap",
  preload: false,
})

const zcoolXiaowei = ZCOOL_XiaoWei({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-zcool-xiaowei",
  display: "swap",
  preload: false,
})

const maShanZheng = Ma_Shan_Zheng({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-ma-shan-zheng",
  display: "swap",
  preload: false,
})

export const metadata: Metadata = {
  title: "AI Frame",
  description: "Turn AI conversations into editorial share cards.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const fontVars = [
    notoSerifSC.variable,
    notoSerifJP.variable,
    ebGaramond.variable,
    cormorant.variable,
    sacramento.variable,
    shipporiMincho.variable,
    kleeOne.variable,
    zcoolXiaowei.variable,
    maShanZheng.variable,
  ].join(" ")

  return (
    <html lang="zh-CN" className={`${fontVars} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
