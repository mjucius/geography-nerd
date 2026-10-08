// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { readFileSync, statSync } from 'node:fs';
import { getCitiesByDifficulty } from '../cityDataService';
import { LOCAL_CITIES } from '../../data/localCities';
import { FROZEN_LEVEL_IDS } from './frozenLevelIds';
import type { City, DifficultyLevel } from '../../types';

const allLevels: DifficultyLevel[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function assertSortedAndCapped(cities: City[]) {
  expect(cities.length).toBeGreaterThan(0);
  expect(cities.length).toBeLessThanOrEqual(100);
  for (let i = 1; i < cities.length; i++) {
    expect(cities[i].population).toBeLessThanOrEqual(cities[i - 1].population);
  }
}

describe('getCitiesByDifficulty', () => {
  it.each(allLevels)('level %i returns sorted, capped, non-empty results', async (level) => {
    const cities = await getCitiesByDifficulty(level);
    assertSortedAndCapped(cities);
  });

  it('level 1 returns only capitals with population > 500,000', async () => {
    const cities = await getCitiesByDifficulty(1);
    for (const city of cities) {
      expect(city.is_capital).toBe(true);
      expect(city.population).toBeGreaterThan(500000);
    }
  });

  it('level 2 returns only capitals with population > 500,000', async () => {
    const cities = await getCitiesByDifficulty(2);
    for (const city of cities) {
      expect(city.is_capital).toBe(true);
      expect(city.population).toBeGreaterThan(500000);
    }
  });

  it('level 3 returns only capitals with population > 200,000', async () => {
    const cities = await getCitiesByDifficulty(3);
    for (const city of cities) {
      expect(city.is_capital).toBe(true);
      expect(city.population).toBeGreaterThan(200000);
    }
  });

  it('level 4 returns only capitals (any population)', async () => {
    const cities = await getCitiesByDifficulty(4);
    for (const city of cities) {
      expect(city.is_capital).toBe(true);
    }
  });

  it('level 5 returns only capitals (any population)', async () => {
    const cities = await getCitiesByDifficulty(5);
    for (const city of cities) {
      expect(city.is_capital).toBe(true);
    }
  });

  it('level 6 returns cities with population > 1,000,000', async () => {
    const cities = await getCitiesByDifficulty(6);
    for (const city of cities) {
      expect(city.population).toBeGreaterThan(1000000);
    }
  });

  it('level 7 returns cities with population > 500,000', async () => {
    const cities = await getCitiesByDifficulty(7);
    for (const city of cities) {
      expect(city.population).toBeGreaterThan(500000);
    }
  });

  it('level 8 returns cities with population > 250,000', async () => {
    const cities = await getCitiesByDifficulty(8);
    for (const city of cities) {
      expect(city.population).toBeGreaterThan(250000);
    }
  });

  it('level 9 returns cities with population > 100,000', async () => {
    const cities = await getCitiesByDifficulty(9);
    for (const city of cities) {
      expect(city.population).toBeGreaterThan(100000);
    }
  });

  it('level 10 returns cities with population > 50,000', async () => {
    const cities = await getCitiesByDifficulty(10);
    for (const city of cities) {
      expect(city.population).toBeGreaterThan(50000);
    }
  });
});

describe('level pools stay as before the 1,000-city data', () => {
  it.each(allLevels)('level %i returns the same cities as before', async (level) => {
    const ids = (await getCitiesByDifficulty(level)).map((c) => c.id);
    expect(ids).toEqual(FROZEN_LEVEL_IDS[level]);
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
