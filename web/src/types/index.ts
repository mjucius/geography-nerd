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

export interface Question {
  questionText: string;
  city1: City;
  city2: City;
  correctAnswer: 'North' | 'South' | 'East' | 'West';
  type: 'latitudinal' | 'longitudinal';
  options: string[];
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
