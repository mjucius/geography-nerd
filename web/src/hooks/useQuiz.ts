import { useState, useCallback } from 'react';
import type { Question, UserAnswer, DifficultyLevel } from '../types';
import {
  generateQuestions,
} from '../services/quizService';
import { getCitiesByDifficulty } from '../services/cityDataService';
import { determineNextLevel } from '../services/difficultyService';

export function useQuiz() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [difficultyLevel, setDifficultyLevel] = useState<DifficultyLevel>(1);
  const [nextLevelAvailable, setNextLevelAvailable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const startQuiz = useCallback(async (level?: DifficultyLevel) => {
    try {
      setLoading(true);
      setError(null);

      // Determine difficulty level
      const startingLevel = level || 1;
      setDifficultyLevel(startingLevel);

      // Fetch cities filtered by difficulty level and generate questions
      const cities = await getCitiesByDifficulty(startingLevel);
      const generatedQuestions = await generateQuestions(cities, startingLevel);
      setQuestions(generatedQuestions);
      setCurrentQuestionIndex(0);
      setAnswers([]);
      setQuizCompleted(false);
      setNextLevelAvailable(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to start quiz';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const answerQuestion = useCallback((answer: string) => {
    if (currentQuestionIndex >= questions.length) {
      return;
    }

    const question = questions[currentQuestionIndex];
    const isCorrect = answer === question.correctAnswer;

    const newAnswer: UserAnswer = {
      questionIndex: currentQuestionIndex,
      city1Id: question.city1.id,
      city2Id: question.city2.id,
      questionText: question.questionText,
      userAnswer: answer,
      correctAnswer: question.correctAnswer,
      isCorrect,
    };

    setAnswers([...answers, newAnswer]);
  }, [currentQuestionIndex, questions, answers]);

  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  }, [currentQuestionIndex, questions]);

  const submitQuiz = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Calculate score and expose level choice for the next in-memory quiz.
      const score = answers.filter(a => a.isCorrect).length;
      const nextLevel = determineNextLevel(score, difficultyLevel);
      if (nextLevel > difficultyLevel) {
        setNextLevelAvailable(true);
      }

      setQuizCompleted(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit quiz';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [answers, difficultyLevel]);

  const getScore = useCallback(() => {
    return answers.filter(a => a.isCorrect).length;
  }, [answers]);

  return {
    questions,
    currentQuestionIndex,
    answers,
    difficultyLevel,
    nextLevelAvailable,
    loading,
    error,
    quizCompleted,
    startQuiz,
    answerQuestion,
    nextQuestion,
    submitQuiz,
    getScore,
  };
}
