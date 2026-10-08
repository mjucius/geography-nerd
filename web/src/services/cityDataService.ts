import { LOCAL_CITIES } from '../data/localCities';
import type { City, DifficultyLevel } from '../types';
import { LEVELS } from './levels';

// Most familiar first: sitelinks, then population, then id.
const BY_FAMILIARITY = [...LOCAL_CITIES].sort(
  (a, b) => b.sitelinks - a.sitelinks || b.population - a.population || a.id - b.id
);

// Same array every call, so quizService can cache the pairs per pool.
const POOLS = LEVELS.map(({ pool }) => BY_FAMILIARITY.slice(0, pool));

export async function getCitiesByDifficulty(difficultyLevel: DifficultyLevel): Promise<City[]> {
  return POOLS[difficultyLevel - 1];
}
