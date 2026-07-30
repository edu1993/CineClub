import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ReviewForm from '../../components/ReviewForm';

describe('ReviewForm', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('does not submit when fields are empty and shows a local error', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(<ReviewForm movieId={1} onSubmit={onSubmit} />);

    await user.click(screen.getByRole('button', { name: /submit review/i }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText(/all fields are required/i)).toBeInTheDocument();
  });

  it('submits the review data to the backend when the form is valid', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) });
    vi.stubGlobal('fetch', fetchMock);

    render(<ReviewForm movieId={7} onSubmit={vi.fn()} />);

    await user.type(screen.getByLabelText(/author/i), 'Ana');
    await user.selectOptions(screen.getByLabelText(/score/i), '5');
    await user.type(screen.getByLabelText(/comment/i), 'Great movie');
    await user.click(screen.getByRole('button', { name: /submit review/i }));

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3001/api/movies/7/reviews',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author: 'Ana', score: 5, comment: 'Great movie' }),
      }),
    );
  });

  it('shows the new review after a successful submit', async () => {
    const user = userEvent.setup();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) }));

    render(<ReviewForm movieId={2} onSubmit={vi.fn()} />);

    await user.type(screen.getByLabelText(/author/i), 'Luis');
    await user.selectOptions(screen.getByLabelText(/score/i), '4');
    await user.type(screen.getByLabelText(/comment/i), 'Loved it');
    await user.click(screen.getByRole('button', { name: /submit review/i }));

    expect(await screen.findByText(/review submitted/i)).toBeInTheDocument();
  });
});
