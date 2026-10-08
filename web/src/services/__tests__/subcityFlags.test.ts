// @vitest-environment node
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
// @ts-expect-error plain .mjs shared with the flag script, no types
import { classify } from '../../../../scripts/subcity-classes.mjs';

const root = new URL('../../../../', import.meta.url);
const read = (file: string) => readFileSync(new URL(file, root), 'utf8');

type Report = { classes: Record<string, string>; cities: Record<string, { tier: string; classes: string[] }> };
const report: Report = JSON.parse(read('data/subcity-flags.json'));
const excluded: Record<string, string> = JSON.parse(read('data/excluded-cities.json'));
const kept: Record<string, string> = JSON.parse(read('data/kept-after-review.json'));
const sqlKeys = [...read('data/cities-import.sql').matchAll(/\('((?:[^']|'')+)', '([^']+)', [0-9]+, -?[0-9.]+, -?[0-9.]+\)/g)].map(
  (m) => `${m[1].replace(/''/g, "'")}|${m[2]}`
);
const idOf = (label: string) => Object.entries(report.classes).find(([, l]) => l === label)![0];

describe('classify', () => {
  it('flags a city with any strong sub-city class, even next to an ordinary one', () => {
    for (const labels of [['district of Barcelona', 'ensanche'], ['town', 'neighborhood in Boston'], ['district of the Australian Capital Territory', 'district']]) {
      expect(classify(labels.map(idOf))).toBe('flagged');
    }
  });

  it('marks only-weak classes for review and leaves ordinary cities alone', () => {
    expect(classify(['district of Turkey', 'town', 'municipality of Turkey'].map(idOf))).toBe('review');
    expect(classify(['city', 'big city'].map(idOf))).toBe('');
    expect(classify([])).toBe('');
  });
});

describe('data/subcity-flags.json', () => {
  it('covers exactly the cities of the SQL, excluded ones included', () => {
    expect(Object.keys(report.cities).sort()).toEqual([...sqlKeys].sort());
  });

  it('agrees with the classifier for every city (so a classifier change shows up without refetching)', () => {
    for (const [key, city] of Object.entries(report.cities)) {
      expect(classify(city.classes), key).toBe(city.tier);
      for (const q of city.classes) expect(report.classes[q], q).toBeTruthy();
    }
  });

  it.each(['Eixample|ES', 'Hamburg-Nord|DE', 'Sector 4|RO', 'Gustavo Adolfo Madero|MX', 'South Boston|US', 'Tuggeranong Administrative District|AU'])(
    'flags %s',
    (key) => {
      expect(report.cities[key].tier).toBe('flagged');
    }
  );

  it.each(['Brampton|CA', 'Yokohama|JP', 'Giza|EG', 'Quezon City|PH'])('does not flag %s', (key) => {
    expect(report.cities[key].tier).toBe('');
  });
});

describe('review of the flagged and review cities', () => {
  const marked = Object.keys(report.cities).filter((k) => report.cities[k].tier);

  it('has put every flagged or review city on exactly one of the two lists', () => {
    for (const key of marked) {
      expect(key in excluded || key in kept, key).toBe(true);
      expect(key in excluded && key in kept, key).toBe(false);
    }
  });

  it('keeps only cities the report marks, each with a reason', () => {
    for (const [key, reason] of Object.entries(kept)) {
      expect(marked, key).toContain(key);
      expect(reason.length, key).toBeGreaterThan(10);
    }
  });
});

