import type { DiagramSpec } from '../lib/diagram';

const spec: DiagramSpec = {
  title: 'Graph-grounded case generation: overview',
  caption:
    'A scope agent sets the rules, topic selection narrows the knowledge graph, and fixed Cypher queries (never written by a model) fetch candidates for a shortlist the case is written from. Teal marks the main path and the parts I built.',
  width: 1000,
  height: 330,
  nodes: [
    { id: 'reviewer', x: 24, y: 68, w: 140, h: 56, title: 'Reviewer', sub: 'asks for a case', kind: 'external' },
    { id: 'api', x: 194, y: 60, w: 180, h: 72, title: 'Step-by-step API', sub: 'rejects bad input\nbefore any model', kind: 'mine' },
    { id: 'scope', x: 404, y: 60, w: 180, h: 72, title: '1 · Scope agent', sub: 'must include ·\nmust exclude · depth', kind: 'mine' },
    { id: 'topics', x: 614, y: 60, w: 180, h: 72, title: '2 · Topic selection', sub: 'pinned matches +\nthe model’s picks', kind: 'mine' },
    { id: 'writer', x: 824, y: 60, w: 160, h: 72, title: '3 · Case writer', sub: 'shortlist only', kind: 'mine' },
    { id: 'graph', x: 404, y: 230, w: 180, h: 72, title: 'Knowledge graph', sub: 'Neo4j · subjects →\ntopics → items', kind: 'store' },
    { id: 'cypher', x: 614, y: 230, w: 180, h: 72, title: 'Cypher queries', sub: 'fixed, never written\nby the model', kind: 'mine' },
  ],
  edges: [
    { from: 'reviewer', to: 'api' },
    { from: 'api', to: 'scope' },
    { from: 'scope', to: 'topics' },
    { from: 'topics', to: 'cypher', main: true },
    { from: 'cypher', to: 'graph', main: true },
    { from: 'cypher', to: 'writer', main: true, fromSide: 'r', toSide: 'b', label: 'shortlist' },
  ],
};

export default spec;
