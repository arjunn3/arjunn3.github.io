import { expect, test } from 'vitest';
import { diagrams } from '../../src/diagrams';
import { contentFiles, existsInDist, read, readDist } from '../helpers';

const published = () => contentFiles().filter((f) => f.status === 'published');
const withPage = () => published().filter((f) => !/^page: false$/m.test(read(f.path)));
const inGroup = (path: string, group: string) => new RegExp(`^group: ${group}$`, 'm').test(read(path));

test('every published project has a page, and card-only entries have none', () => {
  for (const f of published()) {
    const cardOnly = /^page: false$/m.test(read(f.path));
    expect(existsInDist(`/work/${f.slug}/`), f.slug).toBe(!cardOnly);
  }
});

test('no link anywhere points at a card-only entry', () => {
  const cardOnly = published().filter((f) => /^page: false$/m.test(read(f.path))).map((f) => f.slug);
  for (const p of ['index.html', 'work/index.html', ...withPage().map((f) => `work/${f.slug}/index.html`)]) {
    for (const s of cardOnly) expect(readDist(p), `${p} links to ${s}`).not.toContain(`/work/${s}/`);
  }
});

test('work index shows groups with published entries and omits the rest', () => {
  const labels = { personal: 'Personal', experience: 'Earlier experience', academic: 'Academic' };
  const html = readDist('work/index.html');
  for (const [group, label] of Object.entries(labels)) {
    const has = published().some((f) => inGroup(f.path, group));
    if (has) expect(html, label).toContain(`>${label}<`);
    else expect(html, label).not.toContain(`>${label}<`);
  }
});

test('pages without steps have no How it works heading', () => {
  for (const f of withPage()) {
    if (!/^steps:/m.test(read(f.path))) expect(readDist(`work/${f.slug}/index.html`), f.slug).not.toContain('How it works');
  }
});

test('next and previous links point only at published projects', () => {
  const ok = withPage().map((f) => f.slug);
  for (const f of withPage()) {
    for (const [, s] of readDist(`work/${f.slug}/index.html`).matchAll(/href="\/work\/([^/"]+)\/"/g)) expect(ok).toContain(s);
  }
});

test('orfiq pages state the code is private', () => {
  for (const f of withPage()) {
    if (inGroup(f.path, 'orfiq')) expect(readDist(`work/${f.slug}/index.html`), f.slug).toContain('Private to Orfiq');
  }
});

test('project pages show their overview diagram', () => {
  for (const f of withPage()) {
    const spec = diagrams[f.slug];
    if (spec) expect(readDist(`work/${f.slug}/index.html`), f.slug).toContain(`>${spec.title}<`);
  }
});

test('work index shows the map, the capability areas and contributions', () => {
  const html = readDist('work/index.html');
  expect(html).toContain(`>${diagrams['work-map'].title}<`);
  for (const label of ['Grounded generation', 'Reliable AI systems', 'Documents &amp; structured data', 'Integrations &amp; multimodal']) expect(html).toContain(label);
  expect(html).toContain('contributed');
});

test('review notes in Markdown never reach the page source', () => {
  for (const f of withPage()) expect(readDist(`work/${f.slug}/index.html`), f.slug).not.toMatch(/<!--|Arjun: review/);
});
