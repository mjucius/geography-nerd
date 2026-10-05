import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QuestionCard } from '../QuestionCard';
import { longitudinalQuestion, question, sameLongitudeQuestion } from '../../test-fixtures';

describe('QuestionCard', () => {
  it('shows progress once, as text plus a progress bar', () => {
    const { container } = render(
      <QuestionCard question={question} questionNumber={3} totalQuestions={10} onAnswer={() => {}} />
    );

    expect(screen.getAllByText(/3 of 10/)).toHaveLength(1);
    expect(container).not.toHaveTextContent('%');
    expect(container).not.toHaveTextContent('3/10');
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '3');
  });

  it('passes the chosen answer to onAnswer', async () => {
    const onAnswer = vi.fn();
    render(<QuestionCard question={question} questionNumber={1} totalQuestions={10} onAnswer={onAnswer} />);

    await userEvent.setup().click(screen.getByRole('button', { name: /South/ }));
    expect(onAnswer).toHaveBeenCalledWith('South');
  });

  it('disables the options once answered', () => {
    render(
      <QuestionCard
        question={question}
        questionNumber={1}
        totalQuestions={10}
        onAnswer={() => {}}
        lastAnswer={{
          questionIndex: 0, city1Id: 1, city2Id: 2, questionText: '', userAnswer: 'North', correctAnswer: 'North', isCorrect: true,
        }}
      />
    );
    expect(screen.getByRole('button', { name: /South/ })).toBeDisabled();
  });

  describe('after answering', () => {
    const answered = {
      questionIndex: 0, city1Id: 1, city2Id: 2, questionText: '', userAnswer: 'South', correctAnswer: 'North', isCorrect: false,
    };

    it('shows the result and distances in km and miles, with no degrees', () => {
      const { container } = render(
        <QuestionCard question={question} questionNumber={1} totalQuestions={10} onAnswer={() => {}} lastAnswer={answered} onNext={() => {}} />
      );
      expect(screen.getByText('Incorrect')).toBeInTheDocument();
      expect(screen.getByText(/North by 7,742 km \/ 4,811 mi/)).toBeInTheDocument();
      expect(container).not.toHaveTextContent('°');
    });

    it('scales the east-west distance by latitude', () => {
      render(
        <QuestionCard question={longitudinalQuestion} questionNumber={1} totalQuestions={10} onAnswer={() => {}} lastAnswer={answered} onNext={() => {}} />
      );
      expect(screen.getByText('West by 1,592 km / 989 mi')).toBeInTheDocument();
    });

    it('says Same longitude instead of a zero distance', () => {
      const { container } = render(
        <QuestionCard question={sameLongitudeQuestion} questionNumber={1} totalQuestions={10} onAnswer={() => {}} lastAnswer={answered} onNext={() => {}} />
      );
      expect(screen.getByText('Same longitude')).toBeInTheDocument();
      expect(container).not.toHaveTextContent('by 0 km');
    });

    it('advances only from the Next button, not from clicking the panel', async () => {
      const onNext = vi.fn();
      const user = userEvent.setup();
      render(
        <QuestionCard question={question} questionNumber={1} totalQuestions={10} onAnswer={() => {}} lastAnswer={answered} onNext={onNext} />
      );

      await user.click(screen.getByText('Incorrect'));
      await user.click(screen.getByText(/Your answer/));
      expect(onNext).not.toHaveBeenCalled();

      await user.click(screen.getByRole('button', { name: /Next Question/ }));
      expect(onNext).toHaveBeenCalledOnce();
    });

    it('completes the quiz only from the Complete Quiz button', async () => {
      const onSubmit = vi.fn();
      const user = userEvent.setup();
      render(
        <QuestionCard question={question} questionNumber={10} totalQuestions={10} onAnswer={() => {}} lastAnswer={answered} isLastQuestion onSubmit={onSubmit} />
      );

      await user.click(screen.getByText('Incorrect'));
      expect(onSubmit).not.toHaveBeenCalled();
      await user.click(screen.getByRole('button', { name: /Complete Quiz/ }));
      expect(onSubmit).toHaveBeenCalledOnce();
    });
  });
});
