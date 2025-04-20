import { Todo } from '@/types/todo';

const API_URL = '/api/todos';

type FetchTodosOptions = {
  status?: 'ALL' | 'PENDING' | 'IN_PROGRESS' | 'DONE';
  priority?: 'ALL' | 'LOW' | 'MEDIUM' | 'HIGH';
  query?: string;
};

export async function fetchTodos(options: FetchTodosOptions = {}): Promise<Todo[]> {
  const params = new URLSearchParams();
  if (options.status && options.status !== 'ALL')    params.append('status', options.status);
  if (options.priority && options.priority !== 'ALL') params.append('priority', options.priority);
  if (options.query)                                  params.append('query', options.query);
  const res = await fetch(`${API_URL}?${params.toString()}`);
  if (!res.ok) throw new Error('Error al obtener tareas');
  return res.json();
}

export async function createTodo(title: string): Promise<Todo> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error('Error al crear tarea');
  return res.json();
}

export async function deleteTodo(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Error al eliminar tarea');
}

export async function updateTodoTitle(id: number, title: string): Promise<Todo> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error('Error al actualizar título');
  return res.json();
}

export async function updateTodoStatus(id: number, status: Todo['status']): Promise<Todo> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Error al actualizar estado');
  return res.json();
}

export async function updateTodoPriority(id: number, priority: Todo['priority']): Promise<Todo> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ priority }),
  });
  if (!res.ok) throw new Error('Error al actualizar prioridad');
  return res.json();
}

/**
 * Actualiza sólo la fecha de vencimiento de la tarea.
 */
export async function updateTodoDueDate(
  id: number,
  dueDate: string
): Promise<Todo> {
  const res = await fetch(`${API_URL}/${id}/dueDate`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dueDate }),
  });
  if (!res.ok) throw new Error('Error al actualizar fecha de vencimiento');
  return res.json();
}


