import type { DiagramSpec } from '../lib/diagram';

const spec: DiagramSpec = {
  title: 'Textbook generation pipeline: overview',
  caption:
    'Three stages run per chapter: an outline that code audits for coverage, a blueprint, then a draft written from evidence. An independent model reviews each draft; only blocking problems trigger one targeted rewrite, and a human expert has the final say. Teal marks the main path and the parts I built.',
  width: 1000,
  height: 300,
  groups: [{ id: 'per-chapter', x: 322, y: 56, w: 480, h: 124, title: 'per chapter · claimed atomically · resumable' }],
  nodes: [
    { id: 'graph', x: 16, y: 90, w: 150, h: 72, title: 'Knowledge graph', sub: 'what the book\nmust cover', kind: 'store' },
    { id: 'outline', x: 186, y: 90, w: 126, h: 72, title: 'Outline', sub: 'every item\nplaced once', kind: 'mine' },
    { id: 'blueprint', x: 332, y: 90, w: 130, h: 72, title: 'Blueprint', sub: 'plans sections,\nfacts to check', kind: 'mine' },
    { id: 'draft', x: 482, y: 90, w: 140, h: 72, title: 'Draft', sub: 'evidence first,\none pass', kind: 'mine' },
    { id: 'qa', x: 642, y: 90, w: 150, h: 72, title: 'Independent QA', sub: '6 defect types,\n4 can block', kind: 'mine' },
    { id: 'review', x: 832, y: 90, w: 150, h: 72, title: 'Expert review', sub: 'approve or edit', kind: 'external' },
    { id: 'rewrite', x: 642, y: 214, w: 150, h: 72, title: 'Targeted rewrite', sub: 'blocking sections,\nonce', kind: 'mine' },
  ],
  edges: [
    { from: 'graph', to: 'outline', main: true },
    { from: 'outline', to: 'blueprint', main: true },
    { from: 'blueprint', to: 'draft', main: true },
    { from: 'draft', to: 'qa', main: true },
    { from: 'qa', to: 'review', main: true },
    { from: 'qa', to: 'rewrite', dashed: true, label: 'if blocking' },
    { from: 'rewrite', to: 'review', fromSide: 'r', toSide: 'b' },
  ],
};

export default spec;
