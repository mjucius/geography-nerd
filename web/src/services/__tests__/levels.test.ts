import { describe, expect, it } from 'vitest';
import { LEVELS, MIN_ASKED_KM } from '../levels';
import { getCitiesByDifficulty } from '../cityDataService';
import { LOCAL_CITIES } from '../../data/localCities';
import { validPairs } from '../quizService';
import { getDistanceInfo } from '../distance';
import type { City, DifficultyLevel } from '../../types';

const allLevels: DifficultyLevel[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

describe('level table', () => {
  it('has 10 levels', () => {
    expect(LEVELS).toHaveLength(10);
  });

  it.each(allLevels.slice(1))('level %i is at least as hard as the one before, and strictly harder somewhere', (level) => {
    const prev = LEVELS[level - 2];
    const cur = LEVELS[level - 1];
    expect(cur.pool).toBeGreaterThanOrEqual(prev.pool);
    // Levels at the floor are tied on the asked minimum, which is allowed.
    const curMin = Math.max(cur.askedMin, MIN_ASKED_KM);
    const prevMin = Math.max(prev.askedMin, MIN_ASKED_KM);
    expect(curMin).toBeLessThanOrEqual(prevMin);
    expect(cur.askedMax).toBeLessThanOrEqual(prev.askedMax);
    expect(cur.otherMin).toBeGreaterThanOrEqual(prev.otherMin);
    expect(
      cur.pool > prev.pool || curMin < prevMin || cur.askedMax < prev.askedMax || cur.otherMin > prev.otherMin
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

  it.each(allLevels)('level %i has no valid pair with an asked gap under the 25 km floor', async (level) => {
    expect(MIN_ASKED_KM).toBe(25);
    const pairs = validPairs(await getCitiesByDifficulty(level), level);
    const smallest = Math.min(
      ...pairs.map(([a, b]) => {
        const { ns, ew } = getDistanceInfo(a, b);
        return Math.min(ns.km, ew.km);
      })
    );
    expect(smallest).toBeGreaterThanOrEqual(MIN_ASKED_KM);
  });

  it('pins the floor on both sides, and rejects an exactly shared latitude (Medan and Buenaventura)', async () => {
    const pool = await getCitiesByDifficulty(10);
    const medan = LOCAL_CITIES.find((c) => c.name === 'Medan')!;
    const buenaventura = LOCAL_CITIES.find((c) => c.name === 'Buenaventura')!;
    expect(medan.latitude).toBe(buenaventura.latitude);
    const has = (list: [typeof medan, typeof medan][], a: typeof medan, b: typeof medan) =>
      list.some(([x, y]) => (x.id === a.id && y.id === b.id) || (x.id === b.id && y.id === a.id));
    expect(has(validPairs(pool, 10), medan, buenaventura)).toBe(false);
    const nudgedBy = (degrees: number) => [{ ...medan, latitude: medan.latitude + degrees }, buenaventura];
    // About 100 m: far under the floor. About 55 km: above it. Both are far apart east-west.
    expect(validPairs(nudgedBy(0.001), 10)).toEqual([]);
    expect(validPairs(nudgedBy(0.5), 10)).toHaveLength(1);
    // Either side of 25 km (0.2245 degrees of latitude).
    expect(validPairs(nudgedBy(0.2), 10)).toEqual([]);
    expect(validPairs(nudgedBy(0.25), 10)).toHaveLength(1);
    expect(has(validPairs(nudgedBy(0.5), 10), nudgedBy(0.5)[0], buenaventura)).toBe(true);
  });
});

const fold = (name: string) => name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const displayed = (c: City) => fold(c.name === 'Washington' && c.country_code === 'US' ? 'Washington D.C.' : c.name);

describe('same-name pairs', () => {
  it.each(allLevels)('level %i has no pair of cities with the same displayed name', async (level) => {
    for (const [a, b] of validPairs(await getCitiesByDifficulty(level), level)) {
      expect(displayed(a)).not.toBe(displayed(b));
    }
  });

  it('never pairs London, UK with London, Canada, though their gaps fit level 3', () => {
    const londons = LOCAL_CITIES.filter((c) => c.name === 'London');
    expect(londons.map((c) => c.country_code).sort()).toEqual(['CA', 'GB']);
    // About 950 km on the asked axis and far more on the other: inside level 3's band (700 km and up).
    expect(validPairs([...londons], 3)).toEqual([]);
  });

  // Level 1 needs an asked gap of 1500 km or more, which these two cities have.
  const at = (id: number, name: string, latitude: number, longitude: number, country_code = 'XX'): City => ({
    id, name, country: country_code, country_code, population: 1, sitelinks: 1,
    latitude, longitude, location: { type: 'Point', coordinates: [longitude, latitude] },
  });
  const pairedAtLevel1 = (a: City, b: City) => validPairs([a, b], 1).length === 1;

  it('folds accents and case, and compares the displayed name', () => {
    expect(pairedAtLevel1(at(1, 'Cartagena', 0, 0), at(2, 'Lima', 20, 40))).toBe(true);
    expect(pairedAtLevel1(at(1, 'Córdoba', 0, 0), at(2, 'Cordoba', 20, 40))).toBe(false);
    expect(pairedAtLevel1(at(1, 'LONDON', 0, 0), at(2, 'London', 20, 40))).toBe(false);
    expect(pairedAtLevel1(at(1, 'Washington', 0, 0, 'US'), at(2, 'Washington D.C.', 20, 40))).toBe(false);
    expect(pairedAtLevel1(at(1, 'Washington', 0, 0, 'GB'), at(2, 'Washington D.C.', 20, 40))).toBe(true);
  });
});
