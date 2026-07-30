// Archivo de pruebas para el backend de CineClub.
// Contiene pruebas de integración para la aplicación Express completa.

import request from 'supertest';
import app from '../src/app.js';
import { reviews } from '../src/reviews.js';
import { describe, it, expect, beforeEach } from 'vitest';

describe('CineClub backend', () => {
  // Antes de cada prueba, vaciar el array de reseñas en memoria
  // para que las pruebas sean independientes unas de otras.
  beforeEach(() => {
    reviews.length = 0;
  });

  it('responde con status 200 en GET /', async () => {
    // Petición a la ruta base para verificar que el servidor está vivo.
    const response = await request(app).get('/');

    // Se espera un status 200 y una respuesta JSON con la propiedad status.
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
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
});
