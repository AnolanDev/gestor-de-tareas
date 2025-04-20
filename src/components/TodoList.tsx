`use client`;

import { useState } from 'react';
import { Todo } from '@/types/todo';
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  useDroppable,
  useDraggable,
} from '@dnd-kit/core';
import { format, differenceInHours } from 'date-fns';
import { es } from 'date-fns/locale';
import { ClockIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

// Formatea fecha y hora
const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

// Componente arrastrable
function DraggableCard({
  todo,
  children,
}: {
  todo: Todo;
  children: (drag: ReturnType<typeof useDraggable>) => React.ReactNode;
}) {
  const drag = useDraggable({ id: todo.id.toString() });
  const { setNodeRef, transform, isDragging } = drag;
  return (
    <div
      ref={setNodeRef}
      className="task-card"
      style={{
        transform: transform
          ? `translate(${transform.x}px, ${transform.y}px)`
          : undefined,
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      {children(drag)}
    </div>
  );
}

// Columna droppable
function DroppableColumn({
  status,
  children,
}: {
  status: Todo['status'];
  children: React.ReactNode;
}) {
  const { setNodeRef } = useDroppable({ id: status });
  return (
    <div ref={setNodeRef} className="kanban-column w-full sm:w-1/2 md:w-1/3 px-2">
      {children}
    </div>
  );
}

type Props = {
  todos: Todo[];
  onDelete: (id: number) => void;
  onEdit: (id: number, title: string) => void;
  onStatusChange: (id: number, status: Todo['status']) => void;
  onPriorityChange: (id: number, priority: Todo['priority']) => void;
  onDueDateChange: (id: number, dueDate: string) => void;
};

export default function TodoList({
  todos,
  onDelete,
  onEdit,
  onStatusChange,
  onPriorityChange,
  onDueDateChange,
}: Props) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [pickerId, setPickerId] = useState<number | null>(null);
  const [pickerValue, setPickerValue] = useState<string>('');

  // Inicia edición
  const startEdit = (t: Todo) => {
    setEditingId(t.id);
    setEditTitle(t.title);
  };

  // Finaliza edición
  const finishEdit = () => {
    if (editingId !== null && editTitle.trim()) {
      onEdit(editingId, editTitle.trim());
      setEditingId(null);
    }
  };

  // Drag & drop
  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over) return;
    const id = Number(active.id);
    const newStatus = over.id as Todo['status'];
    const current = todos.find((t) => t.id === id);
    if (current && current.status !== newStatus) {
      onStatusChange(id, newStatus);
    }
  };

  // Orden ascendente por createdAt
  const sorted = [...todos].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  // Renderiza columna con alertas omitidas al completar
  const renderColumn = (label: string, status: Todo['status']) => {
    const grouped = sorted
      .filter((t) => t.status === status)
      .reduce((acc: Record<string, Todo[]>, t) => {
        const day = format(new Date(t.createdAt), 'PPP', { locale: es }).toUpperCase();
        (acc[day] = acc[day] || []).push(t);
        return acc;
      }, {});

    return (
      <DroppableColumn status={status}>
        <div className="column-box bg-white shadow rounded-lg p-4 min-h-[200px]">
          <h2 className="column-header text-center font-semibold text-gray-700 mb-3 border-b pb-2">
            {label}
          </h2>
          <div className="column-groups space-y-4">
            {Object.entries(grouped).map(([date, tasks]) => (
              <div key={date}>
                <div className="group-header flex items-center gap-2 text-xs font-semibold text-gray-600 uppercase mb-2">
                  <span className="group-dot w-2 h-2 bg-blue-400 rounded-full" />
                  <span className="group-date border-b border-gray-300 pb-1 flex-1">
                    {date}
                  </span>
                </div>
                <div className="tasks space-y-2">
                  {tasks.map((t) => {
                    const isDone = t.status === 'DONE';
                    let isExpiringSoon = false;
                    let isExpired = false;
                    if (!isDone && t.dueDate) {
                      const hoursLeft = differenceInHours(new Date(t.dueDate), new Date());
                      isExpiringSoon = hoursLeft >= 0 && hoursLeft <= 24;
                      isExpired = hoursLeft < 0;
                    }

                    return (
                      <DraggableCard key={t.id} todo={t}>
                        {(drag) => (
                          <div
                            className={`task-inner bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 p-3 transition ${
                              isExpiringSoon ? 'border-yellow-400 bg-yellow-50' : ''
                            } ${isExpired ? 'border-red-400 bg-red-50' : ''}`}
                          >
                            {!isDone && isExpiringSoon && (
                              <div className="alert-banner flex items-center gap-1 text-xs text-red-700 font-medium mb-2 ">
                                🔔 Próximo a vencer
                              </div>
                            )}
                            {!isDone && isExpired && (
                              <div className="alert-banner flex items-center gap-1 text-xs text-gray-700 font-medium mb-2">
                                ⌛ Vencido
                              </div>
                            )}
                            {/* Parte superior */}
                            <div className="task-top flex items-start gap-3">
                              <button
                                {...drag.listeners}
                                {...drag.attributes}
                                className="drag-handle cursor-move text-gray-400 hover:text-gray-600"
                                title="Mover tarea"
                              >
                                ☰
                              </button>
                              <input
                                type="checkbox"
                                checked={isDone}
                                onChange={() =>
                                  onStatusChange(t.id, isDone ? 'PENDING' : 'DONE')
                                }
                                className="checkbox h-5 w-5 accent-green-600 mt-1"
                              />
                              <div className="flex-1">
                                {editingId === t.id ? (
                                  <input
                                    autoFocus
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    onBlur={finishEdit}
                                    onKeyDown={(e) => e.key === 'Enter' && finishEdit()}
                                    className="edit-input w-full border px-2 py-1 rounded"
                                  />
                                ) : (
                                  <>
                                    <span
                                      className={`task-title block cursor-pointer text-sm font-semibold ${
                                        isDone ? 'line-through text-gray-400' : 'text-gray-800'
                                      }`}
                                      onDoubleClick={() => startEdit(t)}
                                    >
                                      {t.title}
                                    </span>
                                    <div className="task-created-at text-xs text-gray-500 mt-1">
                                      {formatDateTime(t.createdAt)}
                                    </div>
                                  </>
                                )}
                              </div>
                              {/* Picker de vencimiento */}
                              <div className="relative">
                                <ClockIcon
                                  className="h-5 w-5 text-gray-500 cursor-pointer hover:text-gray-700"
                                  onClick={() => {
                                    setPickerId(t.id);
                                    setPickerValue(t.dueDate || '');
                                  }}
                                  title="Asignar fecha de vencimiento"
                                />
                                {pickerId === t.id && (
                                  <input
                                    type="datetime-local"
                                    autoFocus
                                    className="due-picker absolute left-0 top-full mt-2 p-2 bg-white border border-gray-300 rounded shadow-lg"
                                    value={pickerValue}
                                    onChange={(e) => setPickerValue(e.target.value)}
                                    onBlur={() => {
                                      if (pickerValue) onDueDateChange(t.id, pickerValue);
                                      setPickerId(null);
                                    }}
                                  />
                                )}
                              </div>
                            </div>
                            {/* Parte inferior */}
                            <div className="task-bottom flex flex-wrap items-center gap-2 mt-4">
                              <select
                                value={t.status}
                                onChange={(e) =>
                                  onStatusChange(t.id, e.target.value as Todo['status'])
                                }
                                className={`px-2 py-1 rounded text-xs border shadow transition-colors ${
                                  t.status === 'PENDING'
                                    ? 'bg-yellow-50 text-yellow-800 border-yellow-300'
                                    : t.status === 'IN_PROGRESS'
                                    ? 'bg-blue-50 text-blue-800 border-blue-300'
                                    : 'bg-green-50 text-green-800 border-green-300'
                                }`}
                              >
                                <option value="PENDING">Pendiente</option>
                                <option value="IN_PROGRESS">En progreso</option>
                                <option value="DONE">Completado</option>
                              </select>
                              <select
                                value={t.priority}
                                onChange={(e) =>
                                  onPriorityChange(t.id, e.target.value as Todo['priority'])
                                }
                                className={`px-2 py-1 rounded text-xs border shadow transition-colors ${
                                  t.priority === 'HIGH'
                                    ? 'bg-red-100 text-red-800 border-red-300'
                                    : t.priority === 'MEDIUM'
                                    ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                                    : 'bg-green-100 text-green-800 border-green-300'
                                }`}
                              >
                                <option value="HIGH">Alta</option>
                                <option value="MEDIUM">Media</option>
                                <option value="LOW">Baja</option>
                              </select>
                              {t.dueDate && (
                                <time className="ml-2 text-xs text-red-600 flex items-center gap-1">
                                  <span className="font-medium text-gray-900">Vence:</span>
                                  {formatDateTime(t.dueDate)}
                                </time>
                              )}
                              <div className="flex items-center gap-3 ml-auto">
                                <button onClick={() => startEdit(t)}>
                                  <PencilIcon className="h-5 w-5 text-blue-600 hover:text-blue-800" />
                                </button>
                                <button onClick={() => onDelete(t.id)}>
                                  <TrashIcon className="h-5 w-5 text-red-600 hover:text-red-800" />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </DraggableCard>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DroppableColumn>
    );
  };

  return (
    <div className="todo-container max-w-[1800px] mx-auto px-4 py-6">
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="kanban-board flex flex-nowrap justify-center gap-6">
          {renderColumn('Pendientes 🕒', 'PENDING')}
          {renderColumn('En Progreso 🔄', 'IN_PROGRESS')}
          {renderColumn('Completadas ✅', 'DONE')}
        </div>
      </DndContext>
    </div>
  );
}
