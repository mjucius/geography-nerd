import { useState, useCallback } from 'react';
import type { Question, UserAnswer, DifficultyLevel } from '../types';
import {
  getCitiesByDifficulty,
  generateQuestions,
  createQuizSession,
  saveQuizResponse,
  completeQuizSession,
} from '../services/quizService';
import {
  getUserStartingLevel,
  determineNextLevel,
  updateCityPairStats,
} from '../services/difficultyService';
import { updateUserProgress } from '../services/userProgressService';
import { storeOrphanedSessionId } from '../services/sessionService';
import { useAuth } from './useAuth';

export function useQuiz() {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [sessionId, setSessionId] = useState<number | null>(null);
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
      const startingLevel = level || (await getUserStartingLevel(user?.id));
      setDifficultyLevel(startingLevel);

      // Create quiz session
      const session = await createQuizSession(startingLevel);
      setSessionId(session.id);

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
  }, [user]);

  const answerQuestion = useCallback((answer: string) => {
    if (currentQuestionIndex >= questions.length || !sessionId) {
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

    // Save response and update stats in the background without blocking UI (fire-and-forget)
    saveQuizResponse({
      sessionId,
      city1Id: newAnswer.city1Id,
      city2Id: newAnswer.city2Id,
      questionText: newAnswer.questionText,
      userAnswer: newAnswer.userAnswer,
      correctAnswer: newAnswer.correctAnswer,
      isCorrect: newAnswer.isCorrect,
    }).catch(() => {
      // Silently ignore save errors - answers are kept in memory
    });

    // Update city pair difficulty statistics
    updateCityPairStats([newAnswer], difficultyLevel).catch(() => {
      // Silently ignore stats update errors
    });
  }, [currentQuestionIndex, questions, answers, sessionId, difficultyLevel]);

  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  }, [currentQuestionIndex, questions]);

  const submitQuiz = useCallback(async () => {
    if (!sessionId) {
      setError('Quiz session not initialized');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Calculate score and complete session
      const score = answers.filter(a => a.isCorrect).length;
      await completeQuizSession(sessionId, score);

      // Check if user qualifies for next level
      const nextLevel = determineNextLevel(score, difficultyLevel);
      if (nextLevel > difficultyLevel) {
        setNextLevelAvailable(true);
      }

      // Update user progress if logged in, otherwise store session for later association
      if (user?.id) {
        updateUserProgress(user.id, score, nextLevel).catch(() => {
          // Silently ignore progress update errors
        });
      } else {
        // Store session ID for later association when user signs up
        storeOrphanedSessionId(sessionId);
      }

      setQuizCompleted(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit quiz';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [sessionId, answers, difficultyLevel, user]);

  const getScore = useCallback(() => {
    return answers.filter(a => a.isCorrect).length;
  }, [answers]);

  return {
    questions,
    currentQuestionIndex,
    answers,
    sessionId,
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
