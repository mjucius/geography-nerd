import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Navigation } from '../Navigation';

describe('Navigation', () => {
  it('has no "Atlas mode" label', () => {
    render(<Navigation />);
    expect(screen.queryByText(/Atlas mode/i)).not.toBeInTheDocument();
  });

  it('goes home when the logo button is clicked', async () => {
    const onHomeClick = vi.fn();
    render(<Navigation onHomeClick={onHomeClick} />);
    await userEvent.setup().click(screen.getByRole('button', { name: /home/i }));
    expect(onHomeClick).toHaveBeenCalledOnce();
  });
});
