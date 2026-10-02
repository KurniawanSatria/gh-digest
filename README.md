# gh-digest

Weekly digest of trending GitHub repositories, rendered as Markdown and optionally posted to a Discord webhook.

## Install

```bash
npx gh-digest                      # run without installing
npm install -g gh-digest           # or install globally
node index.js                      # or clone and run
```

## Usage

```bash
gh-digest [--days 7] [--limit 10] [--language javascript] \
          [--webhook https://discord.com/api/webhooks/...] [--out digest.md]
```

| Flag | Default | Description |
| --- | --- | --- |
| `--days` | 7 | Look back this many days |
| `--limit` | 10 | Number of repos (1–50) |
| `--language` | — | Filter by primary language |
| `--webhook` | `$DISCORD_WEBHOOK_URL` | Discord webhook URL |
| `--out` | — | Also write the digest to a file |

Set `GITHUB_TOKEN` to raise GitHub API rate limits.

## How "trending" is computed

GitHub's trending page has no public API, so gh-digest approximates it: repositories created within the look-back window, sorted by star count via the [search API](https://docs.github.com/en/rest/search).

## Automate it

The included GitHub Actions workflow (`.github/workflows/digest.yml`) runs every Monday and posts to the `DISCORD_WEBHOOK_URL` secret in your repo settings.

## License

MIT
