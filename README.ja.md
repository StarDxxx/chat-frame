<div align="center">

# AI Frame

**AI との会話を、シェアできるカードに。**

[English](README.md) · [中文](README.zh.md) · [日本語](README.ja.md)

</div>

---

AI Frame は ChatGPT・Claude・DeepSeek のトーク履歴をインポートし、印象的なシーンを選んで編集・スタイリングしたうえで、シェア用の高品質カード画像として書き出すツールです。

<div align="center">
  <img src="docs/assets/card_demo_cn.png" width="220" alt="生成カード — 中国語" />
  &nbsp;&nbsp;
  <img src="docs/assets/claude_demo_en.png" width="220" alt="Claude からインポート — 英語" />
  &nbsp;&nbsp;
  <img src="docs/assets/chatgpt_demo_jp.png" width="220" alt="ChatGPT からインポート — 日本語" />
</div>

## 機能

| | |
|---|---|
| **マルチプラットフォーム対応** | DeepSeek 共有リンクを直接解析；ChatGPT & Claude はサーバーサイドレンダリングで取得 |
| **テキストファイル入力** | `AI:` / `Human:` プレフィックス付き `.txt` ファイルに対応、アカウント不要 |
| **リッチテキスト編集** | 太字 · 斜体 · 下線 · センシティブ内容のぼかし処理 |
| **カードカラー** | グラファイト · スカイ · オーシャン |
| **エクスポートサイズ** | スクエア 1080 · Xiaohongshu 900×1200 · Xiaohongshu ロング 900×1500 · Douyin 1080×1920 |
| **多言語 UI** | 日本語・中国語・英語、言語ごとにフォント選択可能 |
| **高解像度エクスポート** | ターゲット解像度に合わせたピクセル比で PNG 出力、長い会話は自動改ページ |

## クイックスタート

```bash
npm install
npm run dev
# → http://localhost:3000
```

## 技術スタック

Next.js 16 · React 19 · Tiptap · Tailwind CSS 4 · Framer Motion · Puppeteer · html-to-image

---

<div align="center">
<sub>MIT License</sub>

<sub>コミュニティ · <a href="https://linux.do">linux.do</a></sub>
</div>
