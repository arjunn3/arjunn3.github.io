// Architecture diagrams as data. A spec is laid out by hand on a fixed
// canvas; this module computes the connectors and checks the layout, so a
// cramped or broken diagram fails a test instead of shipping.

export type Side = 'l' | 'r' | 't' | 'b';

export interface DNode {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  /** Lines separated by "\n". */
  sub?: string;
  /** mine = part Arjun built (teal border); store = data store; external = outside the system. */
  kind?: 'step' | 'store' | 'external' | 'mine';
}

export interface DGroup {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
}

export interface DEdge {
  from: string;
  to: string;
  label?: string;
  /** The main path, drawn in teal. */
  main?: boolean;
  dashed?: boolean;
  fromSide?: Side;
  toSide?: Side;
}

export interface DiagramSpec {
  title: string;
  caption: string;
  width: number;
  height: number;
  groups?: DGroup[];
  nodes: DNode[];
  edges: DEdge[];
}

/** Text metrics shared by the renderer and the validator. */
export const metrics = {
  pad: 14,
  titleChar: 7.6, // 13.5px Space Grotesk, generous average
  subChar: 6.4, // 10.5px JetBrains Mono
  groupChar: 6.6, // 10px mono caps with tracking
  labelChar: 6.2,
  titleY: 24,
  subY: 43,
  subLine: 14,
};

export function subLines(n: DNode): string[] {
  return n.sub ? n.sub.split('\n') : [];
}

export function anchor(n: DNode, side: Side): { x: number; y: number } {
  switch (side) {
    case 'l':
      return { x: n.x, y: n.y + n.h / 2 };
    case 'r':
      return { x: n.x + n.w, y: n.y + n.h / 2 };
    case 't':
      return { x: n.x + n.w / 2, y: n.y };
    case 'b':
      return { x: n.x + n.w / 2, y: n.y + n.h };
  }
}

/** Left/right when boxes sit side by side (horizontal gap ≥ vertical gap), else top/bottom. */
export function autoSides(a: DNode, b: DNode): [Side, Side] {
  const hGap = Math.max(b.x - (a.x + a.w), a.x - (b.x + b.w));
  const vGap = Math.max(b.y - (a.y + a.h), a.y - (b.y + b.h));
  if (hGap >= vGap) return b.x >= a.x ? ['r', 'l'] : ['l', 'r'];
  return b.y >= a.y ? ['b', 't'] : ['t', 'b'];
}

const isHorizontal = (s: Side) => s === 'l' || s === 'r';
const num = (n: number) => String(Math.round(n * 10) / 10);
const pt = (x: number, y: number) => `${num(x)} ${num(y)}`;

function ends(a: DNode, b: DNode, e: DEdge) {
  const [autoFrom, autoTo] = autoSides(a, b);
  const fromSide = e.fromSide ?? autoFrom;
  const toSide = e.toSide ?? autoTo;
  return { fromSide, toSide, s: anchor(a, fromSide), t: anchor(b, toSide) };
}

