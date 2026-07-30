import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import MovieGrid from './MovieGrid';

describe('MovieGrid', () => {
  it('renders a list of movie cards with the provided movies', () => {
    const movies = [
      {
        id: 1,
        title: 'Inception',
        release_date: '2010-07-16',
        poster_path: '/inception.jpg',
        avgScore: 4.5,
      },
      {
        id: 2,
        title: 'Interstellar',
        release_date: '2014-11-07',
        poster_path: '/interstellar.jpg',
        avgScore: 4.2,
      },
    ];

    render(<MovieGrid movies={movies} />);

    expect(screen.getByText('Inception')).toBeInTheDocument();
    expect(screen.getByText('Interstellar')).toBeInTheDocument();
    expect(screen.getAllByRole('img')).toHaveLength(2);
  });
});
