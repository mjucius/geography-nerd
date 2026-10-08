import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { City, DifficultyLevel } from '../../types';
import { generateQuestions } from '../quizService';
import { getCitiesByDifficulty } from '../cityDataService';

vi.mock('../cityDataService', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../cityDataService')>()),
  getCitiesByDifficulty: vi.fn(),
}));

const city = (id: number, longitude: number): City => ({
  id,
  name: `City${id}`,
  country: 'X',
  population: 1,
  sitelinks: 1,
  latitude: 0,
  longitude,
  location: { type: 'Point', coordinates: [longitude, 0] },
});

// Same latitude: the gap ratio is Infinity, which fails the gates of levels 5, 8 and 9.
const sameLat = [city(1, 10), city(2, 20)];
const nextPool = [city(3, 30), city(4, 40)];

const inPool = (pool: City[], q: { city1: City; city2: City }) =>
  pool.some((c) => c.id === q.city1.id) && pool.some((c) => c.id === q.city2.id);

describe('generateQuestions when the ratio gate cannot be met', () => {
  beforeEach(() => vi.mocked(getCitiesByDifficulty).mockResolvedValue(nextPool));

  it.each([5, 8, 9] as DifficultyLevel[])('level %i still gives 8 current and 2 next-level questions', async (level) => {
    const questions = await generateQuestions(sameLat, level);
    const current = questions.filter((q) => q.difficultyLevel === level);
    const next = questions.filter((q) => q.difficultyLevel === level + 1);
    expect(current).toHaveLength(8);
    expect(next).toHaveLength(2);
    expect(current.every((q) => inPool(sameLat, q))).toBe(true);
    expect(next.every((q) => inPool(nextPool, q))).toBe(true);
  });

  it('level 10 gives 10 level-10 questions', async () => {
    const questions = await generateQuestions(sameLat, 10);
    expect(questions).toHaveLength(10);
    expect(questions.every((q) => q.difficultyLevel === 10 && inPool(sameLat, q))).toBe(true);
  });
});

describe('generateQuestions on the real data', () => {
  it.each([1, 2, 3, 4, 5, 6, 7, 8, 9] as DifficultyLevel[])('level %i: 8 current + 2 next, each from its own pool', async (level) => {
    const real = await vi.importActual<typeof import('../cityDataService')>('../cityDataService');
    vi.mocked(getCitiesByDifficulty).mockImplementation(real.getCitiesByDifficulty);
    const pools = new Map<number, Set<number>>();
    for (const l of [level, level + 1]) pools.set(l, new Set((await real.getCitiesByDifficulty(l as DifficultyLevel)).map((c) => c.id)));
    for (let run = 0; run < 20; run++) {
      const questions = await generateQuestions(await real.getCitiesByDifficulty(level), level);
      expect(questions.filter((q) => q.difficultyLevel === level)).toHaveLength(8);
      expect(questions.filter((q) => q.difficultyLevel === level + 1)).toHaveLength(2);
      for (const q of questions) {
        const pool = pools.get(q.difficultyLevel)!;
        expect(pool.has(q.city1.id) && pool.has(q.city2.id)).toBe(true);
      }
    }
  });
});
