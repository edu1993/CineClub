import express from 'express';
import cors from 'cors';
import { reviews } from './reviews.js';
import { fetch } from './fetchClient.js';

// Crear la aplicación Express.
const app = express();

// Permitir CORS.
app.use(cors());

// Permitir JSON en el cuerpo de las peticiones.
app.use(express.json());

// Middleware de logging para todas las requests.
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Ruta de healthcheck.
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

  // Modo demo: devolver resultados mock si no hay API key válida
  if (!apiKey || apiKey === 'dummy') {
    const demoResults = {
      results: [
        {
          id: 27205,
          title: 'Inception',
          release_date: '2010-07-16',
          poster_path: '/9gk7adHYeDMNNGY3ARwJ9YbtXwm.jpg',
          avgScore: 4.5,
        },
        {
          id: 157336,
          title: 'Interstellar',
          release_date: '2014-11-07',
          poster_path: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
          avgScore: 4.2,
        },
        {
          id: 550,
          title: 'Fight Club',
          release_date: '1999-10-15',
          poster_path: '/2lECpi35Hnbpa4y46JNnZGHa3J9.jpg',
          avgScore: 4.8,
        },
      ],
    };
    return res.status(200).json(demoResults);
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

app.get('/api/movies/:tmdbId', async (req, res) => {
  const { tmdbId } = req.params;

  // Easter egg oculto: devolver 418 para la película especial "teapot".
  if (tmdbId === 'teapot') {
    return res.status(418).json({ error: "I'm a teapot" });
  }

  const apiKey = process.env.TMDB_API_KEY;

  // Modo demo: devolver datos mock si no hay API key válida
  const demoMovies = {
    27205: {
      id: 27205,
      title: 'Inception',
      overview: 'A mind-bending thriller about shared dreaming and reality.',
      release_date: '2010-07-16',
      poster_path: '/9gk7adHYeDMNNGY3ARwJ9YbtXwm.jpg',
    },
    157336: {
      id: 157336,
      title: 'Interstellar',
      overview: 'An epic science fiction film exploring space and time.',
      release_date: '2014-11-07',
      poster_path: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    },
    550: {
      id: 550,
      title: 'Fight Club',
      overview: 'A psychological thriller about identity and consumerism.',
      release_date: '1999-10-15',
      poster_path: '/2lECpi35Hnbpa4y46JNnZGHa3J9.jpg',
    },
  };

  if (!apiKey || apiKey === 'dummy') {
    if (demoMovies[tmdbId]) {
      const movieReviews = reviews.filter((review) => review.tmdbId === String(tmdbId));
      const avgScore = movieReviews.length > 0
        ? movieReviews.reduce((sum, review) => sum + review.score, 0) / movieReviews.length
        : 0;

      return res.status(200).json({
        ...demoMovies[tmdbId],
        reviews: movieReviews,
        avgScore,
      });
    }
    return res.status(404).json({ error: 'película no encontrada' });
  }

  const url = `https://api.themoviedb.org/3/movie/${encodeURIComponent(tmdbId)}?api_key=${encodeURIComponent(apiKey)}`;
  const response = await fetch(url);

  if (response.status === 404) {
    return res.status(404).json({ error: 'película no encontrada' });
  }

  if (!response.ok) {
    const errorText = await response.text();
    return res.status(502).json({ error: 'error al consultar TMDB', details: errorText });
  }

  const movie = await response.json();
  const movieReviews = reviews.filter((review) => review.tmdbId === tmdbId);
  const avgScore = movieReviews.length > 0
    ? movieReviews.reduce((sum, review) => sum + review.score, 0) / movieReviews.length
    : 0;

  return res.status(200).json({
    ...movie,
    reviews: movieReviews,
    avgScore,
  });
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
