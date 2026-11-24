import { expect, test } from 'vitest';
import type { WorkData } from '../../src/lib/schemas';
import {
  adjacentWork,
  featuredWork,
  groupByArea,
  groupWork,
  homeTiles,
  pageEntries,
  visibleWork,
  type WorkEntry,
} from '../../src/lib/work';

const base: WorkData = {
  title: 'x',
  summary: 's',
  year: 2026,
  group: 'orfiq',
  order: 1,
  featured: false,
  status: 'published',
  role: 'r',
  stack: [],
  code: 'private',
  visual: 'none',
  ownership: 'owner',
  page: true,
};
const e = (id: string, over: Partial<WorkData>): WorkEntry => ({ id, data: { ...base, title: id, ...over } });

test('visibleWork drops drafts when includeDrafts is false', () => {
  const list = [e('a', { order: 3 }), e('b', { order: 1, status: 'draft' }), e('c', { order: 2 })];
  expect(visibleWork(list, { includeDrafts: false }).map((x) => x.id)).toEqual(['c', 'a']);
  expect(visibleWork(list, { includeDrafts: true }).map((x) => x.id)).toEqual(['b', 'c', 'a']);
});

test('ties on order put the newer year first', () => {
  const list = [e('x', { year: 2025 }), e('y', { year: 2026 })];
  expect(visibleWork(list, { includeDrafts: false }).map((x) => x.id)).toEqual(['y', 'x']);
});

test('groupWork keeps fixed order and omits empty groups', () => {
  const g = groupWork([e('p', { group: 'academic' }), e('q', { group: 'orfiq' })]);
  expect(g.map((x) => [x.group, x.label])).toEqual([
    ['orfiq', 'At Orfiq'],
    ['academic', 'Academic'],
  ]);
});

test('adjacentWork returns neighbours', () => {
  const list = [e('x', {}), e('y', {}), e('z', {})];
  expect(adjacentWork(list, 'y')).toMatchObject({ prev: { id: 'x' }, next: { id: 'z' } });
  expect(adjacentWork(list, 'x').prev).toBeUndefined();
});

test('featuredWork throws when more than one entry is featured', () => {
  expect(() => featuredWork([e('a', { featured: true }), e('b', { featured: true })])).toThrow(
    'more than one featured',
  );
});

test('featuredWork returns undefined when nothing is featured', () => {
  expect(featuredWork([e('a', {})])).toBeUndefined();
});

test('groupByArea keeps a fixed order with labels and leaves out empty areas', () => {
  const g = groupByArea([
    e('a', { area: 'documents' }),
    e('b', { area: 'grounded-generation' }),
    e('c', { group: 'personal' }),
  ]);
  expect(g.map((x) => [x.area, x.label])).toEqual([
    ['grounded-generation', 'Grounded generation'],
    ['documents', 'Documents & structured data'],
  ]);
  expect(g.every((x) => x.blurb.length > 20)).toBe(true);
});

test('pageEntries drops card-only entries', () => {
  expect(pageEntries([e('a', {}), e('b', { page: false })]).map((x) => x.id)).toEqual(['a']);
});

test('homeTiles never picks a card-only entry, since a tile links to a page', () => {
  expect(homeTiles([e('a', { page: false }), e('b', {})], { exclude: [], count: 2 }).map((x) => x.id)).toEqual(['b']);
});

test('homeTiles skips excluded ids and non-orfiq work, at most count', () => {
  const list = [
    e('f', {}),
    e('n', {}),
    e('s', { group: 'personal' }),
    e('p1', {}),
    e('p2', {}),
    e('p3', {}),
    e('p4', {}),
  ];
  expect(homeTiles(list, { exclude: ['f', 'n'], count: 3 }).map((x) => x.id)).toEqual(['p1', 'p2', 'p3']);
});
