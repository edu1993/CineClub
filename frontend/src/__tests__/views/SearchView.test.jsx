import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import SearchView from '../../components/SearchView';

describe('SearchView', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubEnv('VITE_API_URL', 'http://localhost:3001');
  });

  it('shows a loading indicator while the request is pending', async () => {
    let resolveRequest;
    const pendingPromise = new Promise((resolve) => {
      resolveRequest = resolve;
    });

    vi.stubGlobal('fetch', vi.fn(() => pendingPromise));

    const user = userEvent.setup();
    render(<SearchView />);

    await user.type(screen.getByPlaceholderText(/search movies/i), 'inception');
    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    resolveRequest({ ok: true, json: async () => ({ results: [] }) });
    await waitFor(() => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument());
  });

  it('renders an error message when the server fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }));

    const user = userEvent.setup();
    render(<SearchView />);

    await user.type(screen.getByPlaceholderText(/search movies/i), 'inception');
    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  it('renders the movie grid when the request succeeds', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        results: [
          {
            id: 1,
            title: 'Inception',
            release_date: '2010-07-16',
            poster_path: '/inception.jpg',
            avgScore: 4.5,
          },
        ],
      }),
    }));

    const user = userEvent.setup();
    render(<SearchView />);

    await user.type(screen.getByPlaceholderText(/search movies/i), 'inception');
    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(await screen.findByText('Inception')).toBeInTheDocument();
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    expect(screen.getByLabelText(/movie grid/i)).toBeInTheDocument();
  });
});
