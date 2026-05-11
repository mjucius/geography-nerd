import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from '../Footer';

describe('Footer', () => {
  it('renders the MIT License link to the repo LICENSE file', () => {
    render(<Footer />);
    const link = screen.getByRole('link', { name: /MIT License/i });
    expect(link).toHaveAttribute('href', 'https://github.com/mjucius/geography-nerd/blob/main/LICENSE');
  });

  it('renders the GitHub source link', () => {
    render(<Footer />);
    const link = screen.getByRole('link', { name: /Geography Nerd on GitHub/i });
    expect(link).toHaveAttribute('href', 'https://github.com/mjucius/geography-nerd');
  });

  it('renders a Credits button', () => {
    render(<Footer />);
    expect(screen.getByRole('button', { name: /Credits/i })).toBeInTheDocument();
  });

  it('opens links in a new tab with safe rel', () => {
    render(<Footer />);
    for (const link of screen.getAllByRole('link')) {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
    }
  });
});
