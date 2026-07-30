import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import SearchView from './SearchView';

describe('SearchView detail navigation', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubEnv('VITE_API_URL', 'http://localhost:3001');
  });

  it('switches to the detail view and fetches movie details when a card is clicked', async () => {
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ results: [{ id: 1, title: 'Inception', release_date: '2010-07-16', poster_path: '/inception.jpg', avgScore: 4.5 }] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 1,
          title: 'Inception',
          overview: 'A mind-bending thriller',
          release_date: '2010-07-16',
          poster_path: '/inception.jpg',
          reviews: [{ id: 1, author: 'Ana', score: 5, comment: 'Excellent movie' }],
        }),
      }));

    const user = userEvent.setup();
    render(<SearchView />);

    await user.type(screen.getByPlaceholderText(/search movies/i), 'inception');
    await user.click(screen.getByRole('button', { name: /search/i }));

    const card = await screen.findByRole('button', { name: /inception/i });
    await user.click(card);

    expect(await screen.findByText('A mind-bending thriller')).toBeInTheDocument();
    expect(screen.getByText('Ana')).toBeInTheDocument();
    expect(screen.getByText('Excellent movie')).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/movies/1');
  });
});
