import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const src = resolve(__dirname, '..');
const sources = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const path = join(dir, e.name);
    if (e.isDirectory()) return e.name === '__tests__' ? [] : sources(path);
    return /\.(ts|tsx)$/.test(e.name) && !/(\.test\.|test-setup|test-fixtures)/.test(e.name) ? [path] : [];
  });
const files = sources(src);
const matching = (re: RegExp) => files.filter((f) => re.test(readFileSync(f, 'utf8'))).map((f) => f.slice(src.length + 1));

describe('app source', () => {
  it('has source files to scan', () => {
    expect(files.length).toBeGreaterThan(10);
  });

  it('makes no network request of its own, so the Wikidata counts cannot be fetched at runtime', () => {
    expect(matching(/\bfetch\(|XMLHttpRequest|sendBeacon|WebSocket|EventSource/)).toEqual([]);
  });

  it('stores nothing, so the level resets on every visit', () => {
    expect(matching(/localStorage|sessionStorage|indexedDB|document\.cookie/)).toEqual([]);
  });

  it('mentions wikidata.org only in the Credits link', () => {
    expect(matching(/wikidata\.org/)).toEqual(['components/AboutModal.tsx']);
  });
});
