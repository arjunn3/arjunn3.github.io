import type { DiagramSpec } from '../lib/diagram';

const spec: DiagramSpec = {
  title: 'How my work fits together',
  caption:
    'A knowledge graph defines what must be covered. Generation pipelines write from it, a repair layer validates the documents they produce before anyone reads them, and integrations supply images and search. A separate parser turns timetable documents into data, and reliability work sits underneath all of it. Teal borders mark what I built.',
  width: 1000,
  height: 630,
  groups: [{ id: 'base', x: 12, y: 520, w: 976, h: 84, title: 'reliability & observability — under everything' }],
  nodes: [
    { id: 'graph', x: 440, y: 30, w: 190, h: 64, title: 'Knowledge graph', sub: 'what must be covered', kind: 'store' },
    { id: 'search', x: 24, y: 150, w: 190, h: 64, title: 'Search gateway', sub: 'trusted web sources', kind: 'mine' },
    { id: 'images', x: 24, y: 250, w: 190, h: 64, title: 'Image service', sub: 'auto fallback', kind: 'mine' },
    { id: 'textbook', x: 260, y: 150, w: 170, h: 64, title: 'Textbook pipeline', sub: 'whole books', kind: 'mine' },
    { id: 'cases', x: 450, y: 150, w: 170, h: 64, title: 'Case generation', sub: 'grounded cases', kind: 'mine' },
    { id: 'prep', x: 640, y: 150, w: 170, h: 64, title: 'Exam-prep packs', sub: 'background jobs', kind: 'mine' },
    { id: 'repair', x: 445, y: 280, w: 180, h: 64, title: 'Validation & repair', sub: 'every document', kind: 'mine' },
    { id: 'editor', x: 445, y: 410, w: 180, h: 64, title: 'Editor', sub: 'what people read', kind: 'external' },
    { id: 'files', x: 830, y: 150, w: 150, h: 64, title: 'Timetable files', sub: 'PDF · Word · Excel', kind: 'external' },
    { id: 'parser', x: 830, y: 280, w: 150, h: 64, title: 'Timetable parser', sub: 'clean JSON', kind: 'mine' },
    { id: 'schedule', x: 830, y: 410, w: 150, h: 64, title: 'Scheduling', sub: 'the app', kind: 'external' },
    { id: 'jobs', x: 40, y: 548, w: 250, h: 40, title: 'Job reliability', kind: 'mine' },
    { id: 'observe', x: 320, y: 548, w: 250, h: 40, title: 'Agent observability', kind: 'mine' },
    { id: 'sessions', x: 600, y: 548, w: 250, h: 40, title: 'Safe concurrent edits', kind: 'mine' },
  ],
  edges: [
    { from: 'graph', to: 'textbook', fromSide: 'b', toSide: 't' },
    { from: 'graph', to: 'cases', fromSide: 'b', toSide: 't' },
    { from: 'graph', to: 'prep', fromSide: 'b', toSide: 't' },
    { from: 'search', to: 'textbook' },
    { from: 'textbook', to: 'repair', fromSide: 'b', toSide: 't' },
    { from: 'cases', to: 'repair', fromSide: 'b', toSide: 't' },
    { from: 'prep', to: 'repair', fromSide: 'b', toSide: 't' },
    { from: 'repair', to: 'editor', main: true, label: 'valid documents' },
    { from: 'images', to: 'editor', fromSide: 'r', toSide: 'l', label: 'figures' },
    { from: 'files', to: 'parser', main: true },
    { from: 'parser', to: 'schedule', main: true },
  ],
};

export default spec;
