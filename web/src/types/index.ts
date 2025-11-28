export type DifficultyLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface TierInfo {
  level: DifficultyLevel;
  name: string;
  description: string;
  emoji: string;
  color: string;
}

export interface Country {
  code: string;
  name: string;
  region?: string;
  population?: number;
  area?: number;
}

export interface City {
  id: number;
  name: string;
  country: string;
  country_code?: string;
  countries?: Country;
  population: number;
  latitude: number;
  longitude: number;
  location: {
    type: string;
    coordinates: [number, number];
  };
}

export type QuestionTextPart =
  | { type: 'text'; content: string }
  | { type: 'city'; cityName: string; countryName: string };

export interface Question {
  questionText: string;
  questionTextParts: QuestionTextPart[];
  city1: City;
  city2: City;
  correctAnswer: 'North' | 'South' | 'East' | 'West';
  type: 'latitudinal' | 'longitudinal';
  options: string[];
  difficultyLevel: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
}

export interface UserAnswer {
  questionIndex: number;
  city1Id: number;
  city2Id: number;
  questionText: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

export interface QuizSession {
  id: number;
  userId: string;
  score: number;
  totalQuestions: number;
  questionType: string;
  difficultyLevel: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  startedAt: string;
  completedAt?: string;
  createdAt: string;
}

export interface QuizResponse {
  id: number;
  sessionId: number;
  city1Id: number;
  city2Id: number;
  questionText: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  answeredAt: string;
}
