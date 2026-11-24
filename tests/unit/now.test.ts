import { expect, test } from 'vitest';
import { daysSince, isStale } from '../../src/lib/now';

test('older than 45 days is stale', () => {
  expect(isStale(new Date('2026-10-01'), new Date('2026-11-24'))).toBe(true);
});

test('recent is fresh', () => {
  expect(isStale(new Date('2026-11-01'), new Date('2026-11-24'))).toBe(false);
});

test('a date later than today counts as 0 days, not negative', () => {
  expect(daysSince(new Date('2026-11-24'), new Date('2026-11-23'))).toBe(0);
});

test('exactly 45 days is not stale', () => {
  expect(daysSince(new Date('2026-10-10'), new Date('2026-11-24'))).toBe(45);
  expect(isStale(new Date('2026-10-10'), new Date('2026-11-24'))).toBe(false);
});
