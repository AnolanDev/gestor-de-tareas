'use client';

import { useState } from 'react';
import { Todo } from '@/types/todo';
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  useDroppable,
  useDraggable,
} from '@dnd-kit/core';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

type Props = {
  todos: Todo[];
  onDelete: (id: number) => void;
  onEdit: (id: number, title: string) => void;
  onStatusChange: (id: number, status: Todo['status']) => void;
  onPriorityChange: (id: number, priority: Todo['priority']) => void;
};

const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

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

function DroppableColumn({
  status,
  children,
}: {
  status: Todo['status'];
  children: React.ReactNode;
}) {
  const { setNodeRef } = useDroppable({ id: status });
  return (
    <div
      ref={setNodeRef}
      className="kanban-column w-full sm:w-1/2 md:w-1/3 px-2"
    >
      {children}
    </div>
  );
}

export default function TodoList({
  todos,
  onDelete,
  onEdit,
  onStatusChange,
  onPriorityChange,
}: Props) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const startEdit = (t: Todo) => {
    setEditingId(t.id);
    setEditTitle(t.title);
  };

  const finishEdit = () => {
    if (editingId !== null && editTitle.trim()) {
      onEdit(editingId, editTitle.trim());
      setEditingId(null);
    }
  };

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

  const renderColumn = (label: string, status: Todo['status']) => {
    const grouped = todos
      .filter((t) => t.status === status)
      .sort((a, b) => {
        const order = { HIGH: 0, MEDIUM: 1, LOW: 2 } as Record<string, number>;
        const dayA = a.createdAt.slice(0, 10);
        const dayB = b.createdAt.slice(0, 10);
        if (dayA === dayB) return order[a.priority] - order[b.priority];
        return (
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
        );
      })
      .reduce((acc: Record<string, Todo[]>, t) => {
        const key = format(new Date(t.createdAt), 'PPP', { locale: es });
        (acc[key] = acc[key] || []).push(t);
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
                  {tasks.map((t) => (
                    <DraggableCard key={t.id} todo={t}>
                      {(drag) => (
                        <div className="task-card bg-gray-50 hover:bg-gray-100 rounded border border-gray-200 p-3 transition">
                          <div className="task-top flex items-start gap-3">
                            <button
                              {...drag.attributes}
                              {...drag.listeners}
                              className="drag-handle cursor-move text-gray-400 hover:text-gray-600"
                              title="Mover"
                            >
                              ☰
                            </button>
                            <input
                              type="checkbox"
                              checked={t.status === 'DONE'}
                              onChange={() =>
                                onStatusChange(
                                  t.id,
                                  t.status === 'DONE'
                                    ? 'PENDING'
                                    : 'DONE'
                                )
                              }
                              className="checkbox h-4 w-4 accent-green-600"
                            />
                            {editingId === t.id ? (
                              <input
                                autoFocus
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                onBlur={finishEdit}
                                onKeyDown={(e) =>
                                  e.key === 'Enter' && finishEdit()
                                }
                                className="edit-input flex-1 border px-2 py-1 rounded"
                              />
                            ) : (
                              <div className="task-text flex-1">
                                <span
                                  className={`task-title cursor-pointer ${
                                    t.status === 'DONE'
                                      ? 'line-through text-gray-400'
                                      : 'text-gray-800'
                                  }`}
                                  onDoubleClick={() => startEdit(t)}
                                >
                                  {t.title}
                                </span>
                                <div className="task-date text-xs text-gray-400">
                                  {formatDateTime(t.createdAt)}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="task-bottom flex flex-wrap gap-2 mt-2">
                            <select
                              value={t.status}
                              onChange={(e) =>
                                onStatusChange(
                                  t.id,
                                  e.target.value as Todo['status']
                                )
                              }
                              className="status-select px-2 py-1 border rounded text-xs"
                            >
                              <option value="PENDING">Pendiente</option>
                              <option value="IN_PROGRESS">
                                En progreso
                              </option>
                              <option value="DONE">Completado</option>
                            </select>
                            <select
                              value={t.priority}
                              onChange={(e) =>
                                onPriorityChange(
                                  t.id,
                                  e.target.value as Todo['priority']
                                )
                              }
                              className="priority-select px-2 py-1 border rounded text-xs"
                            >
                              <option value="HIGH">Alta</option>
                              <option value="MEDIUM">Media</option>
                              <option value="LOW">Baja</option>
                            </select>
                            <div className="task-actions flex gap-1 ml-auto">
                              <button
                                onClick={() => startEdit(t)}
                                className="edit-btn text-blue-600 hover:text-blue-800"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => onDelete(t.id)}
                                className="delete-btn text-red-600 hover:text-red-800"
                              >
                                ❌
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </DraggableCard>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DroppableColumn>
    );
  };

  return (
    <div className="todo-container max-w-[1800px] mx-auto px-4">
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="kanban-board flex flex-nowrap justify-center gap-6">
          {renderColumn('Pendientes 🕒', 'PENDING')}
          {renderColumn('En Progreso 🔄', 'IN_PROGRESS')}
          {renderColumn('Completadas ✅', 'DONE')}
        </div>
      </DndContext>
    </div>
  );
}
