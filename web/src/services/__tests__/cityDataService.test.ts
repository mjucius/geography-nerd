import { describe, expect, it } from 'vitest';
import { getCitiesByDifficulty } from '../cityDataService';
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
