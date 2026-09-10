const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3000);

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

app.use(cors());
app.use(express.json());

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    console.error('Database health check failed:', error.message);
    res.status(503).json({ status: 'error', database: 'disconnected' });
  }
});

app.get('/api/tasks', async (_req, res) => {
  try {
    const [tasks] = await pool.query(
      'SELECT id, title, completed, created_at FROM task ORDER BY created_at DESC, id DESC',
    );
    res.json(tasks);
  } catch (error) {
    console.error('Could not list tasks:', error.message);
    res.status(500).json({ error: 'No se pudieron cargar las tareas' });
  }
});

app.post('/api/tasks', async (req, res) => {
  const title = typeof req.body?.title === 'string' ? req.body.title.trim() : '';

  if (!title) {
    return res.status(400).json({ error: 'El título es obligatorio' });
  }

  try {
    const [result] = await pool.query('INSERT INTO task (title) VALUES (?)', [title]);
    const [rows] = await pool.query(
      'SELECT id, title, completed, created_at FROM task WHERE id = ?',
      [result.insertId],
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Could not create task:', error.message);
    res.status(500).json({ error: 'No se pudo crear la tarea' });
  }
});

app.put('/api/tasks/:id', async (req, res) => {
  const taskId = Number(req.params.id);
  const updates = [];
  const values = [];

  if (!Number.isInteger(taskId) || taskId <= 0) {
    return res.status(400).json({ error: 'El id de la tarea no es válido' });
  }

  if (req.body?.title !== undefined) {
    const title = typeof req.body.title === 'string' ? req.body.title.trim() : '';
    if (!title) {
      return res.status(400).json({ error: 'El título no puede estar vacío' });
    }
    updates.push('title = ?');
    values.push(title);
  }

  if (req.body?.completed !== undefined) {
    const completed = req.body.completed;
    if (typeof completed !== 'boolean' && completed !== 0 && completed !== 1) {
      return res.status(400).json({ error: 'completed debe ser booleano' });
    }
    updates.push('completed = ?');
    values.push(Boolean(completed));
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'Envía title o completed para actualizar' });
  }

  try {
    values.push(taskId);
    const [result] = await pool.query(
      `UPDATE task SET ${updates.join(', ')} WHERE id = ?`,
      values,
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    const [rows] = await pool.query(
      'SELECT id, title, completed, created_at FROM task WHERE id = ?',
      [taskId],
    );
    res.json(rows[0]);
  } catch (error) {
    console.error('Could not update task:', error.message);
    res.status(500).json({ error: 'No se pudo actualizar la tarea' });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  const taskId = Number(req.params.id);

  if (!Number.isInteger(taskId) || taskId <= 0) {
    return res.status(400).json({ error: 'El id de la tarea no es válido' });
  }

  try {
    const [result] = await pool.query('DELETE FROM task WHERE id = ?', [taskId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Could not delete task:', error.message);
    res.status(500).json({ error: 'No se pudo eliminar la tarea' });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Backend listening on port ${port}`);
});
