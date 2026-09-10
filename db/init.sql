CREATE DATABASE IF NOT EXISTS app_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE app_db;

CREATE TABLE IF NOT EXISTS task (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO task (title, completed)
SELECT 'Preparar el entorno de Docker', FALSE
WHERE NOT EXISTS (SELECT 1 FROM task WHERE title = 'Preparar el entorno de Docker');

INSERT INTO task (title, completed)
SELECT 'Crear la API REST', FALSE
WHERE NOT EXISTS (SELECT 1 FROM task WHERE title = 'Crear la API REST');

INSERT INTO task (title, completed)
SELECT 'Conectar el frontend con el backend', TRUE
WHERE NOT EXISTS (SELECT 1 FROM task WHERE title = 'Conectar el frontend con el backend');
