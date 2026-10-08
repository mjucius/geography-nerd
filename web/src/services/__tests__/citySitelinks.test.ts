// @vitest-environment node
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
// @ts-expect-error plain .mjs shared with the fetch script, no types
import { pickCandidate } from '../../../../scripts/sitelinks-match.mjs';

const root = new URL('../../../../', import.meta.url);
const sql = readFileSync(new URL('data/cities-import.sql', root), 'utf8');
const sitelinks: Record<string, { qid: string; sitelinks: number }> = JSON.parse(
  readFileSync(new URL('data/city-sitelinks.json', root), 'utf8')
);
const keys = [...sql.matchAll(/\('((?:[^']|'')+)', '([^']+)', [0-9]+, -?[0-9.]+, -?[0-9.]+\)/g)].map(
  (m) => `${m[1].replace(/''/g, "'")}|${m[2]}`
);

describe('city sitelinks data', () => {
  it('has a QID and a positive count for every city in the SQL, and nothing else', () => {
    expect(keys.length).toBeGreaterThanOrEqual(1000);
    expect(Object.keys(sitelinks).sort()).toEqual([...keys].sort());
    for (const v of Object.values(sitelinks)) {
      expect(v.qid).toMatch(/^Q\d+$/);
      expect(Number.isInteger(v.sitelinks) && v.sitelinks > 0).toBe(true);
    }
  });

  it('maps Paris, France to Q90', () => {
    expect(sitelinks['Paris|FR'].qid).toBe('Q90');
  });
});

describe('pickCandidate', () => {
  const paris = { lat: 48.85, lon: 2.35 };
  const local = { qid: 'Q90', lat: 48.8566, lon: 2.3522, sitelinks: 300 };
  const texas = { qid: 'Q830149', lat: 33.66, lon: -95.55, sitelinks: 900 };

  it('rejects a distant namesake with more sitelinks', () => {
    expect(pickCandidate(paris, [texas, local])).toBe(local);
  });

  it('returns null when nothing is within 40 km', () => {
    expect(pickCandidate(paris, [texas])).toBeNull();
  });

  it('rejects a lone override that is far away or has no coordinates', () => {
    expect(pickCandidate(paris, [{ ...texas, sitelinks: 5 }])).toBeNull();
    expect(pickCandidate(paris, [{ qid: 'Q1', sitelinks: 5 }])).toBeNull();
  });
});
