export type Task = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
};

const apiBaseUrl = (import.meta.env.VITE_API_URL ?? 'http://localhost:3000').replace(/\/$/, '');

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      'content-type': 'application/json',
      ...init?.headers,
    },
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const message = payload && typeof payload.error === 'string'
      ? payload.error
      : 'Não foi possível concluir a operação.';
    throw new Error(message);
  }

  return payload as T;
}

export const taskApi = {
  list: () => request<Task[]>('/api/tasks'),
  create: (title: string) => request<Task>('/api/tasks', {
    method: 'POST',
    body: JSON.stringify({ title }),
  }),
  update: (id: string, completed: boolean) => request<Task>(`/api/tasks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ completed }),
  }),
};
