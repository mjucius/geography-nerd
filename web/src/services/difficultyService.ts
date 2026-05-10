import type { DifficultyLevel } from '../types';

export function determineNextLevel(score: number, currentLevel: DifficultyLevel): DifficultyLevel {
  if (score >= 8 && currentLevel < 10) {
    return (currentLevel + 1) as DifficultyLevel;
  }

  return currentLevel;
}
