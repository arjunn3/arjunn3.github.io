import { expect, test } from 'vitest';
import { forbidden } from '../forbidden';
import { distPages, existsInDist, jsFiles, readDist, size } from '../helpers';

test('internal links resolve', () => {
  for (const p of distPages()) {
    for (const [, href] of readDist(p).matchAll(/href="(\/[^"#?]*)/g)) {
      if (href.startsWith('//')) continue;
      expect(existsInDist(href), `${p} → ${href}`).toBe(true);
    }
  }
});

test('no confidential strings in dist', () => {
  for (const p of distPages()) {
    const html = readDist(p);
    for (const re of forbidden) expect(html, `${p} matches ${re}`).not.toMatch(re);
  }
});

test('each page ships under 5 KB of JavaScript (what one visitor actually loads)', () => {
  const external = jsFiles().reduce((n, f) => n + size(f), 0);
  for (const p of distPages()) {
    const inline = [...readDist(p).matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].reduce((m, x) => m + x[1].length, 0);
    expect(external + inline, p).toBeLessThan(5120);
  }
});

test('the link checker itself rejects a page link without its trailing slash', () => {
  expect(existsInDist('/work/')).toBe(true);
  expect(existsInDist('/work')).toBe(false);
});
