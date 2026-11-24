import { expect, test } from 'vitest';
import { workSchema } from '../../src/lib/schemas';

const minimal = {
  title: 'Linker Case',
  summary: 'Clinical cases built from a curriculum knowledge graph.',
  year: 2026,
  group: 'orfiq',
  order: 1,
  role: 'Built it',
  stack: ['Neo4j'],
};

test('status defaults to draft', () => {
  expect(workSchema.parse(minimal).status).toBe('draft');
});

test('rejects unknown group', () => {
  expect(workSchema.safeParse({ ...minimal, group: 'misc' }).success).toBe(false);
});

test('ownership defaults to owner and every entry gets a page unless it opts out', () => {
  const parsed = workSchema.parse(minimal);
  expect([parsed.ownership, parsed.page]).toEqual(['owner', true]);
});

test('rejects unknown area', () => {
  expect(workSchema.safeParse({ ...minimal, area: 'misc' }).success).toBe(false);
});

test('steps need title and text', () => {
  expect(workSchema.safeParse({ ...minimal, steps: [{ title: 'x' }] }).success).toBe(false);
});
