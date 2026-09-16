export const REPO = 'alihahamed/curtain'

/**
 * Star count for the repo, cached an hour. Null when GitHub is unreachable or
 * rate-limits us, so the bar can leave the number out rather than show a 0.
 */
export async function githubStars(): Promise<number | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}`, {
      // GitHub rejects API calls without a User-Agent, and pins behaviour to a version.
      headers: {
        accept: 'application/vnd.github+json',
        'user-agent': 'curtain.dev',
        'x-github-api-version': '2022-11-28',
      },
      next: { revalidate: 3600 },
    })
    if (!res.ok) return null
    const json: { stargazers_count?: unknown } = await res.json()
    return typeof json.stargazers_count === 'number' ? json.stargazers_count : null
  } catch {
    return null
  }
}

/** 987 → 987, 1204 → 1.2k, 15300 → 15k. */
export function formatStars(n: number) {
  return n < 1000 ? String(n) : (n / 1000).toFixed(n < 10000 ? 1 : 0).replace(/\.0$/, '') + 'k'
}
