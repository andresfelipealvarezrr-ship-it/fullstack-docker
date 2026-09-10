import { useEffect, useState } from 'react';

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');

  useEffect(() => {
    async function loadTasks() {
      try {
        const response = await fetch('/api/tasks');
        if (!response.ok) throw new Error('No se pudieron cargar las tareas');
        setTasks(await response.json());
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    }

    loadTasks();
  }, []);

  async function addTask(event) {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;

    setError('');
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: cleanTitle }),
      });
      if (!response.ok) throw new Error('No se pudo crear la tarea');
      const newTask = await response.json();
      setTasks((currentTasks) => [newTask, ...currentTasks]);
      setTitle('');
    } catch (addError) {
      setError(addError.message);
    }
  }

  async function updateTask(id, changes) {
    const response = await fetch(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(changes),
    });
    if (!response.ok) {
      const result = await response.json().catch(() => ({}));
      throw new Error(result.error || 'No se pudo actualizar la tarea');
    }
    const updatedTask = await response.json();
    setTasks((currentTasks) =>
      currentTasks.map((task) => (task.id === id ? updatedTask : task)),
    );
  }

  async function toggleCompleted(task) {
    try {
      setError('');
      await updateTask(task.id, { completed: !Boolean(task.completed) });
    } catch (updateError) {
      setError(updateError.message);
    }
  }

  async function saveEdit(event) {
    event.preventDefault();
    const cleanTitle = editingTitle.trim();
    if (!cleanTitle || editingId === null) return;

    try {
      setError('');
      await updateTask(editingId, { title: cleanTitle });
      setEditingId(null);
      setEditingTitle('');
    } catch (updateError) {
      setError(updateError.message);
    }
  }

  async function deleteTask(id) {
    try {
      setError('');
      const response = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.error || 'No se pudo eliminar la tarea');
      }
      setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
    } catch (deleteError) {
      setError(deleteError.message);
    }
  }

  return (
    <section className="task-panel">
      <form className="task-form" onSubmit={addTask}>
        <label htmlFor="task-title">Nueva tarea</label>
        <div className="task-form-row">
          <input
            id="task-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Escribe una tarea"
            required
          />
          <button type="submit">Agregar</button>
        </div>
      </form>

      {error && <p className="error-message">{error}</p>}
      {loading ? (
        <p>Cargando tareas...</p>
      ) : tasks.length === 0 ? (
        <p>No hay tareas todavía.</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li className="task-item" key={task.id}>
              {editingId === task.id ? (
                <form className="task-edit-form" onSubmit={saveEdit}>
                  <input
                    aria-label="Editar tarea"
                    value={editingTitle}
                    onChange={(event) => setEditingTitle(event.target.value)}
                    required
                  />
                  <button type="submit">Guardar</button>
                  <button
                    className="secondary-button"
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setEditingTitle('');
                    }}
                  >
                    Cancelar
                  </button>
                </form>
              ) : (
                <>
                  <div className="task-info">
                    <span className="task-title">{task.title}</span>
                    <span className={task.completed ? 'status completed' : 'status'}>
                      {task.completed ? 'Completada' : 'Pendiente'}
                    </span>
                  </div>
                  <div className="task-actions">
                    <button type="button" onClick={() => toggleCompleted(task)}>
                      {task.completed ? 'Marcar pendiente' : 'Completar'}
                    </button>
                    <button
                      className="secondary-button"
                      type="button"
                      onClick={() => {
                        setEditingId(task.id);
                        setEditingTitle(task.title);
                      }}
                    >
                      Editar
                    </button>
                    <button
                      className="danger-button"
                      type="button"
                      onClick={() => deleteTask(task.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
