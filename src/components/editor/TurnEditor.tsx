"use client"

import { useEffect, useRef, useState } from "react"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import { Bold, EyeOff, Italic, Trash2, Underline as UnderlineIcon } from "lucide-react"
import { BlurMark } from "@/lib/tiptap/blur-mark"
import type { ConversationTurn } from "@/lib/types"

interface Props {
  turn: ConversationTurn
  initialHtml: string
  avatarUser?: string
  avatarAI?: string
  onChange: (html: string) => void
  onDelete: () => void
}

function ToolbarBtn({
  onClick,
  active,
  label,
  children,
}: {
  onClick: () => void
  active?: boolean
  label: string
  children: React.ReactNode
}) {
  return (
    <button
      onMouseDown={(e) => { e.preventDefault(); onClick() }}
      aria-label={label}
      title={label}
      className={`grid h-7 w-7 place-items-center border border-foreground text-[11px] transition-colors ${
        active ? "bg-[var(--proof)] text-background" : "bg-[var(--paper-soft)] text-foreground hover:bg-foreground hover:text-background"
      }`}
    >
      {children}
    </button>
  )
}

export function TurnEditor({ turn, initialHtml, avatarUser, avatarAI, onChange, onDelete }: Props) {
  const isUser = turn.role === "user"
  const avatarLabel = isUser ? (avatarUser || "我") : (avatarAI || "AI")
  const [hasSelection, setHasSelection] = useState(false)
  const [toolbarPos, setToolbarPos] = useState<{ top: number; left: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Underline, BlurMark],
    content: initialHtml,
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
    onSelectionUpdate({ editor }) {
      const { from, to } = editor.state.selection
      if (from === to) {
        setHasSelection(false)
        setToolbarPos(null)
        return
      }
      setHasSelection(true)
      const sel = window.getSelection()
      if (sel && sel.rangeCount > 0 && containerRef.current) {
        const range = sel.getRangeAt(0)
        const selRect = range.getBoundingClientRect()
        const containerRect = containerRef.current.getBoundingClientRect()
        setToolbarPos({
          top: selRect.top - containerRect.top - 40,
          left: Math.max(0, selRect.left - containerRect.left + selRect.width / 2 - 62),
        })
      }
    },
    onBlur() {
      setHasSelection(false)
      setToolbarPos(null)
    },
    editorProps: {
      attributes: {
        class: "outline-none min-h-[1.5rem] text-sm leading-relaxed",
      },
    },
  })

  useEffect(() => {
    if (editor && initialHtml && editor.isEmpty) {
      editor.commands.setContent(initialHtml)
    }
  }, [editor, initialHtml])

  if (!editor) return null

  // avatar w-8 (32px) + gap-3 (12px) = 44px = pl/pr-11
  const bubbleOffset = isUser ? "pr-11" : "pl-11"

  return (
    <div ref={containerRef} className="group relative">
      {/* Row: avatar + bubble, items-end so avatar bottom aligns with bubble bottom */}
      <div className={`relative flex items-end gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        {hasSelection && toolbarPos && (
          <div
            className="absolute z-30 flex items-center gap-1 border-2 border-foreground bg-[var(--paper)] p-1 ink-shadow"
            style={{ top: toolbarPos.top, left: toolbarPos.left }}
          >
            <ToolbarBtn label="Bold" onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}>
              <Bold className="h-3.5 w-3.5" />
            </ToolbarBtn>
            <ToolbarBtn label="Italic" onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}>
              <Italic className="h-3.5 w-3.5" />
            </ToolbarBtn>
            <ToolbarBtn label="Underline" onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")}>
              <UnderlineIcon className="h-3.5 w-3.5" />
            </ToolbarBtn>
            <ToolbarBtn label="Blur sensitive text" onClick={() => editor.chain().focus().toggleMark("blur").run()} active={editor.isActive("blur")}>
              <EyeOff className="h-3.5 w-3.5" />
            </ToolbarBtn>
            <ToolbarBtn label="Delete selection" onClick={() => editor.chain().focus().deleteSelection().run()}>
              <Trash2 className="h-3.5 w-3.5" />
            </ToolbarBtn>
          </div>
        )}

        <div className={`mb-1 grid h-8 w-8 shrink-0 place-items-center border-2 border-foreground text-[10px] font-black ${
          isUser ? "bg-[var(--accent)]" : "bg-foreground text-background"
        }`}>
          {avatarLabel}
        </div>

        <div className={`relative max-w-[82%] border-2 border-foreground px-4 py-3 ${
          isUser
            ? "bg-[var(--accent)] proof-shadow"
            : "bg-[var(--paper-soft)] ink-shadow"
        }`}>
          <div className="mb-2 flex items-center gap-2 border-b border-foreground/35 pb-1 text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground">
            <span>{isUser ? "Source note" : "AI response"}</span>
          </div>
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Remove button sits below the bubble, offset to skip the avatar column */}
      <div className={`mt-1 flex ${isUser ? "justify-end " + bubbleOffset : "justify-start " + bubbleOffset}`}>
        <button
          onClick={onDelete}
          className="opacity-0 transition-opacity text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground hover:text-[var(--proof)] group-hover:opacity-100"
        >
          Remove turn
        </button>
      </div>
    </div>
  )
}
