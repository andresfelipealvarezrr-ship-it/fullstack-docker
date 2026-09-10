# Comandos y pruebas del proyecto

Este archivo resume el trabajo realizado en el repositorio `fullstack`.

## Inicialización

```powershell
mkdir fullstack
cd fullstack
git init -b main
git add .
git commit -m "inicialización repositorio del proyecto"
```

## Backend

```powershell
mkdir backend
cd backend
npm init
npm install express mysql2 cors dotenv
node --check src/index.js
git add backend
git commit -m "crear API REST con Express y MySQL"
```

La API tiene estos endpoints:

- `GET /api/health`
- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

## Frontend

```powershell
mkdir frontend
npm install
npm run build
```

La interfaz permite listar, crear, completar, editar y eliminar tareas.

## Docker

```powershell
docker compose up --build -d
docker compose ps
docker compose logs backend
docker compose logs frontend
```

La aplicación se prueba en `http://localhost:8080`.

## Git

Los commits realizados en `main` son:

- `e23108a` inicialización repositorio del proyecto
- `83b2601` crear API REST con Express y MySQL
- `5bb4caa` script de inicialización con tabla y datos
- `f5959c4` creación de interfaz con astro con componentes React para las tareas
- `2725fc5` creación Dockerfiles multistage para front y back
- `71b0f59` creación docker-compose con MySQL, backend y frontend
- `8ca9e94` completar endpoints PUT y DELETE de tareas
- `06f68b7` agregar controles de edición y eliminación de tareas

## Estado de las comprobaciones

- La sintaxis del backend fue comprobada con `node --check`.
- La página `http://localhost:8080` cargó las tareas iniciales desde MySQL.
- El frontend se conectó correctamente con la API mediante Nginx.
- El build local de Astro quedó limitado por permisos del entorno de Codex; la imagen servida por Docker sí cargó la aplicación correctamente.
- El repositorio local está en la rama `main` y sin cambios pendientes.
- El último `git push` queda pendiente de autorizar Git Credential Manager en Windows.
