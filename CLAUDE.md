# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server (Next.js 16, Turbopack)
npm run build    # production build
npm run lint     # ESLint
npx tsc --noEmit # type-check without emitting (run after every change)
```

No test suite exists yet. Always run `npx tsc --noEmit` to verify changes compile.

> **Important:** Always read the relevant guide in `node_modules/next/dist/docs/` before writing Next.js-specific code. This version (16.x) has breaking changes from what training data may assume.

---

## Architecture

Single-page app (`src/app/page.tsx`) with all state in one `PageState` object managed by a single `update()` partial-patch helper. No external state library.

### Two-panel layout

```
Header (brand only)
├── Left panel  [flex-6]  ImportBar (sticky) + ConversationEditor (scrollable)
└── Right panel [flex-4]  PreviewPanel (card preview + all controls)
```

### Data flow

```
Import (URL or .txt)
  └─▶ Conversation (turns[])               # raw parsed data
        └─▶ SelectModal (pick subset)
              └─▶ selectedTurns[]           # Markdown ConversationTurns
                    └─▶ ConversationEditor  # converts MD→HTML via marked, editable via Tiptap
                          └─▶ editedTurns[] # HTML ConversationTurns → drives CardPreview
```

`selectedTurns` (Markdown) re-initialises the editor when the turn-ID set changes. `editedTurns` (HTML) is what the card renders. These are kept separate so editor initialisation only fires on new imports, not on every keystroke.

### Import pipeline

Two entry points in `ImportBar`:
- **URL** → `POST /api/parse` → `src/lib/platforms/` parser registry → `Conversation`
- **.txt file** → client-side `parseText()` in `src/lib/parser.ts` → `Conversation`

After URL import the `SelectModal` opens automatically; after .txt import all turns are selected directly (user already curated the file).

Platform parsers live in `src/lib/platforms/`. Each implements `PlatformParser` (`canHandle` + `parse`). Only DeepSeek is implemented; ChatGPT/Claude parsers are registered stubs. To add a parser, implement the interface and push it onto the `parsers` array in `src/lib/platforms/index.ts`.

`parseText()` recognises prefixes `AI:`, `Human:`, `人类:`, `User:`, `你:`, etc. and accumulates multi-line turns until the next role prefix.

### Theme system (two-level)

```
ThemeCategoryId   →  "chat-app" | "card" | "memo" | "classic"
  └── CardColorId →  "graphite" | "sky" | "ocean"   (only relevant when category = "card")
```

- `ThemeCategoryId` selects the rendering template. Only `"card"` is implemented; the others show a placeholder.
- `CardColorId` (aliased as `EmotionThemeId`) selects the gradient/colour scheme within the card template. Defined in `src/lib/themes.ts`.
- `CardPreview` uses `bg-gradient-to-br` + `theme.gradient` for the card background. Always top-left → bottom-right.
- To add a card colour: add an `EmotionThemeId` value in `types.ts` and a matching entry in `themes.ts`.
- To implement a new category template: add a renderer branch in `PreviewPanel` and a matching export path in `page.tsx`.

### Card export & pagination

`CardPreview` renders into a DOM element (`id="card-export"`). Export uses `html-to-image` (`toPng`) with a pixel ratio calculated from the target export resolution vs. the on-screen element size.

`PreviewPanel` runs a hidden off-screen "ruler" div mirroring the card's content-area width and font size. A `ResizeObserver` + `useLayoutEffect` measure each bubble's rendered height to compute safe page-break positions (snapping to line boundaries, never cutting mid-line). This produces `pageOffsets[]`; the card renders one page at a time by `translateY(-offset)` inside an overflow-hidden viewport.

### Editor (Tiptap)

`TurnEditor` uses Tiptap with three extensions: `StarterKit`, `Underline`, and a custom `BlurMark` (`src/lib/tiptap/blur-mark.ts`). `BlurMark` renders as `<span data-blur style="filter:blur(5px)">` — it is also rendered in `CardPreview` via the HTML passthrough.

The floating format toolbar appears on text selection via `onSelectionUpdate`. It is hidden via `onBlur` (editor loses focus when clicking another bubble or outside), preventing stale toolbars from accumulating.

### Unused / legacy components

`src/components/dashboard/LeftPanel.tsx`, `RightPanel.tsx`, and `src/components/steps/` are not used by the main dashboard page. They are kept for potential future use but do not affect the running app.

---

## Key types (`src/lib/types.ts`)

| Type | Purpose |
|------|---------|
| `ConversationTurn` | `{ id, role, content, thinking? }` — one message |
| `Conversation` | `{ source, platform?, turns[] }` |
| `CardSettings` | All per-card options including `avatarUser`, `avatarAI`, `sizeId`, `layoutFlow`, `fontSize` |
| `ThemeCategoryId` | Top-level template selector |
| `EmotionThemeId` | Card colour variant (alias for `CardColorId`) |
