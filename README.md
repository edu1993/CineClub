# CineClub

Aplicación de búsqueda y reseñas de películas con frontend en React y backend en Express.

## Requisitos

- Node.js 18 o superior
- npm

## Levantar el proyecto

### 1) Backend

```bash
cd backend
npm install
npm start
```

El backend quedará disponible en:
- http://localhost:3001/

### 2) Frontend

En otra terminal:

```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0
```

La interfaz quedará disponible en:
- http://localhost:5173/

## Variables de entorno

El backend funciona en modo demo sin clave de TMDB. Si quieres usar datos reales, crea un archivo `.env` dentro de `backend` con:

```env
TMDB_API_KEY=tu_clave_aqui
```

## Pruebas

```bash
cd backend
npm test
```

```bash
cd frontend
npm test
```

## Nota sobre las ramas

Los cambios de la rama `feat/mejoras-ui` no aparecen en `main` porque esa rama no ha sido mergeada todavía en la rama principal. Si quieres ver esos cambios, cambia a esa rama con:

```bash
git checkout feat/mejoras-ui
```
