'use client';

import { Todo } from '@/types/todo';
import { MagnifyingGlassIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

type Props = {
  selectedStatus: Todo['status'] | 'ALL';
  selectedPriority: Todo['priority'] | 'ALL';
  onStatusChange: (status: Todo['status'] | 'ALL') => void;
  onPriorityChange: (priority: Todo['priority'] | 'ALL') => void;
  query: string;
  onQueryChange: (query: string) => void;
};

export default function TodoFilters({
  selectedStatus,
  selectedPriority,
  onStatusChange,
  onPriorityChange,
  query,
  onQueryChange,
}: Props) {
  return (
    <section
      className="todo-filters__wrapper bg-white p-6 rounded-xl shadow-lg grid grid-cols-1 md:grid-cols-3 gap-6 mt-6"
      aria-label="Filtros de tareas"
    >
      {/* Búsqueda */}
      <div className="todo-filters__group">
        <label htmlFor="query" className="block text-sm font-semibold text-gray-700 mb-2">
          Buscar
        </label>
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            id="query"
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="¿Qué quieres hacer hoy?"
            className="todo-filters__input block w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>
      </div>

      {/* Filtro por Estado */}
      <div className="todo-filters__group">
        <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2">
          Estado
        </label>
        <div className="relative">
          <select
            id="status"
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value as Todo['status'] | 'ALL')}
            className="todo-filters__select block w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none transition"
          >
            <option value="ALL">Todos los estados</option>
            <option value="PENDING">Pendiente</option>
            <option value="IN_PROGRESS">En progreso</option>
            <option value="DONE">Completado</option>
          </select>
          <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
        </div>
      </div>

      {/* Filtro por Prioridad */}
      <div className="todo-filters__group">
        <label htmlFor="priority" className="block text-sm font-semibold text-gray-700 mb-2">
          Prioridad
        </label>
        <div className="relative">
          <select
            id="priority"
            value={selectedPriority}
            onChange={(e) => onPriorityChange(e.target.value as Todo['priority'] | 'ALL')}
            className="todo-filters__select block w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none transition"
          >
            <option value="ALL">Todas las prioridades</option>
            <option value="HIGH">Alta</option>
            <option value="MEDIUM">Media</option>
            <option value="LOW">Baja</option>
          </select>
          <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
