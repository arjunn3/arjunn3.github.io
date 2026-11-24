import type { DiagramSpec } from '../lib/diagram';

const spec: DiagramSpec = {
  title: 'Agent observability: overview',
  caption:
    'After each agent run, its messages are searched for retry prompts; every retry becomes a structured log line and a telemetry event, so it shows up on dashboards. Teal marks the main path and the parts I built.',
  width: 1000,
  height: 240,
  nodes: [
    { id: 'run', x: 24, y: 84, w: 150, h: 72, title: 'Agent run', sub: 'PydanticAI', kind: 'external' },
    { id: 'messages', x: 204, y: 84, w: 160, h: 72, title: 'Run messages', sub: 'every turn' },
    { id: 'find', x: 394, y: 84, w: 190, h: 72, title: 'Find retry prompts', sub: 'field · error · turn', kind: 'mine' },
    { id: 'loguru', x: 624, y: 30, w: 170, h: 72, title: 'Loguru', sub: 'structured\nwarning', kind: 'mine' },
    { id: 'logfire', x: 624, y: 138, w: 170, h: 72, title: 'Logfire', sub: 'telemetry event', kind: 'mine' },
    { id: 'dashboards', x: 834, y: 84, w: 150, h: 72, title: 'Dashboards', sub: 'retries in view', kind: 'external' },
  ],
  edges: [
    { from: 'run', to: 'messages', main: true },
    { from: 'messages', to: 'find', main: true },
    { from: 'find', to: 'loguru' },
    { from: 'find', to: 'logfire', main: true },
    { from: 'logfire', to: 'dashboards', main: true },
  ],
};

export default spec;
