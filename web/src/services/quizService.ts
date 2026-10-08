import type { City, Question, DifficultyLevel, QuestionTextPart } from '../types';
import { getCitiesByDifficulty } from './cityDataService';
import { getDistanceInfo } from './distance';
import { LEVELS, MIN_ASKED_KM } from './levels';

type Pair = [City, City];

// Asked gap = the smaller of the north-south and east-west gaps in km (the same km the reveal shows), other gap = the larger.
function gaps(a: City, b: City) {
  const { ns, ew } = getDistanceInfo(a, b);
  return { asked: Math.min(ns.km, ew.km), other: Math.max(ns.km, ew.km) };
}

// Name as the player sees it, folded for comparing: London in the UK and London in Canada must not meet.
const nameKey = (c: City) => formatCityName(c.name, c.country_code).normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();

const pairCache = new WeakMap<City[], Pair[]>();

/**
 * Every pair of the pool that fits the level's band. The asked gap is at least MIN_ASKED_KM at every level,
 * which also rules out an exactly zero gap (the cities share that axis, which a North/South or East/West answer cannot express).
 * Two cities with the same displayed name (ignoring case and accents) never pair.
 */
export function validPairs(pool: City[], level: DifficultyLevel): Pair[] {
  const cached = pairCache.get(pool);
  if (cached) return cached;
  const { askedMin: tableMin, askedMax, otherMin } = LEVELS[level - 1];
  const askedMin = Math.max(tableMin, MIN_ASKED_KM);
  const keys = pool.map(nameKey);
  const pairs: Pair[] = [];
  for (let i = 0; i < pool.length; i++) {
    for (let j = i + 1; j < pool.length; j++) {
      if (keys[i] === keys[j]) continue;
      const { asked, other } = gaps(pool[i], pool[j]);
      if (asked >= askedMin && asked <= askedMax && other >= otherMin) pairs.push([pool[i], pool[j]]);
    }
  }
  pairCache.set(pool, pairs);
  return pairs;
}

/**
 * Format city name for display, adding clarification where needed
 */
function formatCityName(cityName: string, countryCode?: string): string {
  // Special case: Washington in the US should be Washington D.C.
  if (cityName === 'Washington' && countryCode === 'US') {
    return 'Washington D.C.';
  }
  return cityName;
}

/**
 * Generate 10 questions: 8 from the current level + 2 preview from the next level (10 from the current level at level 10).
 * No pair appears twice, not even across the two levels.
 */
export async function generateQuestions(cities: City[], difficultyLevel: DifficultyLevel = 1): Promise<Question[]> {
  const used = new Set<string>();
  const pick = (pool: City[], level: DifficultyLevel, count: number) => {
    const pairs = shuffleArray(validPairs(pool, level));
    const questions: Question[] = [];
    for (const [a, b] of pairs) {
      if (questions.length === count) break;
      const key = `${Math.min(a.id, b.id)}-${Math.max(a.id, b.id)}`;
      if (used.has(key)) continue;
      used.add(key);
      const [first, second] = Math.random() < 0.5 ? [a, b] : [b, a];
      questions.push(buildQuestion(first, second, level));
    }
    return questions;
  };

  const isMaxLevel = difficultyLevel === 10;
  const questions = pick(cities, difficultyLevel, isMaxLevel ? 10 : 8);
  if (!isMaxLevel) {
    const nextLevel = (difficultyLevel + 1) as DifficultyLevel;
    questions.push(...pick(await getCitiesByDifficulty(nextLevel), nextLevel, 2));
  }

  // Shuffle final question order to mix current and preview questions
  return shuffleArray(questions);
}

export function buildQuestion(city1: City, city2: City, tier: DifficultyLevel): Question {
  const { ns, ew } = getDistanceInfo(city1, city2);

  // The asked axis is the one with the smaller gap in km; a tie asks east-west.
  const isLatitudinal = ns.km < ew.km;

  let questionText: string;
  let correctAnswer: 'North' | 'South' | 'East' | 'West';
  const country1Name = city1.countries?.name || city1.country;
  const country2Name = city2.countries?.name || city2.country;
  const formattedCity1Name = formatCityName(city1.name, city1.country_code);
  const formattedCity2Name = formatCityName(city2.name, city2.country_code);

  let questionTextParts: QuestionTextPart[];

  if (isLatitudinal) {
    questionText = `Is ${formattedCity1Name}, ${country1Name} north or south of ${formattedCity2Name}, ${country2Name}?`;
    correctAnswer = ns.direction;
    questionTextParts = [
      { type: 'text', content: 'Is ' },
      { type: 'city', cityName: formattedCity1Name, countryName: country1Name },
      { type: 'text', content: ' north or south of ' },
      { type: 'city', cityName: formattedCity2Name, countryName: country2Name },
      { type: 'text', content: '?' }
    ];
  } else {
    questionText = `Is ${formattedCity1Name}, ${country1Name} east or west of ${formattedCity2Name}, ${country2Name}?`;
    correctAnswer = ew.direction;
    questionTextParts = [
      { type: 'text', content: 'Is ' },
      { type: 'city', cityName: formattedCity1Name, countryName: country1Name },
      { type: 'text', content: ' east or west of ' },
      { type: 'city', cityName: formattedCity2Name, countryName: country2Name },
      { type: 'text', content: '?' }
    ];
  }

  return {
    questionText,
    questionTextParts,
    city1,
    city2,
    correctAnswer,
    type: isLatitudinal ? 'latitudinal' : 'longitudinal',
    options: isLatitudinal ? ['North', 'South'] : ['East', 'West'],
    difficultyLevel: tier
  };
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
