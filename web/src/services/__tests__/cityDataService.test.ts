// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { readFileSync, statSync } from 'node:fs';
import { getCitiesByDifficulty } from '../cityDataService';
import { LOCAL_CITIES } from '../../data/localCities';
import { LEVELS } from '../levels';
import type { DifficultyLevel } from '../../types';

const allLevels: DifficultyLevel[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

describe('getCitiesByDifficulty', () => {
  it.each(allLevels)('level %i returns the pool size from the level table, most familiar first', async (level) => {
    const cities = await getCitiesByDifficulty(level);
    expect(cities).toHaveLength(Math.min(LEVELS[level - 1].pool, LOCAL_CITIES.length));
    const chosen = new Set(cities.map((c) => c.id));
    const leastKnownIn = Math.min(...cities.map((c) => c.sitelinks));
    for (const c of LOCAL_CITIES) {
      if (!chosen.has(c.id)) expect(c.sitelinks).toBeLessThanOrEqual(leastKnownIn);
    }
  });

  it('pools never shrink from level 2 to 10, grow at least once, and nest', async () => {
    const pools = await Promise.all(allLevels.map((l) => getCitiesByDifficulty(l)));
    let grew = false;
    for (let i = 1; i < pools.length; i++) {
      expect(pools[i].length).toBeGreaterThanOrEqual(pools[i - 1].length);
      grew ||= pools[i].length > pools[i - 1].length;
      const next = new Set(pools[i].map((c) => c.id));
      for (const c of pools[i - 1]) expect(next.has(c.id)).toBe(true);
    }
    expect(grew).toBe(true);
  });

  it('level 10 returns all cities', async () => {
    expect(await getCitiesByDifficulty(10)).toHaveLength(LOCAL_CITIES.length);
  });
});

describe('LOCAL_CITIES', () => {
  const root = new URL('../../../../', import.meta.url);
  const sitelinks: Record<string, { qid: string; sitelinks: number }> = JSON.parse(
    readFileSync(new URL('data/city-sitelinks.json', root), 'utf8')
  );

  const sql = readFileSync(new URL('data/cities-import.sql', root), 'utf8');
  const sqlKeys = [...sql.matchAll(/\('((?:[^']|'')+)', '([^']+)', [0-9]+, -?[0-9.]+, -?[0-9.]+\)/g)].map(
    (m) => `${m[1].replace(/''/g, "'")}|${m[2]}`
  );
  const excluded: Record<string, string> = JSON.parse(readFileSync(new URL('data/excluded-cities.json', root), 'utf8'));
  const keyOf = (c: (typeof LOCAL_CITIES)[number]) => `${c.name}|${c.country_code}`;
  const shipped = (name: string, cc: string) => LOCAL_CITIES.filter((c) => keyOf(c) === `${name}|${cc}`);

  it('ships the SQL cities minus the excluded ones, with ids 1..n and the sitelink count from the data file', () => {
    expect(LOCAL_CITIES).toHaveLength(sqlKeys.length - Object.keys(excluded).length);
    expect(LOCAL_CITIES.map((c) => c.id)).toEqual(LOCAL_CITIES.map((_, i) => i + 1));
    for (const c of LOCAL_CITIES) {
      expect(c.sitelinks).toBe(sitelinks[keyOf(c)].sitelinks);
    }
  });

  it('lists only real SQL rows in excluded-cities.json, each with a reason, and ships none of them', () => {
    for (const [key, reason] of Object.entries(excluded)) {
      expect(sqlKeys).toContain(key);
      expect(reason).toMatch(/^(duplicate of|part of) \S/);
      expect(LOCAL_CITIES.some((c) => keyOf(c) === key)).toBe(false);
    }
  });

  it('ships no two cities with the same Wikidata ID', () => {
    const qids = LOCAL_CITIES.map((c) => sitelinks[keyOf(c)].qid);
    expect(new Set(qids).size).toBe(qids.length);
  });

  it('drops both Benito Juárez rows and both Fuencarral rows, and keeps Lexington and Jaboatão dos Guararapes once', () => {
    for (const [name, cc] of [['Benito Juárez', 'MX'], ['Benito Juarez', 'MX'], ['Fuencarral', 'ES'], ['Fuencarral-El Pardo', 'ES'], ['Jaboatão', 'BR'], ['Lexington-Fayette', 'US']]) {
      expect(shipped(name, cc)).toHaveLength(0);
    }
    expect(shipped('Lexington', 'US')).toHaveLength(1);
    expect(shipped('Jaboatão dos Guararapes', 'BR')).toHaveLength(1);
  });

  it('has no capital flag anywhere', () => {
    for (const c of LOCAL_CITIES) expect(c).not.toHaveProperty('is_capital');
    const rows: unknown[][] = JSON.parse(readFileSync(new URL('../../data/cities.json', import.meta.url), 'utf8')).cities;
    for (const row of rows) expect(row).toHaveLength(6);
    expect(sql).not.toMatch(/is_capital/);
  });

  it('expands Paris into the City shape', () => {
    const paris = LOCAL_CITIES.find((c) => c.name === 'Paris' && c.country_code === 'FR');
    expect(paris).toMatchObject({
      country: 'FR',
      countries: { code: 'FR', name: 'France', region: 'Europe' },
      region: 'Europe',
    });
    expect(paris?.location.coordinates).toEqual([paris?.longitude, paris?.latitude]);
    expect(paris?.sitelinks).toBeGreaterThan(100);
    expect(paris?.latitude).toBeCloseTo(48.85, 1);
    expect(paris?.longitude).toBeCloseTo(2.35, 1);
  });

  it('stays under the old 430 bytes per city', () => {
    const bytes = statSync(new URL('../../data/cities.json', import.meta.url)).size;
    expect(bytes / LOCAL_CITIES.length).toBeLessThanOrEqual(430);
  });
});
