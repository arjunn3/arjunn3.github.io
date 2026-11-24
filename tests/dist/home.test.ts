import { expect, test } from 'vitest';
import { contentFiles, read, readDist } from '../helpers';

test('home shows the featured project and links to it', () => {
  const h = readDist('index.html');
  expect(h).toContain('Textbook generation pipeline');
  expect(h).toContain('href="/work/textbook-pipeline/"');
});

test('home shows the Now item', () => {
  const nowTitle = read('src/content/now.md').match(/^title:\s*(.+)$/m)?.[1].trim();
  expect(nowTitle).toBeTruthy();
  expect(readDist('index.html')).toContain(`>${nowTitle}<`);
});

test('home tiles link only to published projects', () => {
  const published = contentFiles()
    .filter((f) => f.status === 'published')
    .map((f) => f.slug);
  const linked = [...readDist('index.html').matchAll(/href="\/work\/([^/"]+)\/"/g)].map((m) => m[1]);
  expect(linked.length).toBeGreaterThan(0);
  for (const slug of linked) expect(published).toContain(slug);
});

test('home explains the capability areas in plain words', () => {
  const h = readDist('index.html');
  for (const label of ['Grounded generation', 'Reliable AI systems', 'Documents &amp; structured data']) expect(h).toContain(label);
});
