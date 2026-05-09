"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import { BlurMark } from "@/lib/tiptap/blur-mark"
import { useEffect, useRef, useState } from "react"
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
  children,
}: {
  onClick: () => void
  active?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      onMouseDown={(e) => { e.preventDefault(); onClick() }}
      className={`px-2 py-0.5 text-[11px] rounded font-medium transition-colors
        ${active ? "bg-white text-gray-900" : "text-white/80 hover:text-white hover:bg-white/20"}`}
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
      // Position toolbar above the selection
      const sel = window.getSelection()
      if (sel && sel.rangeCount > 0 && containerRef.current) {
        const range = sel.getRangeAt(0)
        const selRect = range.getBoundingClientRect()
        const containerRect = containerRef.current.getBoundingClientRect()
        setToolbarPos({
          top: selRect.top - containerRect.top - 36,
          left: Math.max(0, selRect.left - containerRect.left + selRect.width / 2 - 100),
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

  return (
    <div
      ref={containerRef}
      className={`relative flex items-end gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Floating toolbar */}
      {hasSelection && toolbarPos && (
        <div
          className="absolute z-30 flex items-center gap-0.5 bg-gray-900 rounded-lg px-1.5 py-1 shadow-xl border border-white/10 pointer-events-auto"
          style={{ top: toolbarPos.top, left: toolbarPos.left }}
        >
          <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}>
            <strong>B</strong>
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}>
            <em>I</em>
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")}>
            <span className="underline">U</span>
          </ToolbarBtn>
          <div className="w-px h-3.5 bg-white/20 mx-0.5" />
          <ToolbarBtn onClick={() => editor.chain().focus().toggleMark("blur").run()} active={editor.isActive("blur")}>
            模糊
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().deleteSelection().run()}>
            删除
          </ToolbarBtn>
        </div>
      )}

      {/* Avatar */}
      <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold mb-0.5 border
        ${isUser
          ? "bg-primary/10 text-primary border-primary/20"
          : "bg-muted text-muted-foreground border-border"
        }`}
      >
        {avatarLabel}
      </div>

      {/* Bubble + editor */}
      <div className={`relative group max-w-[80%] flex flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}>
        <div className={`rounded-2xl px-4 py-2.5
          ${isUser
            ? "rounded-br-sm bg-primary/10 border border-primary/20"
            : "rounded-bl-sm bg-muted border border-border"
          }`}
        >
          <EditorContent editor={editor} />
        </div>

        <button
          onClick={onDelete}
          className={`opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-muted-foreground hover:text-destructive`}
        >
          移除此轮
        </button>
      </div>
    </div>
  )
}
