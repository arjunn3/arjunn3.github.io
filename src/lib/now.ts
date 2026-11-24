// Plain, erasable TypeScript only: scripts/check-now.mjs imports this file
// directly through Node's built-in type stripping.

const DAY_MS = 86_400_000;

/**
 * Whole calendar days between two dates, compared in UTC. Never negative: a
 * date "in the future" (e.g. written in IST while UTC is still yesterday) is 0.
 */
export function daysSince(updated: Date, today: Date): number {
  const utcDay = (d: Date) => Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  return Math.max(0, Math.floor((utcDay(today) - utcDay(updated)) / DAY_MS));
}

/**
 * Is the "Now" note old enough to need a refresh? 45 days by default, so the
 * weekly reminder fires before GitHub pauses scheduled jobs in a quiet
 * public repository (after 60 days).
 */
export function isStale(updated: Date, today: Date, maxDays = 45): boolean {
  return daysSince(updated, today) > maxDays;
}
