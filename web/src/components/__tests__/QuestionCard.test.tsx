import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QuestionCard } from '../QuestionCard';
import { question } from '../../test-fixtures';

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
});
