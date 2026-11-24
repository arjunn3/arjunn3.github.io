import { expect, test } from 'vitest';
import { distPages, readDist } from '../helpers';

test('home has the site title', () => {
  expect(readDist('index.html')).toMatch(/<title>Arjun Nagendra/);
});

test('html lang is en', () => {
  expect(readDist('index.html')).toMatch(/<html lang="en"/);
});

test('fonts are self-hosted', () => {
  for (const p of distPages()) expect(readDist(p)).not.toContain('fonts.googleapis.com');
});
