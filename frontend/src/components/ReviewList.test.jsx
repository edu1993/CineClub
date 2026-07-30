import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ReviewList from './ReviewList';

describe('ReviewList', () => {
  it('renders each review author, score and comment', () => {
    const reviews = [
      { id: 1, author: 'Ana', score: 5, comment: 'Excellent movie' },
      { id: 2, author: 'Luis', score: 3, comment: 'Good enough' },
    ];

    render(<ReviewList reviews={reviews} />);

    expect(screen.getByText('Ana')).toBeInTheDocument();
    expect(screen.getByText('5/5')).toBeInTheDocument();
    expect(screen.getByText('Excellent movie')).toBeInTheDocument();

    expect(screen.getByText('Luis')).toBeInTheDocument();
    expect(screen.getByText('3/5')).toBeInTheDocument();
    expect(screen.getByText('Good enough')).toBeInTheDocument();
  });
});
