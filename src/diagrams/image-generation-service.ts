import type { DiagramSpec } from '../lib/diagram';

const spec: DiagramSpec = {
  title: 'Multi-provider image service: routing architecture',
  caption:
    'Four product surfaces share one image service. A provider router sends each request to Azure OpenAI and falls back to Gemini when it is down or rate-limited. Teal marks the main path and the parts I built.',
  width: 1000,
  height: 400,
  groups: [
    { id: 'surfaces', x: 12, y: 36, w: 194, h: 342, title: 'product surfaces' },
    { id: 'service', x: 222, y: 150, w: 594, h: 130, title: 'image service' },
    { id: 'providers', x: 832, y: 92, w: 164, h: 258, title: 'providers' },
  ],
  nodes: [
    { id: 'editor', x: 24, y: 70, w: 170, h: 56, title: 'Course editor', sub: 'inline figures', kind: 'external' },
    { id: 'chat1', x: 24, y: 150, w: 170, h: 56, title: 'Chat assistant', sub: 'from uploaded files', kind: 'external' },
    { id: 'chat2', x: 24, y: 230, w: 170, h: 56, title: 'Chat assistant', sub: 'from course summaries', kind: 'external' },
    { id: 'api', x: 24, y: 310, w: 170, h: 56, title: 'General API', sub: 'any other caller', kind: 'external' },
    { id: 'adapters', x: 234, y: 186, w: 160, h: 72, title: 'Service adapters', sub: 'context + prompt\nstyle per surface', kind: 'mine' },
    { id: 'core', x: 434, y: 186, w: 180, h: 72, title: 'Core image function', sub: 'ratio · references\nretries · timeouts', kind: 'mine' },
    { id: 'router', x: 654, y: 186, w: 150, h: 72, title: 'Provider router', sub: 'config flag +\nauto fallback', kind: 'mine' },
    { id: 'azure', x: 844, y: 124, w: 140, h: 56, title: 'Azure OpenAI', sub: 'primary', kind: 'external' },
    { id: 'gemini', x: 844, y: 262, w: 140, h: 72, title: 'Gemini', sub: 'fallback: outage\nor rate limit', kind: 'external' },
    { id: 'storage', x: 434, y: 330, w: 180, h: 56, title: 'Blob storage', sub: 'saved + signed link', kind: 'store' },
  ],
  edges: [
    { from: 'editor', to: 'adapters', fromSide: 'r', toSide: 'l' },
    { from: 'chat1', to: 'adapters', fromSide: 'r', toSide: 'l' },
    { from: 'chat2', to: 'adapters', fromSide: 'r', toSide: 'l' },
    { from: 'api', to: 'adapters', fromSide: 'r', toSide: 'l' },
    { from: 'adapters', to: 'core', main: true },
    { from: 'core', to: 'router', main: true },
    { from: 'router', to: 'azure', main: true },
    { from: 'router', to: 'gemini', dashed: true },
    { from: 'core', to: 'storage', label: 'save' },
  ],
};

export default spec;
