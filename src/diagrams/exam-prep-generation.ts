import type { DiagramSpec } from '../lib/diagram';

const spec: DiagramSpec = {
  title: 'Exam-prep generation service: overview',
  caption:
    'Starting a job returns at once; a background worker grounds and writes the pack while the app polls the job’s status until it is ready. Teal marks the main path and the parts I built.',
  width: 1000,
  height: 360,
  groups: [{ id: 'background', x: 592, y: 8, w: 400, h: 326, title: 'in the background' }],
  nodes: [
    { id: 'app', x: 24, y: 152, w: 140, h: 56, title: 'The app', sub: 'start, then poll', kind: 'external' },
    { id: 'start', x: 194, y: 64, w: 170, h: 56, title: 'Start job', sub: 'returns an id at once', kind: 'mine' },
    { id: 'check', x: 194, y: 240, w: 170, h: 56, title: 'Check status', sub: 'asked until ready', kind: 'mine' },
    { id: 'store', x: 404, y: 152, w: 160, h: 56, title: 'Job store', sub: 'status per job', kind: 'store' },
    { id: 'worker', x: 604, y: 152, w: 170, h: 56, title: 'Background worker', sub: 'builds the pack', kind: 'mine' },
    { id: 'syllabus', x: 814, y: 20, w: 170, h: 56, title: 'Syllabus', sub: 'from the graph' },
    { id: 'search', x: 814, y: 96, w: 170, h: 56, title: 'Web search', sub: 'grounding' },
    { id: 'write', x: 814, y: 172, w: 170, h: 72, title: 'Write the pack', sub: 'summary · mnemonics\nquestions · quiz', kind: 'mine' },
    { id: 'diagrams', x: 814, y: 264, w: 170, h: 56, title: 'Diagrams', sub: 'saved to storage' },
  ],
  edges: [
    { from: 'app', to: 'start', fromSide: 'r', toSide: 'l' },
    { from: 'app', to: 'check', fromSide: 'r', toSide: 'l', dashed: true },
    { from: 'start', to: 'store', fromSide: 'r', toSide: 'l', label: 'save' },
    { from: 'check', to: 'store', fromSide: 'r', toSide: 'l', dashed: true, label: 'read' },
    { from: 'store', to: 'worker', main: true },
    { from: 'worker', to: 'syllabus', fromSide: 'r', toSide: 'l' },
    { from: 'worker', to: 'search', fromSide: 'r', toSide: 'l' },
    { from: 'worker', to: 'write', fromSide: 'r', toSide: 'l', main: true },
    { from: 'worker', to: 'diagrams', fromSide: 'r', toSide: 'l' },
  ],
};

export default spec;
