import { describe, expect, it } from 'vitest';
import { LEVELS } from '../levels';
import { getCitiesByDifficulty } from '../cityDataService';
import { LOCAL_CITIES } from '../../data/localCities';
import { validPairs } from '../quizService';
import type { DifficultyLevel } from '../../types';

const allLevels: DifficultyLevel[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

describe('level table', () => {
  it('has 10 levels', () => {
    expect(LEVELS).toHaveLength(10);
  });

  it.each(allLevels.slice(1))('level %i is at least as hard as the one before, and strictly harder somewhere', (level) => {
    const prev = LEVELS[level - 2];
    const cur = LEVELS[level - 1];
    expect(cur.pool).toBeGreaterThanOrEqual(prev.pool);
    expect(cur.askedMin).toBeLessThanOrEqual(prev.askedMin);
    expect(cur.askedMax).toBeLessThanOrEqual(prev.askedMax);
    expect(cur.otherMin).toBeGreaterThanOrEqual(prev.otherMin);
    expect(
      cur.pool > prev.pool || cur.askedMin < prev.askedMin || cur.askedMax < prev.askedMax || cur.otherMin > prev.otherMin
    ).toBe(true);
  });

  it.each(allLevels)('level %i has at least 200 valid pairs', async (level) => {
    expect(validPairs(await getCitiesByDifficulty(level), level).length).toBeGreaterThanOrEqual(200);
  });

  it('level 1 asks only clear gaps', () => {
    expect(LEVELS[0].askedMin).toBeGreaterThanOrEqual(1000);
  });

  it('level 10 draws from every city and includes close-on-one-axis, far-on-the-other pairs', async () => {
    const pool = await getCitiesByDifficulty(10);
    expect(pool).toHaveLength(LOCAL_CITIES.length);
    expect(LEVELS[9].askedMax).toBeLessThanOrEqual(100);
    expect(LEVELS[9].otherMin).toBeGreaterThanOrEqual(3000);
    expect(validPairs(pool, 10).length).toBeGreaterThan(0);
  });

  it('leaves out a pair that shares a latitude exactly (Medan and Buenaventura), but not one a hair off', async () => {
    const pool = await getCitiesByDifficulty(10);
    const medan = LOCAL_CITIES.find((c) => c.name === 'Medan')!;
    const buenaventura = LOCAL_CITIES.find((c) => c.name === 'Buenaventura')!;
    expect(medan.latitude).toBe(buenaventura.latitude);
    const has = (list: [typeof medan, typeof medan][], a: typeof medan, b: typeof medan) =>
      list.some(([x, y]) => (x.id === a.id && y.id === b.id) || (x.id === b.id && y.id === a.id));
    expect(has(validPairs(pool, 10), medan, buenaventura)).toBe(false);
    const nudged = [{ ...medan, latitude: medan.latitude + 0.001 }, buenaventura];
    expect(has(validPairs(nudged, 10), nudged[0], buenaventura)).toBe(true);
  });
});
