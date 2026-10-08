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
    expect(cities).toHaveLength(LEVELS[level - 1].pool);
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
  const sitelinks: Record<string, { sitelinks: number }> = JSON.parse(
    readFileSync(new URL('data/city-sitelinks.json', root), 'utf8')
  );

  it('has 1,000 cities with unique ids and the sitelink count from the data file', () => {
    expect(LOCAL_CITIES).toHaveLength(1000);
    expect(new Set(LOCAL_CITIES.map((c) => c.id)).size).toBe(1000);
    for (const c of LOCAL_CITIES) {
      expect(c.sitelinks).toBe(sitelinks[`${c.name}|${c.country_code}`].sitelinks);
    }
  });

  it('has no capital flag anywhere', () => {
    for (const c of LOCAL_CITIES) expect(c).not.toHaveProperty('is_capital');
    const rows: unknown[][] = JSON.parse(readFileSync(new URL('../../data/cities.json', import.meta.url), 'utf8')).cities;
    for (const row of rows) expect(row).toHaveLength(6);
    const sql = readFileSync(new URL('data/cities-import.sql', root), 'utf8');
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
