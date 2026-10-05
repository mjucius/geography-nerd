import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Footer } from '../Footer';

describe('AboutModal', () => {
  it('opens when the Credits button is clicked and lists each attribution', async () => {
    const user = userEvent.setup();
    render(<Footer />);

    await user.click(screen.getByRole('button', { name: /Credits/i }));

    expect(screen.getByText(/About Geography Nerd/i)).toBeVisible();
    expect(screen.getByText(/GeoNames/i)).toBeInTheDocument();
    expect(screen.getByText(/OpenStreetMap/i)).toBeInTheDocument();
    expect(screen.queryByText(/CARTO/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Leaflet/i)).toBeInTheDocument();
    expect(screen.getByText(/Nano Banana/i)).toBeInTheDocument();
  });

  it('links to the source, licence and privacy policy', async () => {
    const user = userEvent.setup();
    render(<Footer />);
    await user.click(screen.getByRole('button', { name: /Credits/i }));

    const dialog = within(screen.getByRole('dialog', { hidden: true }));
    expect(dialog.getByRole('link', { name: /Source code/i })).toHaveAttribute('href', 'https://github.com/mjucius/geography-nerd');
    expect(dialog.getByRole('link', { name: /MIT License/i })).toHaveAttribute('href', 'https://github.com/mjucius/geography-nerd/blob/main/LICENSE');
    expect(dialog.getByRole('link', { name: /Privacy/i })).toHaveAttribute('href', 'https://github.com/mjucius/geography-nerd/blob/main/PRIVACY.md');
  });

  it('closes when the close button is clicked', async () => {
    const user = userEvent.setup();
    render(<Footer />);

    await user.click(screen.getByRole('button', { name: /Credits/i }));
    expect(screen.getByText(/About Geography Nerd/i)).toBeVisible();

    await user.click(screen.getByRole('button', { name: /Close/i }));
    expect(screen.queryByText(/About Geography Nerd/i)).not.toBeVisible();
  });
});
