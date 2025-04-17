'use client';

import { useState } from 'react';

type Props = {
  onAdd: (title: string) => void;
};

export default function TodoForm({ onAdd }: Props) {
  const [title, setTitle] = useState('');
  const [touched, setTouched] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title.trim());
    setTitle('');
    setTouched(false);
  };

  const isValid = title.trim().length > 0;

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full bg-white shadow rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 border border-gray-200"
      aria-label="Formulario para agregar tarea"
    >
      <div className="w-full flex-1">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => setTouched(true)}
          placeholder="Escribe una nueva tarea..."
          aria-label="Título de la tarea"
          className={`w-full px-4 py-2 text-sm rounded-md border shadow-sm focus:outline-none focus:ring-2
            ${
              touched && !isValid
                ? 'border-red-400 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            } placeholder-gray-400`}
        />
        {touched && !isValid && (
          <p className="mt-1 text-xs text-red-500">El título no puede estar vacío.</p>
        )}
      </div>

      <button
        type="submit"
        disabled={!isValid}
        className={`w-full sm:w-auto px-6 py-2 text-sm font-medium rounded-md shadow transition
          ${
            isValid
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
      >
        ➕ Agregar
      </button>
    </form>
  );
}
