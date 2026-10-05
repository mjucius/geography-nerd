import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ScoreScreen } from '../ScoreScreen';
import { question } from '../../test-fixtures';
import type { UserAnswer } from '../../types';

const answers: UserAnswer[] = Array.from({ length: 10 }, (_, i) => ({
  questionIndex: i,
  city1Id: 1,
  city2Id: 2,
  questionText: `Question text ${i + 1}`,
  userAnswer: i < 7 ? 'North' : 'South',
  correctAnswer: 'North',
  isCorrect: i < 7,
}));
const questions = answers.map(() => question);

const renderScreen = (props: Partial<React.ComponentProps<typeof ScoreScreen>> = {}) =>
  render(
    <ScoreScreen score={7} totalQuestions={10} answers={answers} questions={questions} difficultyLevel={3} {...props} />
  );

describe('ScoreScreen', () => {
  it('shows the score and ten collapsed rows, with the correct answer only for misses', () => {
    const { container } = renderScreen();

    expect(screen.getByText('7')).toBeInTheDocument();
    expect(container.querySelectorAll('details')).toHaveLength(10);
    expect(container.querySelectorAll('details[open]')).toHaveLength(0);
    expect(container.querySelector('.leaflet-container')).toBeNull();
    expect(container).not.toHaveTextContent(' km');
    expect(screen.getAllByText(/Correct:/)).toHaveLength(3);
  });

  it('opens a row to show distance (km and miles, no degrees) and the map, and unmounts the map on close', async () => {
    const user = userEvent.setup();
    const { container } = renderScreen();

    await user.click(screen.getByText(/Question text 1$/));
    await waitFor(() => expect(container.querySelector('.leaflet-container')).not.toBeNull());
    expect(container).toHaveTextContent('km /');
    expect(container).toHaveTextContent('mi');
    expect(container).not.toHaveTextContent('°');
    expect(container.querySelectorAll('.leaflet-container')).toHaveLength(1);

    await user.click(screen.getByText(/Question text 1$/));
    await waitFor(() => expect(container.querySelector('.leaflet-container')).toBeNull());
  });

  it('offers the right level actions', async () => {
    const onStartLevel = vi.fn();
    const user = userEvent.setup();
    const { unmount } = renderScreen({ nextLevelAvailable: true, score: 9, onStartLevel });
    await user.click(screen.getByRole('button', { name: 'Try Level 4' }));
    await user.click(screen.getByRole('button', { name: 'Stay at Level 3' }));
    expect(onStartLevel).toHaveBeenNthCalledWith(1, 4);
    expect(onStartLevel).toHaveBeenNthCalledWith(2, 3);
    unmount();

    onStartLevel.mockClear();
    renderScreen({ difficultyLevel: 10, onStartLevel });
    await user.click(screen.getByRole('button', { name: 'Go to Level 9' }));
    expect(onStartLevel).toHaveBeenCalledWith(9);
  });

  it('goes home from the Back to Home button', async () => {
    const onRetakeHome = vi.fn();
    renderScreen({ onRetakeHome });
    await userEvent.setup().click(screen.getByRole('button', { name: 'Back to Home' }));
    expect(onRetakeHome).toHaveBeenCalledOnce();
  });
});
