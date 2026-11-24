import type { DiagramSpec } from '../lib/diagram';

const spec: DiagramSpec = {
  title: 'Repairing malformed LLM output: overview',
  caption:
    'Every generated document is cleaned and repaired against the editor’s schema before it is saved, and each run is traced. Teal marks the main path and the parts I built.',
  width: 1000,
  height: 280,
  nodes: [
    { id: 'model', x: 24, y: 92, w: 150, h: 72, title: 'Model output', sub: 'rich-text JSON', kind: 'external' },
    { id: 'clean', x: 204, y: 92, w: 160, h: 72, title: 'Clean text', sub: 'control chars\nempty text', kind: 'mine' },
    {
      id: 'repair',
      x: 394,
      y: 64,
      w: 210,
      h: 128,
      title: 'Repair the tree',
      sub: 'lift blocks out of tables\nflatten nested rows\nfix list items\nlinks → link marks',
      kind: 'mine',
    },
    { id: 'validate', x: 634, y: 92, w: 150, h: 72, title: 'Validate', sub: 'matches the\neditor schema', kind: 'mine' },
    { id: 'editor', x: 814, y: 92, w: 170, h: 72, title: 'Editor', sub: 'loads cleanly', kind: 'external' },
    { id: 'trace', x: 634, y: 206, w: 150, h: 56, title: 'Tracing', sub: 'spans in Logfire' },
  ],
  edges: [
    { from: 'model', to: 'clean', main: true },
    { from: 'clean', to: 'repair', main: true },
    { from: 'repair', to: 'validate', main: true },
    { from: 'validate', to: 'editor', main: true },
    { from: 'validate', to: 'trace', dashed: true },
  ],
};

export default spec;
