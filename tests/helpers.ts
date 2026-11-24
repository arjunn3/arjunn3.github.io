import { existsSync, globSync, readFileSync, statSync } from 'node:fs';
import { basename, join, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

/** Project root (the folder that holds package.json). */
export const root = fileURLToPath(new URL('..', import.meta.url));
const distDir = join(root, 'dist');

const posix = (p: string) => p.split(sep).join('/');

export function read(rel: string): string {
  return readFileSync(join(root, rel), 'utf8');
}

export function exists(rel: string): boolean {
  return existsSync(join(root, rel));
}

export function size(rel: string): number {
  return statSync(join(root, rel)).size;
}

/** Files matching any of the patterns, relative to the project root, sorted. */
export function glob(...patterns: string[]): string[] {
  return patterns.flatMap((p) => globSync(p, { cwd: root })).map(posix).sort();
}

function requireDist(): void {
  if (!existsSync(distDir)) throw new Error('dist/ not found: run `npm run build` first');
}

/** Every built HTML page, relative to dist/. */
export function distPages(): string[] {
  requireDist();
  return globSync('**/*.html', { cwd: distDir }).map(posix).sort();
}

/** Every built JS file, relative to the project root (for size()). */
export function jsFiles(): string[] {
  requireDist();
  return globSync('**/*.js', { cwd: distDir }).map((p) => `dist/${posix(p)}`);
}

export function readDist(rel: string): string {
  const p = join(distDir, rel);
  if (!existsSync(p)) throw new Error(`dist/${rel} not found: run \`npm run build\` first`);
  return readFileSync(p, 'utf8');
}

/**
 * Does a site URL resolve to a built file? `/x/` maps to dist/x/index.html;
 * anything without a trailing slash must be a real file (so `/work` without
 * the slash fails, matching trailingSlash: 'always').
 */
export function existsInDist(urlPath: string): boolean {
  requireDist();
  const rel = decodeURI(urlPath.split(/[?#]/)[0]).replace(/^\//, '');
  if (rel === '' || rel.endsWith('/')) return existsSync(join(distDir, rel, 'index.html'));
  const file = join(distDir, rel);
  return existsSync(file) && statSync(file).isFile();
}

export interface ContentFile {
  slug: string;
  status: 'draft' | 'published';
  title: string;
  /** Path relative to the project root. */
  path: string;
}

/** Project files from both the public and the (git-ignored) drafts folder. */
export function contentFiles(): ContentFile[] {
  return glob('src/content/work/*.md', 'src/content/drafts/*.md').map((path) => {
    const fm = read(path).match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
    const get = (key: string) =>
      fm.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))?.[1].trim().replace(/^['"]|['"]$/g, '');
    return {
      slug: basename(path, '.md'),
      status: get('status') === 'published' ? 'published' : 'draft',
      title: get('title') ?? '',
      path,
    };
  });
}