/** Orthogonal connector with 8px rounded elbows; a straight line when the anchors line up. */
export function edgePath(a: DNode, b: DNode, e: DEdge): string {
  const { fromSide, toSide, s, t } = ends(a, b, e);
  if (s.x === t.x || s.y === t.y) return `M${pt(s.x, s.y)} L${pt(t.x, t.y)}`;

  const dx = Math.sign(t.x - s.x);
  const dy = Math.sign(t.y - s.y);
  const spanX = Math.abs(t.x - s.x);
  const spanY = Math.abs(t.y - s.y);

  if (isHorizontal(fromSide) && isHorizontal(toSide)) {
    const mx = (s.x + t.x) / 2;
    const r = Math.min(8, spanX / 2, spanY / 2);
    return (
      `M${pt(s.x, s.y)} L${pt(mx - r * dx, s.y)} Q${pt(mx, s.y)} ${pt(mx, s.y + r * dy)} ` +
      `L${pt(mx, t.y - r * dy)} Q${pt(mx, t.y)} ${pt(mx + r * dx, t.y)} L${pt(t.x, t.y)}`
    );
  }
  if (!isHorizontal(fromSide) && !isHorizontal(toSide)) {
    const my = (s.y + t.y) / 2;
    const r = Math.min(8, spanX / 2, spanY / 2);
    return (
      `M${pt(s.x, s.y)} L${pt(s.x, my - r * dy)} Q${pt(s.x, my)} ${pt(s.x + r * dx, my)} ` +
      `L${pt(t.x - r * dx, my)} Q${pt(t.x, my)} ${pt(t.x, my + r * dy)} L${pt(t.x, t.y)}`
    );
  }
  const r = Math.min(8, spanX, spanY);
  if (isHorizontal(fromSide)) {
    // across, then up or down into the target
    return `M${pt(s.x, s.y)} L${pt(t.x - r * dx, s.y)} Q${pt(t.x, s.y)} ${pt(t.x, s.y + r * dy)} L${pt(t.x, t.y)}`;
  }
  // up or down, then across into the target
  return `M${pt(s.x, s.y)} L${pt(s.x, t.y - r * dy)} Q${pt(s.x, t.y)} ${pt(s.x + r * dx, t.y)} L${pt(t.x, t.y)}`;
}

/** Where an edge's label sits: the middle of its longest straight run. */
export function edgeLabelPoint(a: DNode, b: DNode, e: DEdge): { x: number; y: number } {
  const { fromSide, toSide, s, t } = ends(a, b, e);
  if (isHorizontal(fromSide) !== isHorizontal(toSide)) {
    return isHorizontal(fromSide) ? { x: (s.x + t.x) / 2, y: s.y } : { x: s.x, y: (s.y + t.y) / 2 };
  }
  return { x: (s.x + t.x) / 2, y: (s.y + t.y) / 2 };
}

type Rect = { x: number; y: number; w: number; h: number };
const overlaps = (a: Rect, b: Rect) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

/** Every layout problem in a spec, as readable messages. An empty list means it's good to ship. */
export function validateDiagram(spec: DiagramSpec): string[] {
  const problems: string[] = [];
  const ids = new Set<string>();
  for (const n of spec.nodes) {
    if (ids.has(n.id)) problems.push(`duplicate node id "${n.id}"`);
    ids.add(n.id);
  }
  for (const e of spec.edges) {
    for (const end of [e.from, e.to]) {
      if (!ids.has(end)) problems.push(`edge ${e.from} → ${e.to}: unknown node "${end}"`);
    }
  }
  const inside = (r: Rect) => r.x >= 0 && r.y >= 0 && r.x + r.w <= spec.width && r.y + r.h <= spec.height;
  for (const n of spec.nodes) if (!inside(n)) problems.push(`node "${n.id}" is outside the canvas`);
  for (const g of spec.groups ?? []) {
    if (!inside(g)) problems.push(`group "${g.id}" is outside the canvas`);
    if (g.title.length * metrics.groupChar > g.w - 2 * metrics.pad) problems.push(`group "${g.id}": title is too wide`);
  }
  spec.nodes.forEach((a, i) => {
    for (const b of spec.nodes.slice(i + 1)) {
      if (overlaps(a, b)) problems.push(`nodes "${a.id}" and "${b.id}" overlap`);
    }
  });
  for (const n of spec.nodes) {
    const inner = n.w - 2 * metrics.pad;
    if (n.title.length * metrics.titleChar > inner) problems.push(`node "${n.id}": title is too wide`);
    const lines = subLines(n);
    for (const line of lines) {
      if (line.length * metrics.subChar > inner) problems.push(`node "${n.id}": subtitle "${line}" is too wide`);
    }
    const needed = lines.length ? metrics.subY + (lines.length - 1) * metrics.subLine + 10 : metrics.titleY + 12;
    if (needed > n.h) problems.push(`node "${n.id}": text needs ${needed}px but the box is ${n.h}px tall`);
  }
  return problems;
}
