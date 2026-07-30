import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import MovieCard from './MovieCard';

describe('MovieCard', () => {
  it('renders the movie poster, title, year and average score', () => {
    const movie = {
      id: 1,
      title: 'Inception',
      release_date: '2010-07-16',
      poster_path: '/inception.jpg',
      avgScore: 4.5,
    };

    render(<MovieCard movie={movie} />);

    expect(screen.getByRole('img', { name: /inception/i })).toHaveAttribute('src', 'https://image.tmdb.org/t/p/w500/inception.jpg');
    expect(screen.getByText('Inception')).toBeInTheDocument();
    expect(screen.getByText('2010')).toBeInTheDocument();
    expect(screen.getByText('Avg score: 4.5')).toBeInTheDocument();
  });
});
