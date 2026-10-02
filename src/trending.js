const GITHUB_API = "https://api.github.com";

/**
 * Fetch repos created within the look-back window, ordered by star count.
 * Practical stand-in for GitHub's trending page, which has no public API.
 */
export async function fetchTrending({ days, limit, language }) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const created = since.toISOString().slice(0, 10);

  let query = `created:>=${created} stars:>50`;
  if (language) query += ` language:${language}`;

  const url = new URL(`${GITHUB_API}/search/repositories`);
  url.searchParams.set("q", query);
  url.searchParams.set("sort", "stars");
  url.searchParams.set("order", "desc");
  url.searchParams.set("per_page", String(limit));

  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "gh-digest",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`GitHub API error ${res.status}: ${await res.text()}`);
  }
  const data = await res.json();
  return data.items ?? [];
}
