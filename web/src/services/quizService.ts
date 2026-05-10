import type { City, Question, DifficultyLevel, QuestionTextPart } from '../types';
import { getCitiesByDifficulty } from './cityDataService';

/**
 * Calculate distance ratio between lat and lon differences
 * Ratio = shorter distance / longer distance
 * Lower ratio = harder (more aligned on one axis)
 */
function getDistanceRatio(latDiff: number, lonDiff: number): number {
  if (latDiff === 0 || lonDiff === 0) return Infinity;
  const shorter = Math.min(latDiff, lonDiff);
  const longer = Math.max(latDiff, lonDiff);
  return shorter / longer;
}

/**
 * Check if a ratio matches the requirements for a given tier
 */
function isValidRatioForTier(ratio: number, tier: DifficultyLevel): boolean {
  switch (tier) {
    case 1:
      return ratio > 0.75; // Capital Foundations: clear axis difference
    case 2:
      return true; // Capital Challenge: any ratio
    case 3:
      return true; // Capital Precision: any ratio
    case 4:
      return ratio > 0.5; // Global Capitals: clear ratio
    case 5:
      return ratio >= 0.05 && ratio <= 0.5; // Capital Extremes: close ratio
    case 6:
      return ratio > 0.75; // Major Cities WW: clear ratio
    case 7:
      return true; // City Expert: any ratio
    case 8:
      return ratio >= 0.01 && ratio <= 0.2; // Geographic Precision: very close
    case 9:
      return ratio < 0.01; // The Challenge: extreme alignment
    case 10:
      return true; // Random Extreme: any ratio
    default:
      return true;
  }
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
 * Generate 10 questions: 8 from current tier + 2 preview from next tier (if not tier 10)
 */
export async function generateQuestions(cities: City[], difficultyLevel: DifficultyLevel = 1): Promise<Question[]> {
  const questions: Question[] = [];
  const selectedCities = cities.slice(0, 100);
  const shuffledCities = shuffleArray([...selectedCities]);

  // Determine how many questions from current tier vs next tier
  const isMaxTier = difficultyLevel === 10;
  const questionsFromCurrentTier = isMaxTier ? 10 : 8;
  const questionsFromNextTier = isMaxTier ? 0 : 2;

  // Generate questions from current tier
  for (let i = 0; i < questionsFromCurrentTier; i++) {
    const question = generateSingleQuestion(shuffledCities, difficultyLevel);
    if (question) {
      questions.push(question);
    }
  }

  // Generate preview questions from next tier (if applicable)
  if (!isMaxTier && questionsFromNextTier > 0) {
    const nextTier = (difficultyLevel + 1) as DifficultyLevel;
    const nextTierCities = await getCitiesByDifficulty(nextTier);
    const shuffledNextCities = shuffleArray([...nextTierCities]);

    for (let i = 0; i < questionsFromNextTier; i++) {
      const question = generateSingleQuestion(shuffledNextCities, nextTier);
      if (question) {
        questions.push(question);
      }
    }
  }

  while (questions.length < 10) {
    const question = generateSingleQuestion(shuffledCities, difficultyLevel, false);
    if (!question) break;
    questions.push(question);
  }

  // Shuffle final question order to mix current and preview questions
  return shuffleArray(questions);
}

/**
 * Generate a single question with proper ratio validation
 */
function generateSingleQuestion(
  cities: City[],
  tier: DifficultyLevel,
  enforceRatio = true
): Question | null {
  let city1: City | null = null;
  let city2: City | null = null;
  let isValidPair = false;
  let attempts = 0;
  const maxAttempts = 100;

  while (!isValidPair && attempts < maxAttempts && cities.length >= 2) {
    attempts++;

    const indices = getRandomPair(cities.length);
    city1 = cities[indices[0]];
    city2 = cities[indices[1]];

    // Calculate distance ratio
    const latDiff = Math.abs(city1.latitude - city2.latitude);
    let lonDiff = city1.longitude - city2.longitude;
    if (lonDiff > 180) {
      lonDiff -= 360;
    } else if (lonDiff < -180) {
      lonDiff += 360;
    }
    const lonDiffAbs = Math.abs(lonDiff);
    const ratio = getDistanceRatio(latDiff, lonDiffAbs);

    // Check if ratio matches tier requirements
    if (!enforceRatio || isValidRatioForTier(ratio, tier)) {
      isValidPair = true;
    }
  }

  if (!city1 || !city2 || !isValidPair) {
    return null;
  }

  // Calculate distances for question
  const latDiff = Math.abs(city1.latitude - city2.latitude);
  let lonDiff = city1.longitude - city2.longitude;
  if (lonDiff > 180) {
    lonDiff -= 360;
  } else if (lonDiff < -180) {
    lonDiff += 360;
  }
  const lonDiffAbs = Math.abs(lonDiff);

  // Choose question type based on which difference is smaller
  const isLatitudinal = latDiff < lonDiffAbs;

  let questionText: string;
  let correctAnswer: 'North' | 'South' | 'East' | 'West';

  const country1Name = city1.countries?.name || city1.country;
  const country2Name = city2.countries?.name || city2.country;
  const formattedCity1Name = formatCityName(city1.name, city1.country_code);
  const formattedCity2Name = formatCityName(city2.name, city2.country_code);

  let questionTextParts: QuestionTextPart[] = [];

  if (isLatitudinal) {
    questionText = `Is ${formattedCity1Name}, ${country1Name} north or south of ${formattedCity2Name}, ${country2Name}?`;
    correctAnswer = city1.latitude > city2.latitude ? 'North' : 'South';
    questionTextParts = [
      { type: 'text', content: 'Is ' },
      { type: 'city', cityName: formattedCity1Name, countryName: country1Name },
      { type: 'text', content: ' north or south of ' },
      { type: 'city', cityName: formattedCity2Name, countryName: country2Name },
      { type: 'text', content: '?' }
    ];
  } else {
    questionText = `Is ${formattedCity1Name}, ${country1Name} east or west of ${formattedCity2Name}, ${country2Name}?`;
    correctAnswer = lonDiff > 0 ? 'East' : 'West';
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

function getRandomPair(length: number): [number, number] {
  const index1 = Math.floor(Math.random() * length);
  let index2 = Math.floor(Math.random() * length);

  while (index2 === index1) {
    index2 = Math.floor(Math.random() * length);
  }

  return [index1, index2];
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
