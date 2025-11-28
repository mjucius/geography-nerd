import { useState, useCallback } from 'react';
import type { Question, UserAnswer } from '../types';
import {
  getCities,
  generateQuestions,
  createQuizSession,
  saveQuizResponse,
  completeQuizSession
} from '../services/quizService';

export function useQuiz() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const startQuiz = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Create quiz session
      const session = await createQuizSession();
      setSessionId(session.id);

      // Fetch cities and generate questions
      const cities = await getCities();
      const generatedQuestions = generateQuestions(cities);
      setQuestions(generatedQuestions);
      setCurrentQuestionIndex(0);
      setAnswers([]);
      setQuizCompleted(false);
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
    if (!sessionId) {
      setError('Quiz session not initialized');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Save all responses
      for (const answer of answers) {
        await saveQuizResponse({
          sessionId,
          city1Id: answer.city1Id,
          city2Id: answer.city2Id,
          questionText: answer.questionText,
          userAnswer: answer.userAnswer,
          correctAnswer: answer.correctAnswer,
          isCorrect: answer.isCorrect,
        });
      }

      // Calculate score and complete session
      const score = answers.filter(a => a.isCorrect).length;
      await completeQuizSession(sessionId, score);

      setQuizCompleted(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit quiz';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [sessionId, answers]);

  const getScore = useCallback(() => {
    return answers.filter(a => a.isCorrect).length;
  }, [answers]);

  return {
    questions,
    currentQuestionIndex,
    answers,
    sessionId,
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
