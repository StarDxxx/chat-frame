<div align="center">

# AI Frame

**Turn AI conversations into shareable cards.**

[English](#english) · [中文](#中文) · [日本語](#日本語)

</div>

---

<a name="english"></a>

## English

AI Frame lets you import a conversation from ChatGPT, Claude, or DeepSeek, select the moments that matter, edit and style them, then export a polished card image ready to share.

<div align="center">
  <img src="docs/assets/card_demo_cn.png" width="220" alt="Generated card — Chinese" />
  &nbsp;&nbsp;
  <img src="docs/assets/claude_demo_en.png" width="220" alt="Import from Claude — English" />
  &nbsp;&nbsp;
  <img src="docs/assets/chatgpt_demo_jp.png" width="220" alt="Import from ChatGPT — Japanese" />
</div>

### Features

| | |
|---|---|
| **Multi-platform import** | DeepSeek share links (direct API); ChatGPT & Claude via server-side rendering |
| **Text file import** | Drop a `.txt` with `AI:` / `Human:` prefixes — no account required |
| **Rich text editing** | Bold · Italic · Underline · Blur-redact sensitive content |
| **Card themes** | Graphite · Sky · Ocean |
| **Export sizes** | Square 1080 · Xiaohongshu 900×1200 · Xiaohongshu Long 900×1500 · Douyin 1080×1920 |
| **i18n** | UI in English, Chinese, Japanese — per-locale font selection |
| **Hi-res export** | Pixel-perfect PNG, auto page-break on long conversations |

### Quick Start

```bash
npm install
npm run dev
# → http://localhost:3000
```

### Tech Stack

Next.js 16 · React 19 · Tiptap · Tailwind CSS 4 · Framer Motion · Puppeteer · html-to-image

---

<a name="中文"></a>

## 中文

AI Frame 可以将你在 ChatGPT、Claude 或 DeepSeek 上的对话导入，选取想保留的片段，编辑排版，最终导出为一张精美的分享卡片。

<div align="center">
  <img src="docs/assets/card_demo_cn.png" width="220" alt="生成卡片 — 中文" />
  &nbsp;&nbsp;
  <img src="docs/assets/claude_demo_en.png" width="220" alt="从 Claude 导入 — 英文" />
  &nbsp;&nbsp;
  <img src="docs/assets/chatgpt_demo_jp.png" width="220" alt="从 ChatGPT 导入 — 日文" />
</div>

### 功能

| | |
|---|---|
| **多平台导入** | DeepSeek 分享链接直接解析；ChatGPT & Claude 服务端渲染抓取 |
| **文本文件导入** | 支持 `.txt` 格式（`AI:` / `人类:` 前缀），无需账号 |
| **富文本编辑** | 加粗 · 斜体 · 下划线 · 模糊打码敏感内容 |
| **卡片配色** | 石墨 · 天蓝 · 碧蓝 |
| **导出尺寸** | 方形 1080 · 小红书 900×1200 · 小红书竖长 900×1500 · 抖音 1080×1920 |
| **多语言界面** | 中文 · 英文 · 日文，各语言独立字体选择 |
| **高清导出** | 按目标分辨率计算像素比，长对话自动分页 |

### 快速开始

```bash
npm install
npm run dev
# → http://localhost:3000
```

### 技术栈

Next.js 16 · React 19 · Tiptap · Tailwind CSS 4 · Framer Motion · Puppeteer · html-to-image

---

<a name="日本語"></a>

## 日本語

AI Frame は ChatGPT・Claude・DeepSeek のトーク履歴をインポートし、印象的なシーンを選んで編集・スタイリングしたうえで、シェア用の高品質カード画像として書き出すツールです。

<div align="center">
  <img src="docs/assets/card_demo_cn.png" width="220" alt="生成カード — 中国語" />
  &nbsp;&nbsp;
  <img src="docs/assets/claude_demo_en.png" width="220" alt="Claude からインポート — 英語" />
  &nbsp;&nbsp;
  <img src="docs/assets/chatgpt_demo_jp.png" width="220" alt="ChatGPT からインポート — 日本語" />
</div>

### 機能

| | |
|---|---|
| **マルチプラットフォーム対応** | DeepSeek 共有リンクを直接解析；ChatGPT & Claude はサーバーサイドレンダリングで取得 |
| **テキストファイル入力** | `AI:` / `Human:` プレフィックス付き `.txt` ファイルに対応、アカウント不要 |
| **リッチテキスト編集** | 太字 · 斜体 · 下線 · センシティブ内容のぼかし処理 |
| **カードカラー** | グラファイト · スカイ · オーシャン |
| **エクスポートサイズ** | スクエア 1080 · Xiaohongshu 900×1200 · Xiaohongshu ロング 900×1500 · Douyin 1080×1920 |
| **多言語 UI** | 日本語・中国語・英語、言語ごとにフォント選択可能 |
| **高解像度エクスポート** | ターゲット解像度に合わせたピクセル比で PNG 出力、長い会話は自動改ページ |

### クイックスタート

```bash
npm install
npm run dev
# → http://localhost:3000
```

### 技術スタック

Next.js 16 · React 19 · Tiptap · Tailwind CSS 4 · Framer Motion · Puppeteer · html-to-image

---

<div align="center">
<sub>MIT License</sub>
</div>
