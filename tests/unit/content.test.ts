import { expect, test } from 'vitest';
import { forbidden } from '../forbidden';
import { contentFiles, glob, read } from '../helpers';

test('no forbidden terms in content sources', () => {
  const files = glob('src/content/**/*.md', 'src/data/**/*.ts', 'src/diagrams/**/*.ts');
  expect(files.length).toBeGreaterThan(0);
  for (const f of files) for (const re of forbidden) expect(read(f), `${f} matches ${re}`).not.toMatch(re);
});

test('published files keep notes in frontmatter, not HTML comments (they would ship in the page source)', () => {
  for (const f of glob('src/content/work/*.md', 'src/content/now.md')) {
    expect(read(f), `${f}: move the note into the frontmatter as a "# ..." YAML comment`).not.toContain('<!--');
  }
});

test('every published professional entry declares its capability area', () => {
  for (const f of contentFiles()) {
    const src = read(f.path);
    if (f.status === 'published' && /^group: orfiq$/m.test(src)) expect(src, f.slug).toMatch(/^area: \S+/m);
  }
});

test('folders and status agree: work/ is public and published, drafts/ stays draft, names never collide', () => {
  const files = contentFiles();
  for (const f of files) {
    if (f.path.startsWith('src/content/work/')) expect(f.status, `${f.path} is in work/ but not published`).toBe('published');
    if (f.path.startsWith('src/content/drafts/')) expect(f.status, `${f.path} is a draft file marked published`).toBe('draft');
  }
  const slugs = files.map((f) => f.slug);
  expect(slugs.length).toBe(new Set(slugs).size);
});

test('no review notes left in public files', () => {
  for (const f of glob('src/content/work/*.md', 'src/content/now.md')) expect(read(f), f).not.toMatch(/Arjun:/);
});

test('exactly one featured project', () => {
  expect(contentFiles().filter((f) => /^featured: true$/m.test(read(f.path)))).toHaveLength(1);
});
