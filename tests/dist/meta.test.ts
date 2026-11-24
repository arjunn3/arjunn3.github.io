import sharp from 'sharp';
import { expect, test } from 'vitest';
import { contentFiles, distPages, existsInDist, readDist, root } from '../helpers';

test('every page has a title, description and og:image', () => {
  for (const p of distPages()) {
    const h = readDist(p);
    expect(h, p).toMatch(/<title>[^<]+<\/title>/);
    expect(h, p).toMatch(/<meta name="description" content="[^"]{20,}"/);
    expect(h, p).toContain('<meta property="og:image" content="https://arjunn3.github.io/og.png"');
  }
});

/** Page text with the common HTML entities decoded, so "Saga&#39;s" still matches "Saga's". */
const decoded = (html: string) =>
  html.replace(/&#39;|&#x27;|&apos;|&rsquo;|’/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&');

test('drafts leave no trace in dist', () => {
  const sitemap = readDist('sitemap-0.xml');
  const drafts = contentFiles().filter((f) => f.status === 'draft');
  for (const d of drafts) {
    expect(existsInDist(`/work/${d.slug}/`), d.slug).toBe(false);
    expect(sitemap, d.slug).not.toContain(`/work/${d.slug}/`);
    const title = d.title.replace(/’/g, "'");
    for (const p of distPages()) expect(decoded(readDist(p)), `${p} mentions draft "${d.title}"`).not.toContain(title);
  }
});

test('404 page exists and links home', () => {
  expect(readDist('404.html')).toContain('href="/"');
});

test('about has the taekwondo anchor', () => {
  expect(readDist('about/index.html')).toContain('id="taekwondo"');
});

test('now shows when it was updated', () => {
  expect(readDist('now/index.html')).toMatch(/<time datetime="\d{4}-\d{2}-\d{2}"/);
});

test('the share image is a 1200×630 PNG', async () => {
  const meta = await sharp(`${root}dist/og.png`).metadata();
  expect([meta.format, meta.width, meta.height]).toEqual(['png', 1200, 630]);
});
