# CineClub Backend

## Descripción

Este es el backend de `CineClub`, una API en Node.js y Express que:

- Expone una ruta de healthcheck `/`
- Permite crear reseñas en memoria para películas
- Proxies de búsqueda y detalle hacia TMDB
- Calcula `avgScore` para reseñas locales

## Requisitos

- Node.js 18+ (para fetch global o usa polyfill si es versión anterior)
- `npm`
- Variables de entorno:
  - `TMDB_API_KEY`: clave de la API de TMDB
  - `PORT` (opcional, por defecto `3001`)

## Instalación

```bash
cd backend
npm install
```

## Ejecución

```bash
cd backend
npm start
```

El servidor levanta en `http://localhost:3001` o en el puerto definido por `PORT`.

## Pruebas

Para ejecutar todas las pruebas:

```bash
cd backend
npm test
```

## Endpoints

### Healthcheck

- `GET /`
- Respuesta: `200 { status: 'ok' }`

### Crear reseña

- `POST /api/movies/:tmdbId/reviews`
- Cuerpo JSON:
  - `author` (string)
  - `score` (número 1-5)
  - `comment` (string)

### Eliminar reseña

- `DELETE /api/reviews/:reviewId`

### Buscar películas en TMDB

- `GET /api/movies/search?q=QUERY`
- Requiere `q`
- Utiliza `TMDB_API_KEY`

### Detalle de película TMDB

- `GET /api/movies/:tmdbId`
- Devuelve datos de TMDB + reseñas locales + `avgScore`

## Ejemplos de uso con curl

### Healthcheck

```bash
curl -i http://localhost:3001/
```

### Crear reseña

```bash
curl -i -X POST http://localhost:3001/api/movies/123/reviews \
  -H "Content-Type: application/json" \
  -d '{"author":"Ana","score":5,"comment":"Muy buena"}'
```

### Eliminar reseña

```bash
curl -i -X DELETE http://localhost:3001/api/reviews/review-id
```

### Buscar películas en TMDB

```bash
curl -i "http://localhost:3001/api/movies/search?q=Inception"
```

### Detalle de película TMDB

```bash
curl -i http://localhost:3001/api/movies/123
```

## Buenas prácticas de pruebas

Las pruebas se separan en archivos por responsabilidad:

- `test/health.test.mjs` para salud del servicio
- `test/reviews.test.mjs` para endpoints de reseñas
- `test/tmdb.test.mjs` para proxy a TMDB

Esto mejora la claridad y facilita mantenimiento cuando el proyecto crece.
