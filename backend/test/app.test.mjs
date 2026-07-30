// Archivo de pruebas para el backend de CineClub.
// Contiene pruebas de integración para la aplicación Express completa.

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock de fetch para controlar las llamadas externas a TMDB.
vi.mock('../src/fetchClient.js', () => ({
  fetch: vi.fn(),
}));

import request from 'supertest';
import app from '../src/app.js';
import { reviews } from '../src/reviews.js';

let fetchMock;

describe('CineClub backend', () => {
  // Antes de cada prueba, vaciar el array de reseñas en memoria
  // para que las pruebas sean independientes unas de otras.
  beforeEach(async () => {
    reviews.length = 0;
    const fetchClient = await import('../src/fetchClient.js');
    fetchMock = fetchClient.fetch;
    fetchMock.mockReset();
    process.env.TMDB_API_KEY = 'test-key';
  });

  it('responde con status 200 en GET /', async () => {
    // Petición a la ruta base para verificar que el servidor está vivo.
    const response = await request(app).get('/');

    // Se espera un status 200 y una respuesta JSON con la propiedad status.
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  it('busca películas en TMDB y devuelve 200 con los resultados', async () => {
    // Simular la respuesta de TMDB para la búsqueda de Inception.
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [{ id: 1, title: 'Inception' }] }),
    });

    const response = await request(app).get('/api/movies/search?q=Inception');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ results: [{ id: 1, title: 'Inception' }] });

    // Verificar que se llamó a la URL correcta de TMDB con la API Key.
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.themoviedb.org/3/search/movie?api_key=test-key&query=Inception'
    );
  });

  it('devuelve 400 si falta el parámetro q en la búsqueda', async () => {
    const response = await request(app).get('/api/movies/search');

    expect(response.status).toBe(400);
  });

  it('crea una reseña y devuelve 201', async () => {
    // Datos de ejemplo para crear una nueva reseña.
    const payload = {
      author: 'Ana',
      score: 4,
      comment: 'Muy entretenida',
    };

    // Enviar petición POST a la ruta de creación de reseñas.
    const response = await request(app)
      .post('/api/movies/123/reviews')
      .send(payload);

    // Validar que la respuesta tiene código 201 Created.
    expect(response.status).toBe(201);

    // Verificar que la respuesta incluye los datos enviados.
    expect(response.body).toMatchObject({
      tmdbId: '123',
      author: 'Ana',
      score: 4,
      comment: 'Muy entretenida',
    });

    // El ID debe generarse automáticamente.
    expect(response.body.id).toBeDefined();

    // El array en memoria debe contener exactamente una reseña.
    expect(reviews).toHaveLength(1);
    expect(reviews[0]).toMatchObject({
      tmdbId: '123',
      author: 'Ana',
      score: 4,
      comment: 'Muy entretenida',
    });
  });

  it('devuelve 400 si falta el author', async () => {
    // Enviar payload sin author para probar la validación.
    const response = await request(app)
      .post('/api/movies/123/reviews')
      .send({ score: 5, comment: 'Excelente' });

    // Se espera un error de validación.
    expect(response.status).toBe(400);
  });

  it('devuelve 400 si falta el comment', async () => {
    // Enviar payload sin comment para probar la validación.
    const response = await request(app)
      .post('/api/movies/123/reviews')
      .send({ author: 'Ana', score: 5 });

    expect(response.status).toBe(400);
  });

  it('devuelve 400 si falta el score', async () => {
    // Enviar payload sin score para probar la validación.
    const response = await request(app)
      .post('/api/movies/123/reviews')
      .send({ author: 'Ana', comment: 'Genial' });

    expect(response.status).toBe(400);
  });

  it('devuelve 400 si score es menor a 1', async () => {
    // El score debe estar entre 1 y 5; este caso prueba el límite inferior.
    const response = await request(app)
      .post('/api/movies/123/reviews')
      .send({ author: 'Ana', score: 0, comment: 'Mal' });

    expect(response.status).toBe(400);
  });

  it('devuelve 400 si score es mayor a 5', async () => {
    // El score debe estar entre 1 y 5; este caso prueba el límite superior.
    const response = await request(app)
      .post('/api/movies/123/reviews')
      .send({ author: 'Ana', score: 6, comment: 'Demasiado' });

    expect(response.status).toBe(400);
  });

  it('devuelve 400 si score no es un número', async () => {
    // El score debe ser numérico; este caso envía una cadena.
    const response = await request(app)
      .post('/api/movies/123/reviews')
      .send({ author: 'Ana', score: '5', comment: 'Texto inválido' });

    expect(response.status).toBe(400);
  });

  it('elimina una reseña existente y devuelve 204', async () => {
    // Insertar una reseña directamente en el array en memoria.
    const review = {
      id: 'review-123',
      tmdbId: '123',
      author: 'Luis',
      score: 5,
      comment: 'Perfecta',
    };
    reviews.push(review);

    // Llamar al endpoint DELETE para eliminar por ID.
    const response = await request(app).delete('/api/reviews/review-123');

    expect([200, 204]).toContain(response.status);
    expect(reviews).toHaveLength(0);
  });

  it('devuelve 404 si intenta eliminar una reseña inexistente', async () => {
    // No insertar ninguna reseña con este ID.
    const response = await request(app).delete('/api/reviews/no-existe');

    expect(response.status).toBe(404);
  });
});
