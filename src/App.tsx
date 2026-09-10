import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { taskApi, type Task } from './api';

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Ocorreu um erro inesperado.';
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadTasks() {
    setLoading(true);
    setError(null);

    try {
      setTasks(await taskApi.list());
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadTasks();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedTitle = title.trim();

    if (normalizedTitle.length < 3 || normalizedTitle.length > 120) {
      setError('Escreva uma tarefa entre 3 e 120 caracteres.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const task = await taskApi.create(normalizedTitle);
      setTasks((currentTasks) => [...currentTasks, task]);
      setTitle('');
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleTask(task: Task) {
    setUpdatingId(task.id);
    setError(null);

    try {
      const updatedTask = await taskApi.update(task.id, !task.completed);
      setTasks((currentTasks) => currentTasks.map((item) => (
        item.id === updatedTask.id ? updatedTask : item
      )));
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setUpdatingId(null);
    }
  }

  const completedCount = tasks.filter((task) => task.completed).length;

  return (
    <main className="page-shell">
      <section className="task-card" aria-labelledby="page-title">
        <header className="hero">
          <p className="eyebrow">Vicx · Catálogo de tarefas</p>
          <h1 id="page-title">O que precisa avançar hoje?</h1>
          <p className="subtitle">Uma integração simples entre frontend e backend independentes.</p>
        </header>

        <form className="task-form" onSubmit={handleSubmit}>
          <label htmlFor="task-title">Nova tarefa</label>
          <div className="form-row">
            <input
              id="task-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Ex.: Revisar o contrato da API"
              minLength={3}
              maxLength={120}
              disabled={submitting}
              required
            />
            <button type="submit" disabled={submitting}>
              {submitting ? 'Adicionando…' : 'Adicionar'}
            </button>
          </div>
        </form>

        {error && (
          <div className="feedback error" role="alert">
            {error}
            <button type="button" onClick={() => void loadTasks()}>Tentar novamente</button>
          </div>
        )}

        <section className="task-section" aria-live="polite" aria-busy={loading}>
          <div className="section-heading">
            <h2>Suas tarefas</h2>
            <span>{completedCount}/{tasks.length} concluídas</span>
          </div>

          {loading && <p className="empty-state">Carregando tarefas…</p>}

          {!loading && tasks.length === 0 && (
            <p className="empty-state">Nenhuma tarefa ainda. Comece adicionando a primeira.</p>
          )}

          {!loading && tasks.length > 0 && (
            <ul className="task-list">
              {tasks.map((task) => (
                <li key={task.id} className={task.completed ? 'task completed' : 'task'}>
                  <label>
                    <input
                      type="checkbox"
                      checked={task.completed}
                      disabled={updatingId === task.id}
                      onChange={() => void toggleTask(task)}
                    />
                    <span>{task.title}</span>
                  </label>
                  <time dateTime={task.createdAt}>
                    {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(new Date(task.createdAt))}
                  </time>
                </li>
              ))}
            </ul>
          )}
        </section>
      </section>
    </main>
  );
}
