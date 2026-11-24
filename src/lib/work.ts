import { workAreas, type WorkArea, type WorkData, type WorkGroup } from './schemas';

export interface WorkEntry {
  id: string;
  data: WorkData;
}

const groupOrder: WorkGroup[] = ['orfiq', 'personal', 'experience', 'academic'];

export const groupLabels: Record<WorkGroup, string> = {
  orfiq: 'At Orfiq',
  personal: 'Personal',
  experience: 'Earlier experience',
  academic: 'Academic',
};

/** How each capability area is named and explained to someone with no context on the work. */
export const areaInfo: Record<WorkArea, { label: string; blurb: string }> = {
  'grounded-generation': {
    label: 'Grounded generation',
    blurb:
      'LLM pipelines that write long-form content from a knowledge graph, with coverage checked by code and an independent model reviewing the output.',
  },
  reliability: {
    label: 'Reliable AI systems',
    blurb:
      'Background jobs, concurrency control, failure handling and observability for AI work that takes minutes, not milliseconds.',
  },
  documents: {
    label: 'Documents & structured data',
    blurb:
      'Turning messy real-world documents into clean, validated data, and repairing the structured output that models get wrong.',
  },
  integrations: {
    label: 'Integrations & multimodal',
    blurb: 'Image generation, provider routing with fallback, search, and the pieces that connect AI services to products.',
  },
};

/** Professional entries grouped by capability area, in a fixed order; empty areas are left out. */
export function groupByArea(
  entries: WorkEntry[],
): { area: WorkArea; label: string; blurb: string; items: WorkEntry[] }[] {
  return workAreas
    .map((area) => ({ area, ...areaInfo[area], items: entries.filter((e) => e.data.area === area) }))
    .filter((g) => g.items.length > 0);
}

/** Entries that have a page of their own (card-only entries are left out). */
export function pageEntries(entries: WorkEntry[]): WorkEntry[] {
  return entries.filter((e) => e.data.page !== false);
}

/** Published entries (plus drafts in dev), by order, then newest year, then title. */
export function visibleWork(entries: WorkEntry[], opts: { includeDrafts: boolean }): WorkEntry[] {
  return entries
    .filter((e) => opts.includeDrafts || e.data.status === 'published')
    .sort(
      (a, b) =>
        a.data.order - b.data.order ||
        b.data.year - a.data.year ||
        a.data.title.localeCompare(b.data.title),
    );
}

/** Entries grouped in a fixed order; groups with nothing in them are left out. */
export function groupWork(entries: WorkEntry[]): { group: WorkGroup; label: string; items: WorkEntry[] }[] {
  return groupOrder
    .map((group) => ({ group, label: groupLabels[group], items: entries.filter((e) => e.data.group === group) }))
    .filter((g) => g.items.length > 0);
}

export function adjacentWork(entries: WorkEntry[], id: string): { prev?: WorkEntry; next?: WorkEntry } {
  const i = entries.findIndex((e) => e.id === id);
  if (i === -1) return {};
  return { prev: entries[i - 1], next: entries[i + 1] };
}

/** The one featured project, if any. Two featured projects is a content mistake, so fail loudly. */
export function featuredWork(entries: WorkEntry[]): WorkEntry | undefined {
  const featured = entries.filter((e) => e.data.featured);
  if (featured.length > 1) {
    throw new Error(`more than one featured project: ${featured.map((e) => e.id).join(', ')}`);
  }
  return featured[0];
}

/** Orfiq projects for the homepage grid, in list order, skipping the ones shown elsewhere. */
export function homeTiles(entries: WorkEntry[], opts: { exclude: string[]; count: number }): WorkEntry[] {
  return pageEntries(entries)
    .filter((e) => e.data.group === 'orfiq' && !opts.exclude.includes(e.id))
    .slice(0, opts.count);
}
