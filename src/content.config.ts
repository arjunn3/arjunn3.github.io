import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { nowSchema, workSchema } from './lib/schemas';

/**
 * Projects come from two folders: src/content/work (public, committed) and
 * src/content/drafts (git-ignored, so unreviewed write-ups never reach the
 * public repository). The id is the file name, so moving a file from drafts/
 * to work/ keeps its URL.
 */
const work = defineCollection({
  loader: glob({
    pattern: '{work,drafts}/*.md',
    base: './src/content',
    generateId: ({ entry }) => entry.replace(/^.*\//, '').replace(/\.md$/, ''),
  }),
  schema: workSchema,
});

const now = defineCollection({
  loader: glob({ pattern: 'now.md', base: './src/content' }),
  schema: nowSchema,
});

export const collections = { work, now };
