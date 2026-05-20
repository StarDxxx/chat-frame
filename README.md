<div align="center">

# AI Frame

**Turn AI conversations into shareable cards.**

[English](README.md) · [中文](README.zh.md) · [日本語](README.ja.md)

</div>

---

AI Frame lets you import a conversation from ChatGPT, Claude, or DeepSeek, select the moments that matter, edit and style them, then export a polished card image ready to share.

<div align="center">
  <img src="docs/assets/card_demo_cn.png" width="220" alt="Generated card — Chinese" />
  &nbsp;&nbsp;
  <img src="docs/assets/claude_demo_en.png" width="220" alt="Import from Claude — English" />
  &nbsp;&nbsp;
  <img src="docs/assets/chatgpt_demo_jp.png" width="220" alt="Import from ChatGPT — Japanese" />
</div>

## Features

| | |
|---|---|
| **Multi-platform import** | DeepSeek share links (direct API); ChatGPT & Claude via server-side rendering |
| **Text file import** | Drop a `.txt` with `AI:` / `Human:` prefixes — no account required |
| **Rich text editing** | Bold · Italic · Underline · Blur-redact sensitive content |
| **Card themes** | Graphite · Sky · Ocean |
| **Export sizes** | Square 1080 · Xiaohongshu 900×1200 · Xiaohongshu Long 900×1500 · Douyin 1080×1920 |
| **i18n** | UI in English, Chinese, Japanese — per-locale font selection |
| **Hi-res export** | Pixel-perfect PNG, auto page-break on long conversations |

## Quick Start

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Tech Stack

Next.js 16 · React 19 · Tiptap · Tailwind CSS 4 · Framer Motion · Puppeteer · html-to-image

---

<div align="center">
<sub>MIT License</sub>

<sub>Community · <a href="https://linux.do">linux.do</a></sub>
</div>
