const MAX_CONTENT = 2000;

/**
 * Post Markdown to a Discord webhook. Long digests are split on
 * paragraph boundaries so no message exceeds Discord's limit.
 */
export async function postToDiscord(webhookUrl, markdown) {
  const chunks = chunk(markdown, MAX_CONTENT);
  for (const content of chunks) {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    if (!res.ok) {
      throw new Error(`Discord webhook error ${res.status}: ${await res.text()}`);
    }
  }
}

function chunk(text, size) {
  const parts = [];
  let rest = text;
  while (rest.length > size) {
    let cut = rest.lastIndexOf("\n\n", size);
    if (cut < size / 2) cut = size;
    parts.push(rest.slice(0, cut));
    rest = rest.slice(cut).replace(/^\n+/, "");
  }
  if (rest.length > 0) parts.push(rest);
  return parts;
}
