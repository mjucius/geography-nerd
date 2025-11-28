import { supabase } from './supabaseClient';
import type { City, Question, QuizSession, QuizResponse } from '../types';

export async function getCities(): Promise<City[]> {
  const { data, error } = await supabase
    .from('cities')
    .select('*, countries(code, name, region)')
    .order('population', { ascending: false })
    .limit(100);

  if (error) {
    throw new Error(`Failed to fetch cities: ${error.message}`);
  }

  return data || [];
}

export function generateQuestions(cities: City[]): Question[] {
  const questions: Question[] = [];
  const selectedCities = cities.slice(0, 100);

  // Separate cities by region
  const americasEuropeCities = selectedCities.filter(city => {
    const region = city.countries?.region?.toLowerCase() || '';
    return region.includes('america') || region.includes('europe');
  });

  // Shuffle both arrays to ensure random selection
  const shuffledAmericasEurope = shuffleArray([...americasEuropeCities]);
  const shuffledAllCities = shuffleArray([...selectedCities]);

  for (let i = 0; i < 10; i++) {
    let city1: City;
    let city2: City;

    // Ensure at least one city is from Americas or Europe
    if (shuffledAmericasEurope.length > 0) {
      // Pick city from Americas/Europe (cycle through shuffled array)
      city1 = shuffledAmericasEurope[i % shuffledAmericasEurope.length];

      // For the second city, pick from all cities (excluding city1)
      let city2Candidate: City;
      do {
        // Pick from shuffled array with offset to avoid repeating the same pair
        const offset = Math.floor(Math.random() * shuffledAllCities.length);
        city2Candidate = shuffledAllCities[(offset + i) % shuffledAllCities.length];
      } while (city2Candidate.id === city1.id);

      city2 = city2Candidate;
    } else {
      // Fallback to random pair if no Americas/Europe cities available
      const indices = getRandomPair(selectedCities.length);
      city1 = selectedCities[indices[0]];
      city2 = selectedCities[indices[1]];
    }

    // Calculate both latitude and longitude differences
    const latDiff = Math.abs(city1.latitude - city2.latitude);

    // Calculate shortest longitude difference (accounting for wrap-around)
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

    if (isLatitudinal) {
      questionText = `Is ${city1.name}, ${country1Name} north or south of ${city2.name}, ${country2Name}?`;
      correctAnswer = city1.latitude > city2.latitude ? 'North' : 'South';
    } else {
      questionText = `Is ${city1.name}, ${country1Name} east or west of ${city2.name}, ${country2Name}?`;
      // Positive means city1 is east of city2, negative means west
      correctAnswer = lonDiff > 0 ? 'East' : 'West';
    }

    questions.push({
      questionText,
      city1,
      city2,
      correctAnswer,
      type: isLatitudinal ? 'latitudinal' : 'longitudinal',
      options: isLatitudinal ? ['North', 'South'] : ['East', 'West']
    });
  }

  return questions;
}

export async function createQuizSession(): Promise<QuizSession> {
  const { data, error } = await supabase
    .from('quiz_sessions')
    .insert({
      question_type: 'direction',
      score: 0,
      total_questions: 10
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create quiz session: ${error.message}`);
  }

  return data;
}

export async function saveQuizResponse(response: Omit<QuizResponse, 'id' | 'answeredAt'>): Promise<void> {
  const { error } = await supabase
    .from('quiz_responses')
    .insert({
      session_id: response.sessionId,
      city_1_id: response.city1Id,
      city_2_id: response.city2Id,
      question_text: response.questionText,
      user_answer: response.userAnswer,
      correct_answer: response.correctAnswer,
      is_correct: response.isCorrect
    });

  if (error) {
    throw new Error(`Failed to save quiz response: ${error.message}`);
  }
}

export async function completeQuizSession(sessionId: number, score: number): Promise<void> {
  const { error } = await supabase
    .from('quiz_sessions')
    .update({
      score,
      completed_at: new Date().toISOString()
    })
    .eq('id', sessionId);

  if (error) {
    throw new Error(`Failed to complete quiz session: ${error.message}`);
  }
}

function getRandomPair(length: number): [number, number] {
  let index1 = Math.floor(Math.random() * length);
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
