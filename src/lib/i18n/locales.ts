export type Locale = "en" | "zh" | "ja"

export type Translations = {
  brand: {
    name: string
    tagline: string
  }
  header: {
    clips: string
    export: string
  }
  panels: {
    copyDesk: string
    sourceMaterial: string
    printProof: string
    livePlate: string
  }
  import: {
    title: string
    subtitle: string
    sample: string
    collapse: string
    shareLink: string
    sharePlaceholder: string
    transcriptFile: string
    transcriptHint: string
    transcriptFormat: string
    reimport: string
    select: string
    importedCopy: string
    turns: string
    errParse: string
    errNoTurns: string
    errNetwork: string
    errTxtOnly: string
    errNoTurnsFile: string
  }
  editor: {
    emptyTitle: string
    emptySubtitle: string
    sampleBanner: string
    sourceNote: string
    aiResponse: string
    removeTurn: string
    bold: string
    italic: string
    underline: string
    blurText: string
    deleteSelection: string
  }
  preview: {
    card: string
    classic: string
    chatApp: string
    exportPng: string
    typeSize: string
    showAvatars: string
    userLabel: string
    aiLabel: string
    showFooter: string
    showDate: string
  }
  size: {
    square: string
    xiaohongshu: string
    xiaohongshuLong: string
    douyin: string
  }
  select: {
    title: string
    summary: string
    prompt: string
    response: string
    turn: string
    collapse: string
    expand: string
    cancel: string
    confirm: string
  }
  themes: {
    graphite: string
    sky: string
    ocean: string
  }
}

const en: Translations = {
  brand: {
    name: "AI Frame",
    tagline: "Edit · Clip · Typeset · Export",
  },
  header: {
    clips: "{n} clips",
    export: "Export",
  },
  panels: {
    copyDesk: "Copy Desk",
    sourceMaterial: "source material",
    printProof: "Print Proof",
    livePlate: "live plate",
  },
  import: {
    title: "Import a conversation",
    subtitle: "Paste a share link, or drop a prepared transcript.",
    sample: "sample",
    collapse: "Collapse",
    shareLink: "Share link",
    sharePlaceholder: "DeepSeek / ChatGPT / Claude share URL",
    transcriptFile: "Transcript file",
    transcriptHint: "Drop a .txt file here, or click to choose one.",
    transcriptFormat: "Supports AI: / Human: turns and alternating blocks.",
    reimport: "Reimport",
    select: "Select",
    importedCopy: "Imported copy",
    turns: "{n} turns",
    errParse: "Parse failed",
    errNoTurns: "No dialogue turns were found.",
    errNetwork: "Network error. Try again.",
    errTxtOnly: "Only .txt files are supported.",
    errNoTurnsFile: "No dialogue turns were found. Check the text format.",
  },
  editor: {
    emptyTitle: "No copy on the desk.",
    emptySubtitle: "Import a conversation and the editable transcript will appear here.",
    sampleBanner: "sample copy / import your own to replace it",
    sourceNote: "Source note",
    aiResponse: "AI response",
    removeTurn: "Remove turn",
    bold: "Bold",
    italic: "Italic",
    underline: "Underline",
    blurText: "Blur sensitive text",
    deleteSelection: "Delete selection",
  },
  preview: {
    card: "Editorial card",
    classic: "Native AI",
    chatApp: "Chat app",
    exportPng: "Export PNG",
    typeSize: "Type size",
    showAvatars: "Show avatars",
    userLabel: "User",
    aiLabel: "AI",
    showFooter: "Show footer",
    showDate: "Show date",
  },
  size: {
    square: "Square",
    xiaohongshu: "Portrait",
    xiaohongshuLong: "Long post",
    douyin: "Reel",
  },
  select: {
    title: "Select the Clippings",
    summary: "{total} turns total · {selected} selected",
    prompt: "Prompt",
    response: "Response",
    turn: "turn {n}",
    collapse: "Collapse",
    expand: "Expand",
    cancel: "Cancel",
    confirm: "Confirm selection",
  },
  themes: {
    graphite: "Graphite",
    sky: "Sky",
    ocean: "Ocean",
  },
}

