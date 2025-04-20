'use client';

import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/solid';

type TodoFormProps = {
  onAdd: (title: string) => void;
};

export default function TodoForm({ onAdd }: TodoFormProps) {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      setError('El título no puede estar vacío');
      return;
    }
    onAdd(trimmed);
    setTitle('');
    setError('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-xl mx-auto bg-white rounded-2xl shadow-md p-6 flex flex-col sm:flex-row items-center gap-4 transition-shadow hover:shadow-lg"
      aria-label="Formulario para agregar nueva tarea"
    >
      <div className="flex-1 w-full">
        <label htmlFor="todo-input" className="sr-only">
          Nueva tarea
        </label>
        <input
          id="todo-input"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="¿Qué tarea deseas agendar?"
          aria-label="Título de la nueva tarea"
          className={`w-full px-4 py-3 border ${error ? 'border-red-500' : 'border-slate-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 transition`}
          onKeyDown={() => error && setError('')}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>

      <button
        type="submit"
        disabled={!title.trim()}
        className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-lg shadow-md transition hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-slate-500 disabled:opacity-50 disabled:cursor-not-allowed ${
          title.trim() ? 'bg-slate-600 text-white hover:bg-slate-700' : 'bg-slate-200 text-slate-400'
        }`}
      >
        <PlusIcon className="w-5 h-5" />
        <span>Agregar</span>
      </button>
    </form>
  );
}
