import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Home } from '../Home';

describe('Home', () => {
  it('shows the headline and a Start Quiz button that starts the quiz', async () => {
    const onStartQuiz = vi.fn();
    render(<Home onStartQuiz={onStartQuiz} />);

    expect(screen.getByRole('heading', { name: /Read the map without seeing the map/i })).toBeInTheDocument();
    await userEvent.setup().click(screen.getByRole('button', { name: /Start Quiz/i }));
    expect(onStartQuiz).toHaveBeenCalledOnce();
  });

  it('has no meaningless labels or sample mock-up', () => {
    render(<Home onStartQuiz={() => {}} />);
    expect(screen.queryByText(/Atlas mode/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/World direction challenge/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Sample route/i)).not.toBeInTheDocument();
  });
});
