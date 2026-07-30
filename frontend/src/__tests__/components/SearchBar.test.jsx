import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import SearchBar from '../../components/SearchBar';

describe('SearchBar', () => {
  it('renders the input and search button', () => {
    render(<SearchBar onSearch={vi.fn()} />);

    expect(screen.getByPlaceholderText(/search movies/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('calls onSearch only when the button is clicked', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();

    render(<SearchBar onSearch={onSearch} />);

    const input = screen.getByPlaceholderText(/search movies/i);
    const button = screen.getByRole('button', { name: /search/i });

    await user.type(input, 'inception');
    expect(onSearch).not.toHaveBeenCalled();

    await user.click(button);
    expect(onSearch).toHaveBeenCalledWith('inception');
  });
});
