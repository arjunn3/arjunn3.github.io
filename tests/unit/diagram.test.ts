import { expect, test } from 'vitest';
import { diagrams } from '../../src/diagrams';
import { anchor, autoSides, edgePath, validateDiagram, type DiagramSpec, type DNode } from '../../src/lib/diagram';
import { contentFiles, read } from '../helpers';

const A: DNode = { id: 'a', x: 0, y: 0, w: 100, h: 40, title: 'A' };
const B: DNode = { id: 'b', x: 200, y: 0, w: 100, h: 40, title: 'B' };
const C: DNode = { id: 'c', x: 0, y: 120, w: 100, h: 40, title: 'C' };

test('anchor returns side midpoints', () => {
  expect(anchor(A, 'r')).toEqual({ x: 100, y: 20 });
  expect(anchor(A, 'b')).toEqual({ x: 50, y: 40 });
});

test('autoSides picks left/right for side-by-side and top/bottom for stacked', () => {
  expect(autoSides(A, B)).toEqual(['r', 'l']);
  expect(autoSides(A, C)).toEqual(['b', 't']);
  expect(autoSides(B, A)).toEqual(['l', 'r']);
});

test('edgePath starts and ends on the anchors', () => {
  const d = edgePath(A, B, { from: 'a', to: 'b' });
  expect(d.startsWith('M100 20')).toBe(true);
  expect(d.endsWith('200 20')).toBe(true);
});

test('edgePath bends between offset nodes and still ends on the target anchor', () => {
  const D: DNode = { id: 'd', x: 200, y: 100, w: 100, h: 40, title: 'D' };
  const d = edgePath(A, D, { from: 'a', to: 'd' });
  expect(d.startsWith('M100 20')).toBe(true);
  expect(d.endsWith('200 120')).toBe(true);
  expect(d).toContain('Q');
});

test('validateDiagram flags unknown nodes, overlaps and out-of-bounds', () => {
  const bad: DiagramSpec = {
    title: 't',
    caption: 'c',
    width: 250,
    height: 100,
    nodes: [A, { ...B, x: 50 }, { ...C, id: 'far', x: 400 }],
    edges: [{ from: 'a', to: 'zz' }],
  };
  const problems = validateDiagram(bad);
  expect(problems.some((p) => p.includes('zz'))).toBe(true);
  expect(problems.some((p) => p.includes('overlap'))).toBe(true);
  expect(problems.some((p) => p.includes('outside'))).toBe(true);
});

test('validateDiagram flags text that cannot fit its node', () => {
  const tight: DiagramSpec = {
    title: 't',
    caption: 'c',
    width: 400,
    height: 100,
    nodes: [{ id: 'n', x: 0, y: 0, w: 80, h: 60, title: 'A title far too long for this box' }],
    edges: [],
  };
  expect(validateDiagram(tight).some((p) => p.includes('too wide'))).toBe(true);
});

test('every shipped diagram is valid', () => {
  for (const [key, spec] of Object.entries(diagrams)) expect(validateDiagram(spec), key).toEqual([]);
});

test('every published orfiq project with its own page has a diagram', () => {
  for (const f of contentFiles()) {
    const src = read(f.path);
    const hasPage = !/^page: false$/m.test(src);
    if (f.status === 'published' && hasPage && /^group: orfiq$/m.test(src)) expect(diagrams[f.slug], f.slug).toBeDefined();
  }
});

test('the work map exists', () => {
  expect(diagrams['work-map']).toBeDefined();
});
