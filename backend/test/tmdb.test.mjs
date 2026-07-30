import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { reviews } from '../src/reviews.js';

vi.mock('../src/fetchClient.js', () => ({
  fetch: vi.fn(),
}));

let fetchMock;

describe('TMDB proxy', () => {
  beforeEach(async () => {
    reviews.length = 0;
    const fetchClient = await import('../src/fetchClient.js');
    fetchMock = fetchClient.fetch;
    fetchMock.mockReset();
    process.env.TMDB_API_KEY = 'test-key';
  });

  it('busca películas en TMDB y devuelve 200 con los resultados', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [{ id: 1, title: 'Inception' }] }),
    });

    const response = await request(app).get('/api/movies/search?q=Inception');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ results: [{ id: 1, title: 'Inception' }] });
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.themoviedb.org/3/search/movie?api_key=test-key&query=Inception'
    );
  });

  it('devuelve 400 si falta el parámetro q en la búsqueda', async () => {
    const response = await request(app).get('/api/movies/search');

    expect(response.status).toBe(400);
  });

  it('devuelve 404 si TMDB no encuentra la película', async () => {
    fetchMock.mockResolvedValueOnce({
      status: 404,
      ok: false,
      text: async () => 'Not found',
    });

    const response = await request(app).get('/api/movies/123');

    expect(response.status).toBe(404);
  });

  it('devuelve datos de película, reseñas y avgScore cuando existe en TMDB', async () => {
    fetchMock.mockResolvedValueOnce({
      status: 200,
      ok: true,
      json: async () => ({ id: 123, title: 'Inception', overview: 'Sueño' }),
    });

    reviews.push({
      id: 'r1',
      tmdbId: '123',
      author: 'Ana',
      score: 4,
      comment: 'Muy buena',
    });
    reviews.push({
      id: 'r2',
      tmdbId: '123',
      author: 'Luis',
      score: 5,
      comment: 'Excelente',
    });

    const response = await request(app).get('/api/movies/123');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: 123,
      title: 'Inception',
      overview: 'Sueño',
      reviews: [
        expect.objectContaining({ id: 'r1', author: 'Ana', score: 4, comment: 'Muy buena' }),
        expect.objectContaining({ id: 'r2', author: 'Luis', score: 5, comment: 'Excelente' }),
      ],
      avgScore: 4.5,
    });
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.themoviedb.org/3/movie/123?api_key=test-key'
    );
  });
});
