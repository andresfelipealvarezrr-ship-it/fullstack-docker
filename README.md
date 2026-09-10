# Full Stack Docker

Proyecto full stack con Docker, CI/CD, Express, MySQL, Astro y React.

## Ejecutar con Docker

```bash
docker compose up --build
```

Luego abre [http://localhost:8080](http://localhost:8080).

La API queda disponible en `http://localhost:3000` y expone:

- `GET /api/health`
- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

## Ejecutar el backend localmente

Duplica `backend/.env.example` como `backend/.env` y configura las credenciales de MySQL antes de ejecutar `npm start` dentro de `backend`.
