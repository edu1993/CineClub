import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { reviews } from '../src/reviews.js';

describe('Reviews API', () => {
  beforeEach(() => {
    reviews.length = 0;
  });

  it('crea una reseña y devuelve 201', async () => {
    const payload = { author: 'Ana', score: 4, comment: 'Muy entretenida' };

    const response = await request(app)
      .post('/api/movies/123/reviews')
      .send(payload);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      tmdbId: '123',
      author: 'Ana',
      score: 4,
      comment: 'Muy entretenida',
    });
    expect(response.body.id).toBeDefined();
    expect(reviews).toHaveLength(1);
  });

  it('devuelve 400 si falta el author', async () => {
    const response = await request(app)
      .post('/api/movies/123/reviews')
      .send({ score: 5, comment: 'Excelente' });

    expect(response.status).toBe(400);
  });

  it('devuelve 400 si falta el comment', async () => {
    const response = await request(app)
      .post('/api/movies/123/reviews')
      .send({ author: 'Ana', score: 5 });

    expect(response.status).toBe(400);
  });

  it('devuelve 400 si falta el score', async () => {
    const response = await request(app)
      .post('/api/movies/123/reviews')
      .send({ author: 'Ana', comment: 'Genial' });

    expect(response.status).toBe(400);
  });

  it('devuelve 400 si score es menor a 1', async () => {
    const response = await request(app)
      .post('/api/movies/123/reviews')
      .send({ author: 'Ana', score: 0, comment: 'Mal' });

    expect(response.status).toBe(400);
  });

  it('devuelve 400 si score es mayor a 5', async () => {
    const response = await request(app)
      .post('/api/movies/123/reviews')
      .send({ author: 'Ana', score: 6, comment: 'Demasiado' });

    expect(response.status).toBe(400);
  });

  it('devuelve 400 si score no es un número', async () => {
    const response = await request(app)
      .post('/api/movies/123/reviews')
      .send({ author: 'Ana', score: '5', comment: 'Texto inválido' });

    expect(response.status).toBe(400);
  });

  it('elimina una reseña existente y devuelve 204', async () => {
    reviews.push({
      id: 'review-123',
      tmdbId: '123',
      author: 'Luis',
      score: 5,
      comment: 'Perfecta',
    });

    const response = await request(app).delete('/api/reviews/review-123');

    expect([200, 204]).toContain(response.status);
    expect(reviews).toHaveLength(0);
  });

  it('devuelve 404 si intenta eliminar una reseña inexistente', async () => {
    const response = await request(app).delete('/api/reviews/no-existe');

    expect(response.status).toBe(404);
  });
});
