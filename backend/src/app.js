import express from 'express';
import { reviews } from './reviews.js';
import { fetch } from './fetchClient.js';

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.post('/api/movies/:tmdbId/reviews', (req, res) => {
  const { tmdbId } = req.params;
  const { author, score, comment } = req.body;

  if (!author || score === undefined || !comment) {
    return res.status(400).json({ error: 'author, score y comment son obligatorios' });
  }

  if (typeof score !== 'number' || Number.isNaN(score) || score < 1 || score > 5) {
    return res.status(400).json({ error: 'score debe ser un número entre 1 y 5' });
  }

  const review = {
    id: Date.now().toString(),
    tmdbId,
    author,
    score,
    comment,
  };

  reviews.push(review);

  return res.status(201).json(review);
});

app.get('/api/movies/search', async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ error: 'q es obligatorio' });
  }

  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'TMDB_API_KEY no configurada' });
  }

  const url = `https://api.themoviedb.org/3/search/movie?api_key=${encodeURIComponent(apiKey)}&query=${encodeURIComponent(query)}`;
  const response = await fetch(url);

  if (!response.ok) {
    const errorText = await response.text();
    return res.status(502).json({ error: 'error al consultar TMDB', details: errorText });
  }

  const data = await response.json();
  return res.status(200).json(data);
});

app.delete('/api/reviews/:reviewId', (req, res) => {
  const { reviewId } = req.params;
  const index = reviews.findIndex((review) => review.id === reviewId);

  if (index === -1) {
    return res.status(404).json({ error: 'reseña no encontrada' });
  }

  reviews.splice(index, 1);

  return res.status(204).send();
});

export default app;
