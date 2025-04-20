'use client';

import { useEffect, useState } from 'react';
import { Todo } from '@/types/todo';
import {
  createTodo,
  deleteTodo,
  fetchTodos,
  updateTodoTitle,
  updateTodoStatus,
  updateTodoPriority,
  updateTodoDueDate,
} from '@/services/TodoService';
import TodoForm from '@/components/TodoForm';
import TodoFilters from '@/components/TodoFilters';
import TodoList from '@/components/TodoList';
import ConfirmDialog from '@/components/ConfirmDialog';

export default function HomePage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<Todo['status'] | 'ALL'>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<Todo['priority'] | 'ALL'>('ALL');
  const [query, setQuery] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState<number | null>(null);

  useEffect(() => {
    fetchTodos({ status: selectedStatus, priority: selectedPriority, query })
      .then(setTodos)
      .catch((err) => console.error('Error al obtener tareas:', err));
  }, [selectedStatus, selectedPriority, query]);

  const handleAddTodo = async (title: string) => {
    try {
      const newTodo = await createTodo(title);
      setTodos([newTodo, ...todos]);
    } catch (e) {
      console.error('Error al crear tarea:', e);
    }
  };

  // En lugar de confirm(): abrimos el modal
  const askDelete = (id: number) => {
    setToDeleteId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (toDeleteId === null) return;
    try {
      await deleteTodo(toDeleteId);
      setTodos((t) => t.filter((x) => x.id !== toDeleteId));
    } catch (e) {
      console.error('Error al eliminar tarea:', e);
    } finally {
      setConfirmOpen(false);
      setToDeleteId(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setToDeleteId(null);
  };

  const handleEdit = async (id: number, title: string) => {
    try {
      const updated = await updateTodoTitle(id, title);
      setTodos((t) => t.map((x) => (x.id === id ? updated : x)));
    } catch (e) {
      console.error('Error al editar tarea:', e);
    }
  };

  const handleStatusChange = async (id: number, status: Todo['status']) => {
    try {
      const updated = await updateTodoStatus(id, status);
      setTodos((t) => t.map((x) => (x.id === id ? updated : x)));
    } catch (e) {
      console.error('Error al cambiar estado:', e);
    }
  };

  const handlePriorityChange = async (id: number, priority: Todo['priority']) => {
    try {
      const updated = await updateTodoPriority(id, priority);
      setTodos((t) => t.map((x) => (x.id === id ? updated : x)));
    } catch (e) {
      console.error('Error al cambiar prioridad:', e);
    }
  };

  const handleDueDateChange = async (id: number, dueDate: string) => {
    try {
      const updated = await updateTodoDueDate(id, dueDate);
      setTodos((t) => t.map((x) => (x.id === id ? updated : x)));
    } catch (e) {
      console.error('Error al actualizar vencimiento:', e);
    }
  };

  return (
    <main className="homepage__container w-full max-w-[1600px] mx-auto px-4 py-10">

      {/* … Encabezado, TodoForm, TodoFilters … */}
      <section className="mb-6">
        <TodoForm onAdd={handleAddTodo} />
      </section>

      <section className="mb-10">
        <TodoFilters
          selectedStatus={selectedStatus}
          selectedPriority={selectedPriority}
          onStatusChange={setSelectedStatus}
          onPriorityChange={setSelectedPriority}
          query={query}
          onQueryChange={setQuery}
        />
      </section>

      <TodoList
        todos={todos}
        onDelete={askDelete}                    // ← usar askDelete
        onEdit={handleEdit}
        onStatusChange={handleStatusChange}
        onPriorityChange={handlePriorityChange}
        onDueDateChange={handleDueDateChange}
      />

      {/* Modal de confirmación */}
      <ConfirmDialog
        isOpen={confirmOpen}
        message="¿Estás seguro de eliminar esta tarea?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </main>
  );
}
