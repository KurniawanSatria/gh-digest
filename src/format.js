/**
 * Render the digest as Markdown.
 */
export function formatDigest(repos, { days, language }) {
  const title = `# GitHub Digest — last ${days} day${days === 1 ? "" : "s"}${
    language ? ` (${language})` : ""
  }`;

  if (repos.length === 0) {
    return `${title}\n\nNo trending repositories found.`;
  }

  const lines = repos.map((repo, i) => {
    const lang = repo.language ? ` · ${repo.language}` : "";
    const desc = repo.description ?? "No description";
    return `${i + 1}. **[${repo.full_name}](${repo.html_url})** ⭐ ${repo.stargazers_count}${lang}\n   ${desc}`;
  });

  return `${title}\n\n${lines.join("\n\n")}\n`;
}
