import { supabase } from './supabaseClient';
import type { UserAnswer, DifficultyLevel } from '../types';

/**
 * Update city pair difficulty statistics after quiz completion
 */
export async function updateCityPairStats(answers: UserAnswer[], difficultyLevel: DifficultyLevel): Promise<void> {
  for (const answer of answers) {
    const { data: existing } = await supabase
      .from('city_pair_difficulty')
      .select('id, correct_count, incorrect_count')
      .eq('city_1_id', answer.city1Id)
      .eq('city_2_id', answer.city2Id)
      .eq('difficulty_level', difficultyLevel)
      .maybeSingle();

    if (existing) {
      // Update existing record - increment the appropriate counter
      const newCorrectCount = existing.correct_count + (answer.isCorrect ? 1 : 0);
      const newIncorrectCount = existing.incorrect_count + (answer.isCorrect ? 0 : 1);

      await supabase
        .from('city_pair_difficulty')
        .update({
          correct_count: newCorrectCount,
          incorrect_count: newIncorrectCount,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id);
    } else {
      // Create new record
      await supabase
        .from('city_pair_difficulty')
        .insert({
          city_1_id: answer.city1Id,
          city_2_id: answer.city2Id,
          difficulty_level: difficultyLevel,
          correct_count: answer.isCorrect ? 1 : 0,
          incorrect_count: answer.isCorrect ? 0 : 1
        });
    }
  }
}

/**
 * Determine user's next difficulty level based on quiz score
 * Requires 8 or more correct answers out of 10 to advance
 */
export function determineNextLevel(score: number, currentLevel: DifficultyLevel): DifficultyLevel {
  // Need 8/10 or better to advance
  if (score >= 8) {
    // Advance to next level if not at max
    if (currentLevel < 10) {
      return (currentLevel + 1) as DifficultyLevel;
    }
    // Already at max level
    return 10;
  }
  // Stay at current level
  return currentLevel;
}

/**
 * Get user's starting difficulty level
 * Defaults to level 1
 */
export async function getUserStartingLevel(userId?: string): Promise<DifficultyLevel> {
  if (!userId) {
    return 1; // Anonymous users always start at level 1
  }

  // Get the user's last completed quiz
  const { data: lastQuiz } = await supabase
    .from('quiz_sessions')
    .select('difficulty_level, score')
    .eq('user_id', userId)
    .not('completed_at', 'is', null)
    .order('completed_at', { ascending: false })
    .limit(1)
    .single();

  if (!lastQuiz) {
    return 1; // New user, start at level 1
  }

  // If last quiz was at a lower level and score was >=8, they can start at next level
  if (lastQuiz.score >= 8) {
    return determineNextLevel(lastQuiz.score, lastQuiz.difficulty_level);
  }

  // Otherwise, start at their last level
  return lastQuiz.difficulty_level || 1;
}

/**
 * Get difficulty statistics for a city pair
 */
export async function getCityPairStats(city1Id: number, city2Id: number, difficultyLevel: DifficultyLevel) {
  const { data, error } = await supabase
    .from('city_pair_difficulty')
    .select('correct_count, incorrect_count')
    .eq('city_1_id', city1Id)
    .eq('city_2_id', city2Id)
    .eq('difficulty_level', difficultyLevel)
    .single();

  if (error) {
    return { correctCount: 0, incorrectCount: 0, totalAttempts: 0, accuracy: 0 };
  }

  if (!data) {
    return { correctCount: 0, incorrectCount: 0, totalAttempts: 0, accuracy: 0 };
  }

  const totalAttempts = data.correct_count + data.incorrect_count;
  const accuracy = totalAttempts === 0 ? 0 : (data.correct_count / totalAttempts) * 100;

  return {
    correctCount: data.correct_count,
    incorrectCount: data.incorrect_count,
    totalAttempts,
    accuracy
  };
}

/**
 * Get overall difficulty statistics for a level
 */
export async function getLevelStats(difficultyLevel: DifficultyLevel) {
  const { data } = await supabase
    .from('city_pair_difficulty')
    .select('correct_count, incorrect_count')
    .eq('difficulty_level', difficultyLevel);

  if (!data || data.length === 0) {
    return { averageAccuracy: 0, totalQuestions: 0 };
  }

  const totalCorrect = data.reduce((sum, d) => sum + d.correct_count, 0);
  const totalIncorrect = data.reduce((sum, d) => sum + d.incorrect_count, 0);
  const total = totalCorrect + totalIncorrect;
  const averageAccuracy = total === 0 ? 0 : (totalCorrect / total) * 100;

  return {
    averageAccuracy,
    totalQuestions: data.length,
    totalAttempts: total
  };
}
