import { test } from "node:test";
import assert from "node:assert/strict";
import { formatDigest } from "../src/format.js";

test("formatDigest renders ranked repos", () => {
  const repos = [
    {
      full_name: "a/b",
      html_url: "https://github.com/a/b",
      stargazers_count: 123,
      language: "TypeScript",
      description: "Test repo",
    },
  ];
  const out = formatDigest(repos, { days: 7, language: null });
  assert.match(out, /# GitHub Digest — last 7 days/);
  assert.match(out, /1\. \*\*\[a\/b\]/);
  assert.match(out, /⭐ 123/);
  assert.match(out, /TypeScript/);
});

test("formatDigest handles empty result", () => {
  const out = formatDigest([], { days: 1, language: "Rust" });
  assert.match(out, /last 1 day \(Rust\)/);
  assert.match(out, /No trending repositories found/);
});
