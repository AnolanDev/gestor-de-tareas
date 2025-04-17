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
} from '@/services/TodoService';
import TodoForm from '@/components/TodoForm';
import TodoList from '@/components/TodoList';
import TodoFilters from '@/components/TodoFilters';

export default function HomePage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<Todo['status'] | 'ALL'>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<Todo['priority'] | 'ALL'>('ALL');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchTodos({ status: selectedStatus, priority: selectedPriority, search })
      .then(setTodos)
      .catch((err) => console.error('Error al obtener tareas:', err));
  }, [selectedStatus, selectedPriority, search]);

  const handleAddTodo = async (title: string) => {
    try {
      const newTodo = await createTodo(title);
      setTodos([newTodo, ...todos]);
    } catch (error) {
      console.error('Error al crear tarea:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
    }
  };

  const handleEdit = async (id: number, title: string) => {
    try {
      const updated = await updateTodoTitle(id, title);
      setTodos(todos.map((todo) => (todo.id === id ? updated : todo)));
    } catch (error) {
      console.error('Error al editar tarea:', error);
    }
  };

  const handleStatusChange = async (id: number, status: Todo['status']) => {
    try {
      const updated = await updateTodoStatus(id, status);
      setTodos(todos.map((todo) => (todo.id === id ? updated : todo)));
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    }
  };

  const handlePriorityChange = async (id: number, priority: Todo['priority']) => {
    try {
      const updated = await updateTodoPriority(id, priority);
      setTodos(todos.map((todo) => (todo.id === id ? updated : todo)));
    } catch (error) {
      console.error('Error al cambiar prioridad:', error);
    }
  };

  return (
    <main className="w-full max-w-[1400px] mx-auto px-4 py-10">
      {/* Encabezado */}
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight mb-2">
          📝 Gestión de Tareas
        </h1>
        <p className="text-sm text-gray-500">Organiza, prioriza y completa tus pendientes</p>
      </header>

      {/* Formulario para nueva tarea */}
      <section aria-label="Agregar nueva tarea">
        <TodoForm onAdd={handleAddTodo} />
      </section>

      {/* Filtros */}
      <section className="mt-6" aria-label="Filtros de búsqueda">
        <TodoFilters
          selectedStatus={selectedStatus}
          selectedPriority={selectedPriority}
          onStatusChange={setSelectedStatus}
          onPriorityChange={setSelectedPriority}
          search={search}
          onSearchChange={setSearch}
        />
      </section>

      {/* Lista de tareas */}
      <section className="mt-10" aria-label="Listado de tareas">
        <TodoList
          todos={todos}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onStatusChange={handleStatusChange}
          onPriorityChange={handlePriorityChange}
        />
      </section>
    </main>
  );
}
