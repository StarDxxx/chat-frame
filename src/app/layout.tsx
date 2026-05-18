import type { Metadata } from "next"
import { Noto_Serif_SC, Noto_Serif_JP } from "next/font/google"
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

export const metadata: Metadata = {
  title: "AI Frame",
  description: "Turn AI conversations into editorial share cards.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${notoSerifSC.variable} ${notoSerifJP.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
