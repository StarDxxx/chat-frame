import puppeteer from "puppeteer";

const url = process.argv[2];
if (!url) {
  console.error("Usage: node extract-share.mjs <share-url>");
  process.exit(1);
}

const TIMEOUT = 30000;

const browser = await puppeteer.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-blink-features=AutomationControlled"],
});

try {
  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
  );
  await page.setViewport({ width: 1280, height: 800 });

  await page.goto(url, { waitUntil: "domcontentloaded", timeout: TIMEOUT });

  if (url.includes("claude.ai")) {
    const id = url.match(/share\/([a-f0-9-]+)/)?.[1];
    const messages = await page.evaluate(async (shareId) => {
      const r = await fetch(
        `/api/chat_snapshots/${shareId}?rendering_mode=messages&render_all_tools=true`
      );
      const data = await r.json();
      return {
        title: data.snapshot_name,
        created_by: data.created_by,
        messages: data.chat_messages.map((m) => ({
          role: m.sender === "human" ? "user" : "assistant",
          content: m.content
            .filter((c) => c.type === "text")
            .map((c) => c.text)
            .join("")
            .trim(),
        })),
      };
    }, id);
    console.log(JSON.stringify(messages, null, 2));
  } else {
    await page.waitForSelector("[data-message-author-role]", { timeout: 60000 });
    const messages = await page.evaluate(() => {
      const els = document.querySelectorAll("[data-message-author-role]");
      return Array.from(els).map((el) => ({
        role: el.getAttribute("data-message-author-role"),
        content: el.innerText.trim(),
      }));
    });
    console.log(JSON.stringify(messages, null, 2));
  }
} finally {
  await browser.close();
}