const zh: Translations = {
  brand: {
    name: "AI Frame",
    tagline: "剪辑 · 排版 · 导出",
  },
  header: {
    clips: "{n} 条",
    export: "导出",
  },
  panels: {
    copyDesk: "稿件台",
    sourceMaterial: "原始素材",
    printProof: "打样预览",
    livePlate: "实时版面",
  },
  import: {
    title: "导入对话",
    subtitle: "粘贴分享链接，或上传文字稿。",
    sample: "示例",
    collapse: "收起",
    shareLink: "分享链接",
    sharePlaceholder: "DeepSeek / ChatGPT / Claude 分享链接",
    transcriptFile: "文字稿文件",
    transcriptHint: "拖入 .txt 文件，或点击选择。",
    transcriptFormat: "支持 AI: / 人类: 格式以及交替段落。",
    reimport: "重新导入",
    select: "选择片段",
    importedCopy: "已导入",
    turns: "{n} 条对话",
    errParse: "解析失败",
    errNoTurns: "未找到对话内容。",
    errNetwork: "网络错误，请重试。",
    errTxtOnly: "仅支持 .txt 文件。",
    errNoTurnsFile: "未找到对话内容，请检查文本格式。",
  },
  editor: {
    emptyTitle: "稿件台空空如也。",
    emptySubtitle: "导入对话后，可编辑的文字稿将显示在这里。",
    sampleBanner: "示例内容 / 导入你自己的对话以替换",
    sourceNote: "提问",
    aiResponse: "AI 回应",
    removeTurn: "删除此条",
    bold: "粗体",
    italic: "斜体",
    underline: "下划线",
    blurText: "模糊敏感内容",
    deleteSelection: "删除选中",
  },
  preview: {
    card: "编辑卡片",
    classic: "原生界面",
    chatApp: "聊天界面",
    exportPng: "导出 PNG",
    typeSize: "字号",
    showAvatars: "显示头像",
    userLabel: "用户",
    aiLabel: "AI",
    showFooter: "显示页脚",
    showDate: "显示日期",
  },
  size: {
    square: "方格",
    xiaohongshu: "小红书",
    xiaohongshuLong: "小红书长文",
    douyin: "抖音",
  },
  select: {
    title: "选择片段",
    summary: "共 {total} 条 · 已选 {selected} 条",
    prompt: "提问",
    response: "回应",
    turn: "第 {n} 条",
    collapse: "收起",
    expand: "展开",
    cancel: "取消",
    confirm: "确认选择",
  },
  themes: {
    graphite: "石墨",
    sky: "天蓝",
    ocean: "碧蓝",
  },
}

const ja: Translations = {
  brand: {
    name: "AI Frame",
    tagline: "編集・切り抜き・組版",
  },
  header: {
    clips: "{n} 件",
    export: "書き出し",
  },
  panels: {
    copyDesk: "原稿台",
    sourceMaterial: "素材",
    printProof: "プレビュー",
    livePlate: "版面",
  },
  import: {
    title: "会話をインポート",
    subtitle: "共有リンクを貼り付けるか、テキストをドロップ。",
    sample: "サンプル",
    collapse: "閉じる",
    shareLink: "共有リンク",
    sharePlaceholder: "DeepSeek / ChatGPT / Claude の共有 URL",
    transcriptFile: "テキストファイル",
    transcriptHint: ".txt ファイルをドロップ、またはクリックして選択。",
    transcriptFormat: "AI: / Human: 形式および交互ブロックに対応。",
    reimport: "再インポート",
    select: "選択",
    importedCopy: "インポート済み",
    turns: "{n} 件",
    errParse: "解析エラー",
    errNoTurns: "会話が見つかりませんでした。",
    errNetwork: "ネットワークエラー。再試行してください。",
    errTxtOnly: ".txt ファイルのみ対応しています。",
    errNoTurnsFile: "会話が見つかりません。形式を確認してください。",
  },
  editor: {
    emptyTitle: "原稿がありません。",
    emptySubtitle: "会話をインポートすると、編集可能なテキストが表示されます。",
    sampleBanner: "サンプルコンテンツ / インポートして置き換えてください",
    sourceNote: "プロンプト",
    aiResponse: "AI の返答",
    removeTurn: "削除",
    bold: "太字",
    italic: "斜体",
    underline: "下線",
    blurText: "機密テキストをぼかす",
    deleteSelection: "選択を削除",
  },
  preview: {
    card: "エディトリアル",
    classic: "ネイティブ AI",
    chatApp: "チャット風",
    exportPng: "PNG 書き出し",
    typeSize: "文字サイズ",
    showAvatars: "アバター表示",
    userLabel: "ユーザー",
    aiLabel: "AI",
    showFooter: "フッター表示",
    showDate: "日付表示",
  },
  size: {
    square: "スクエア",
    xiaohongshu: "小紅書",
    xiaohongshuLong: "縦長",
    douyin: "リール",
  },
  select: {
    title: "クリップを選択",
    summary: "全 {total} 件 · {selected} 件選択中",
    prompt: "プロンプト",
    response: "返答",
    turn: "{n} 番目",
    collapse: "閉じる",
    expand: "展開",
    cancel: "キャンセル",
    confirm: "選択を確定",
  },
  themes: {
    graphite: "黒鉛",
    sky: "空色",
    ocean: "海色",
  },
}

export const LOCALES: Record<Locale, Translations> = { en, zh, ja }
