import { z } from 'astro/zod';

export const workGroups = ['orfiq', 'personal', 'experience', 'academic'] as const;

/** Capability areas for professional work, in plain engineering terms anyone can follow. */
export const workAreas = ['grounded-generation', 'reliability', 'documents', 'integrations'] as const;

export const visualKeys = [
  'graph-steps',
  'pipeline',
  'job',
  'fallback',
  'diff',
  'states',
  'retries',
  'parser',
  'phone',
  'none',
] as const;

/** Frontmatter of one project file (spec §10). New files default to draft. */
export const workSchema = z.object({
  /** A plain-language title an outsider understands, e.g. "Textbook generation pipeline". */
  title: z.string(),
  /** The internal product name, shown small, e.g. "Textbook v2 at Orfiq". */
  product: z.string().optional(),
  summary: z.string(),
  year: z.number().int(),
  group: z.enum(workGroups),
  area: z.enum(workAreas).optional(),
  /** owner = built most of it; contributor = added specific parts to someone else's system. */
  ownership: z.enum(['owner', 'contributor']).default('owner'),
  /** false = shown as a card on the work page only, with no page of its own. */
  page: z.boolean().default(true),
  /** 2–4 outcome-first bullets shown at the top of the page. */
  highlights: z.array(z.string()).optional(),
  order: z.number().int(),
  featured: z.boolean().default(false),
  status: z.enum(['draft', 'published']).default('draft'),
  role: z.string(),
  stack: z.array(z.string()),
  code: z.enum(['private', 'public']).default('private'),
  codeNote: z.string().optional(),
  links: z.object({ repo: z.url().optional(), live: z.url().optional() }).optional(),
  visual: z.enum(visualKeys).default('none'),
  steps: z.array(z.object({ title: z.string(), text: z.string() })).optional(),
});

export const nowSchema = z.object({
  title: z.string(),
  summary: z.string(),
  updated: z.coerce.date(),
});

export type WorkData = z.infer<typeof workSchema>;
export type WorkGroup = WorkData['group'];
export type WorkArea = (typeof workAreas)[number];
export type VisualKey = WorkData['visual'];
