/**
 * Returns a human-readable relative time string from an ISO date string.
 *
 * < 1 min   → "Just now"
 * < 60 min  → "X minutes ago"
 * < 24 hrs  → "X hours ago"
 * < 7 days  → "X days ago"
 * < 4 weeks → "X weeks ago"
 * otherwise → "Mar 31, 2026"
 */
export function getRelativeTime(iso: string): string {
  const now = Date.now()
  const then = new Date(iso).getTime()
  const diffMs = now - then
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHr  = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHr  / 24)
  const diffWk  = Math.floor(diffDay / 7)

  if (diffMin < 1)  return 'Just now'
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`
  if (diffHr  < 24) return `${diffHr} hour${diffHr === 1 ? '' : 's'} ago`
  if (diffDay < 7)  return `${diffDay} day${diffDay === 1 ? '' : 's'} ago`
  if (diffWk  < 4)  return `${diffWk} week${diffWk === 1 ? '' : 's'} ago`

  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}
