import { describe, expect, it } from 'vitest';
import type { City, DifficultyLevel } from '../../types';
import { buildQuestion, generateQuestions } from '../quizService';
import { getCitiesByDifficulty } from '../cityDataService';
import { getDistanceInfo } from '../distance';
import { LEVELS } from '../levels';

const city = (id: number, latitude: number, longitude: number): City => ({
  id,
  name: `City${id}`,
  country: 'X',
  population: 1,
  sitelinks: 1,
  latitude,
  longitude,
  location: { type: 'Point', coordinates: [longitude, latitude] },
});

describe('buildQuestion', () => {
  it('asks the axis with the smaller gap in km, and east-west on a tie', () => {
    // Mean latitude 0, so 4 degrees of latitude and 4 degrees of longitude are the same km.
    const tie = buildQuestion(city(1, 2, 4), city(2, -2, 0), 1);
    expect(tie.type).toBe('longitudinal');
    expect(tie.correctAnswer).toBe('East');
    // 10 degrees of latitude (1113 km) against 12 degrees of longitude at 60N (~668 km): east-west is smaller in km.
    const km = buildQuestion(city(3, 65, 12), city(4, 55, 0), 1);
    expect(km.type).toBe('longitudinal');
    // 10 degrees of longitude at the equator (1113 km) against 9 degrees of latitude (1002 km).
    const lat = buildQuestion(city(5, 9, 10), city(6, 0, 0), 1);
    expect(lat.type).toBe('latitudinal');
    expect(lat.correctAnswer).toBe('North');
  });
});

describe('generateQuestions', () => {
  it.each([1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as DifficultyLevel[])(
    'level %i: 8 current + 2 next (10 at level 10), each inside its own pool and band, no repeated pair',
    async (level) => {
      const pools = new Map<number, Set<number>>();
      for (const l of [level, Math.min(level + 1, 10)]) {
        pools.set(l, new Set((await getCitiesByDifficulty(l as DifficultyLevel)).map((c) => c.id)));
      }
      for (let run = 0; run < 50; run++) {
        const questions = await generateQuestions(await getCitiesByDifficulty(level), level);
        expect(questions).toHaveLength(10);
        expect(questions.filter((q) => q.difficultyLevel === level)).toHaveLength(level === 10 ? 10 : 8);
        expect(questions.filter((q) => q.difficultyLevel === level + 1)).toHaveLength(level === 10 ? 0 : 2);
        const keys = questions.map((q) => [q.city1.id, q.city2.id].sort().join('-'));
        expect(new Set(keys).size).toBe(10);
        for (const q of questions) {
          const pool = pools.get(q.difficultyLevel)!;
          expect(pool.has(q.city1.id) && pool.has(q.city2.id)).toBe(true);
          const { ns, ew } = getDistanceInfo(q.city1, q.city2);
          const asked = Math.min(ns.km, ew.km);
          const other = Math.max(ns.km, ew.km);
          const band = LEVELS[q.difficultyLevel - 1];
          const shown = q.questionTextParts.flatMap((p) => (p.type === 'city' ? [p.cityName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()] : []));
          expect(shown).toHaveLength(2);
          expect(shown[0]).not.toBe(shown[1]);
          expect(asked).toBeGreaterThan(0);
          expect(asked).toBeGreaterThanOrEqual(band.askedMin);
          expect(asked).toBeLessThanOrEqual(band.askedMax);
          expect(other).toBeGreaterThanOrEqual(band.otherMin);
          expect(q.type).toBe(ns.km < ew.km ? 'latitudinal' : 'longitudinal');
        }
      }
    }
  );
});
