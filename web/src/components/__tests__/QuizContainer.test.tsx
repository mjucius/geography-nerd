import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { QuizContainer } from '../QuizContainer';
import { question } from '../../test-fixtures';

const quiz = vi.hoisted(() => ({ index: 0 }));

vi.mock('../../hooks/useQuiz', () => ({
  useQuiz: () => ({
    questions: [question, question],
    currentQuestionIndex: quiz.index,
    answers: [],
    difficultyLevel: 1,
    nextLevelAvailable: false,
    loading: false,
    error: null,
    quizCompleted: false,
    startQuiz: vi.fn(),
    answerQuestion: vi.fn(),
    nextQuestion: vi.fn(),
    submitQuiz: vi.fn(),
    getScore: () => 0,
  }),
}));

describe('QuizContainer', () => {
  it('scrolls to the top on open and when the question changes', () => {
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    quiz.index = 0;
    const { rerender } = render(<QuizContainer />);
    expect(scrollTo).toHaveBeenCalledTimes(1);
    expect(scrollTo).toHaveBeenLastCalledWith(0, 0);

    quiz.index = 1;
    rerender(<QuizContainer />);
    expect(scrollTo).toHaveBeenCalledTimes(2);
    scrollTo.mockRestore();
  });
});
