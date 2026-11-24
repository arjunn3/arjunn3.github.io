import { existsSync, readFileSync } from 'node:fs';

/**
 * Phrases that must never appear on the site. Only non-sensitive patterns
 * live in this public file. The sensitive list (names and identifiers that
 * must stay private) is loaded from:
 *   - tests/forbidden.local.json (git-ignored) on your machine, or
 *   - the FORBIDDEN_TERMS environment variable in CI (a repository secret):
 *     the same terms, one per line.
 * In CI the tests fail if neither is present, so the guard can't quietly vanish.
 */
const publicPatterns: RegExp[] = [
  /github\.com\/orfiq/i,
  /hallucination rate/i,
  /<\s*0\.51\s*s/i,
  /100% test/i,
  /model routing/i,
];

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const toPattern = (term: string) => new RegExp(`\\b${escape(term.trim())}\\b`, 'i');

function privateTerms(): string[] {
  const local = new URL('./forbidden.local.json', import.meta.url);
  if (existsSync(local)) return JSON.parse(readFileSync(local, 'utf8')) as string[];
  const fromEnv = process.env.FORBIDDEN_TERMS?.split('\n').filter((t) => t.trim()) ?? [];
  if (fromEnv.length) return fromEnv;
  if (process.env.CI) throw new Error('FORBIDDEN_TERMS secret is missing: the confidentiality guard cannot run.');
  return [];
}

export const forbidden: RegExp[] = [...publicPatterns, ...privateTerms().map(toPattern)];
