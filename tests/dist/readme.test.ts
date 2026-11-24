import { expect, test } from 'vitest';
import { forbidden } from '../forbidden';
import { contentFiles, exists, read } from '../helpers';

// The profile README is its own repository, cloned into profile/ (git-ignored
// here), so these checks run locally and skip in CI.
const hasProfile = exists('profile/README.md');

test.skipIf(!hasProfile)('profile README links only to published pages', () => {
  const ok = contentFiles()
    .filter((f) => f.status === 'published')
    .map((f) => f.slug);
  const readme = read('profile/README.md');
  const linked = [...readme.matchAll(/arjunn3\.github\.io\/work\/([^/)"]+)\//g)].map((m) => m[1]);
  expect(linked.length).toBeGreaterThan(0);
  for (const slug of linked) expect(ok).toContain(slug);
});

test.skipIf(!hasProfile)('profile README has no template leftovers or star ratings', () => {
  expect(read('profile/README.md')).not.toMatch(/kabir-asani|⭐/);
});

test.skipIf(!hasProfile)('profile README has no confidential terms', () => {
  for (const re of forbidden) expect(read('profile/README.md')).not.toMatch(re);
});
