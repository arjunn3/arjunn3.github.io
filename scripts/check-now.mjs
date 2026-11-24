// Prints how old src/content/now.md is. Exits 3 when it's stale (so the weekly
// workflow can open a reminder issue), 2 if the date is missing, 0 otherwise.
// Any other non-zero exit is a crash and fails the workflow instead.
// Imports the same rule the site uses, via Node's built-in TypeScript support.
import { readFileSync } from 'node:fs';
import { daysSince, isStale } from '../src/lib/now.ts';

const source = readFileSync(new URL('../src/content/now.md', import.meta.url), 'utf8');
const match = source.match(/^updated:\s*["']?(\d{4}-\d{2}-\d{2})/m);
if (!match) {
  console.error('src/content/now.md has no "updated: YYYY-MM-DD" line.');
  process.exit(2);
}

const updated = new Date(match[1]);
const today = new Date();
console.log(`now.md was last updated ${daysSince(updated, today)} day(s) ago (${match[1]}).`);
process.exit(isStale(updated, today) ? 3 : 0);
