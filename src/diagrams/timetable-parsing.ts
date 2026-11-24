import type { DiagramSpec } from '../lib/diagram';

const spec: DiagramSpec = {
  title: 'Timetable document parser: overview',
  caption:
    'Top: any of three file formats becomes one validated JSON schedule. Bottom: the async API around it, where uploading returns at once, the result is ready when the job is, and the app decides where to save it. Teal marks the main path and the parts I built.',
  width: 1000,
  height: 360,
  groups: [
    { id: 'parse', x: 12, y: 16, w: 976, h: 150, title: 'parsing' },
    { id: 'api', x: 12, y: 190, w: 976, h: 150, title: 'async api' },
  ],
  nodes: [
    { id: 'file', x: 24, y: 64, w: 160, h: 72, title: 'Timetable file', sub: 'PDF · Word ·\nExcel', kind: 'external' },
    { id: 'readers', x: 214, y: 64, w: 150, h: 72, title: 'Readers', sub: 'one per format', kind: 'mine' },
    { id: 'layout', x: 394, y: 64, w: 180, h: 72, title: 'Layout heuristics', sub: 'days, time slots,\nsessions', kind: 'mine' },
    { id: 'normalise', x: 604, y: 64, w: 160, h: 72, title: 'Normalise', sub: 'names, times,\nsubjects', kind: 'mine' },
    { id: 'validate', x: 794, y: 64, w: 180, h: 72, title: 'Validate', sub: 'typed models →\ncanonical JSON', kind: 'mine' },
    { id: 'upload', x: 24, y: 238, w: 160, h: 72, title: 'Upload', sub: '202 + job id', kind: 'external' },
    { id: 'status', x: 214, y: 238, w: 150, h: 72, title: 'Status', sub: 'pending → done', kind: 'mine' },
    { id: 'result', x: 394, y: 238, w: 180, h: 72, title: 'Result', sub: 'JSON, or 409\nif still running', kind: 'mine' },
    { id: 'cancel', x: 604, y: 238, w: 160, h: 72, title: 'Cancel', sub: 'shared task API', kind: 'mine' },
    { id: 'save', x: 794, y: 238, w: 180, h: 72, title: 'App saves it', sub: 'where the user\nchooses', kind: 'external' },
  ],
  edges: [
    { from: 'file', to: 'readers', main: true },
    { from: 'readers', to: 'layout', main: true },
    { from: 'layout', to: 'normalise', main: true },
    { from: 'normalise', to: 'validate', main: true },
    { from: 'upload', to: 'status' },
    { from: 'status', to: 'result' },
    { from: 'result', to: 'save', fromSide: 'b', toSide: 'b' },
  ],
};

export default spec;
