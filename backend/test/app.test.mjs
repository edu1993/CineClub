// Prueba de integración de la API de backend usando Supertest y Vitest.
// Se comprueba que la ruta raíz responde correctamente con status 200.
import request from 'supertest';
import app from '../src/app.js';
import { reviews } from '../src/reviews.js';
import { describe, it, expect, beforeEach } from 'vitest';

describe('CineClub backend', () => {
  // Limpiar el array de reseñas antes de cada prueba para asegurar aislamiento.
  beforeEach(() => {
    reviews.length = 0;
  });

  it('responde con status 200 en GET /', async () => {
    // Ejecutar la petición HTTP contra la app de Express.
    const response = await request(app).get('/');

    // Verificar que el estado y el cuerpo de la respuesta son los esperados.
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });
});
