import type { DiagramSpec } from '../lib/diagram';

const spec: DiagramSpec = {
  title: 'Reliability for long-running AI jobs: overview',
  caption:
    'Top: every raw error becomes a plain message with a traceable reference code. Bottom: a job record exists before its id is returned, status lives in shared storage that every worker sees, and once a job is finished, failed or cancelled, late updates are ignored. Teal marks the main path and the parts I built.',
  width: 1000,
  height: 450,
  groups: [
    { id: 'errors', x: 12, y: 16, w: 976, h: 112, title: 'error path' },
    { id: 'jobs', x: 12, y: 150, w: 976, h: 290, title: 'job lifecycle' },
    { id: 'final', x: 392, y: 188, w: 174, h: 216, title: 'final states' },
  ],
  nodes: [
    { id: 'raw', x: 24, y: 44, w: 200, h: 72, title: 'Raw errors', sub: 'providers · storage\ndatabase', kind: 'external' },
    { id: 'map', x: 264, y: 44, w: 170, h: 72, title: 'Error map', sub: 'one place for\nevery source', kind: 'mine' },
    { id: 'message', x: 474, y: 44, w: 200, h: 72, title: 'Plain message', sub: '+ a reference code\nsupport can trace', kind: 'mine' },
    { id: 'people', x: 714, y: 44, w: 160, h: 72, title: 'People & support', sub: 'see what happened', kind: 'external' },
    { id: 'saved', x: 24, y: 176, w: 120, h: 72, title: 'Saved first', sub: 'before the id\nis returned', kind: 'mine' },
    { id: 'queued', x: 24, y: 276, w: 120, h: 52, title: 'Queued' },
    { id: 'running', x: 184, y: 276, w: 150, h: 52, title: 'In progress' },
    { id: 'completed', x: 404, y: 216, w: 150, h: 52, title: 'Completed', kind: 'mine' },
    { id: 'failed', x: 404, y: 276, w: 150, h: 52, title: 'Failed', kind: 'mine' },
    { id: 'cancelled', x: 404, y: 336, w: 150, h: 52, title: 'Cancelled', kind: 'mine' },
    { id: 'shared', x: 664, y: 196, w: 200, h: 72, title: 'Shared status', sub: 'every worker sees\nthe same job', kind: 'mine' },
    { id: 'late', x: 664, y: 326, w: 200, h: 72, title: 'Late worker update', sub: 'ignored once a job\nis final', kind: 'external' },
  ],
  edges: [
    { from: 'raw', to: 'map', main: true },
    { from: 'map', to: 'message', main: true },
    { from: 'message', to: 'people', main: true },
    { from: 'saved', to: 'queued' },
    { from: 'queued', to: 'running', main: true },
    { from: 'running', to: 'completed', fromSide: 'r', toSide: 'l', main: true },
    { from: 'running', to: 'failed', fromSide: 'r', toSide: 'l' },
    { from: 'running', to: 'cancelled', fromSide: 'r', toSide: 'l' },
    { from: 'completed', to: 'shared', fromSide: 'r', toSide: 'l', dashed: true },
    { from: 'late', to: 'cancelled', dashed: true, label: 'ignored' },
  ],
};

export default spec;
