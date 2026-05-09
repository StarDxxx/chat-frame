import type { Conversation } from "./types"

export const PLACEHOLDER_CONVERSATION: Conversation = {
  source: "text",
  platform: "text",
  turns: [
    {
      id: "p1",
      role: "user",
      content: "我有时候觉得，努力了也没用。",
    },
    {
      id: "p2",
      role: "assistant",
      content:
        "不是努力没用，是你还没看到它开花的那一天。\n\n有些事情的回报，藏在你看不见的地方悄悄生长。",
    },
  ],
}

export const PLACEHOLDER_SELECTED_IDS = ["p2"]
