'use client';

import { Todo } from '@/types/todo';

type Props = {
  selectedStatus: Todo['status'] | 'ALL';
  selectedPriority: Todo['priority'] | 'ALL';
  onStatusChange: (status: Todo['status'] | 'ALL') => void;
  onPriorityChange: (priority: Todo['priority'] | 'ALL') => void;
  search: string;
  onSearchChange: (query: string) => void;
};

export default function TodoFilters({
  selectedStatus,
  selectedPriority,
  onStatusChange,
  onPriorityChange,
  search,
  onSearchChange,
}: Props) {
  return (
    <section
      className="w-full bg-white p-5 rounded-lg shadow flex flex-col sm:flex-row sm:items-end gap-4 mt-6 border border-gray-200"
      aria-label="Filtros de tareas"
    >
      {/* Búsqueda por título */}
      <div className="flex flex-col w-full sm:w-1/3">
        <label htmlFor="search" className="text-sm font-medium text-gray-600 mb-1">
          Buscar por título
        </label>
        <input
          id="search"
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="🔍 Escribe el título de la tarea..."
          className="px-3 py-2 rounded-md border border-gray-300 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          aria-label="Buscar tareas por título"
        />
      </div>

      {/* Filtro por estado */}
      <div className="flex flex-col w-full sm:w-1/3">
        <label htmlFor="status" className="text-sm font-medium text-gray-600 mb-1">
          Estado
        </label>
        <select
          id="status"
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value as Todo['status'] | 'ALL')}
          className="px-3 py-2 rounded-md border border-gray-300 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
          <option value="ALL">Todos los estados</option>
          <option value="PENDING">Pendiente</option>
          <option value="IN_PROGRESS">En progreso</option>
          <option value="DONE">Completado</option>
        </select>
      </div>

      {/* Filtro por prioridad */}
      <div className="flex flex-col w-full sm:w-1/3">
        <label htmlFor="priority" className="text-sm font-medium text-gray-600 mb-1">
          Prioridad
        </label>
        <select
          id="priority"
          value={selectedPriority}
          onChange={(e) => onPriorityChange(e.target.value as Todo['priority'] | 'ALL')}
          className="px-3 py-2 rounded-md border border-gray-300 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
          <option value="ALL">Todas las prioridades</option>
          <option value="HIGH">Alta</option>
          <option value="MEDIUM">Media</option>
          <option value="LOW">Baja</option>
        </select>
      </div>
    </section>
  );
}
