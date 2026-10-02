#!/usr/bin/env node

import { fetchTrending } from "./src/trending.js";
import { formatDigest } from "./src/format.js";
import { postToDiscord } from "./src/discord.js";

function usage() {
  console.log(`Usage: gh-digest [options]

Options:
  --days <n>        Look back this many days (default: 7)
  --limit <n>       Number of repos in the digest (default: 10)
  --language <lang> Filter by primary language (optional)
  --webhook <url>   Post the digest to this Discord webhook URL
  --out <file>      Also write the Markdown digest to a file
  --help            Show this help message

Environment:
  GITHUB_TOKEN         Increases GitHub API rate limits (optional)
  DISCORD_WEBHOOK_URL  Used when --webhook is not passed (optional)
`);
}

function parseArgs(argv) {
  const opts = { days: 7, limit: 10, language: null, webhook: null, out: null };
  for (let i = 0; i < argv.length; i++) {
    switch (argv[i]) {
      case "--days":
        opts.days = Number(argv[++i]);
        break;
      case "--limit":
        opts.limit = Number(argv[++i]);
        break;
      case "--language":
        opts.language = argv[++i];
        break;
      case "--webhook":
        opts.webhook = argv[++i];
        break;
      case "--out":
        opts.out = argv[++i];
        break;
      case "--help":
        usage();
        process.exit(0);
      default:
        console.error(`Unknown option: ${argv[i]}`);
        usage();
        process.exit(1);
    }
  }
  if (!Number.isFinite(opts.days) || opts.days < 1) {
    console.error("--days must be a positive number");
    process.exit(1);
  }
  if (!Number.isFinite(opts.limit) || opts.limit < 1 || opts.limit > 50) {
    console.error("--limit must be between 1 and 50");
    process.exit(1);
  }
  return opts;
}

const opts = parseArgs(process.argv.slice(2));

try {
  const repos = await fetchTrending(opts);
  const markdown = formatDigest(repos, opts);
  console.log(markdown);

  if (opts.out) {
    const { writeFile } = await import("node:fs/promises");
    await writeFile(opts.out, markdown, "utf8");
    console.error(`\nWrote digest to ${opts.out}`);
  }

  const webhook = opts.webhook ?? process.env.DISCORD_WEBHOOK_URL ?? null;
  if (webhook) {
    await postToDiscord(webhook, markdown);
    console.error("\nPosted digest to Discord.");
  }
} catch (err) {
  console.error(`gh-digest: ${err.message}`);
  process.exit(1);
}
