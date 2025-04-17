import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// PATCH: cambiar estado o prioridad
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    const body = await request.json();

    const dataToUpdate: any = {};

    // Cambiar estado si viene 'completed'
    if ('completed' in body) {
      dataToUpdate.status = body.completed ? 'DONE' : 'PENDING';
    }

    // Cambiar estado si viene explícitamente
    if ('status' in body && ['PENDING', 'IN_PROGRESS', 'DONE'].includes(body.status)) {
      dataToUpdate.status = body.status;
    }

    // Cambiar prioridad si viene
    if ('priority' in body && ['LOW', 'MEDIUM', 'HIGH'].includes(body.priority)) {
      dataToUpdate.priority = body.priority;
    }

    const updated = await prisma.todo.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('PATCH error:', error);
    return NextResponse.json({ error: 'Error al actualizar la tarea' }, { status: 500 });
  }
}

// PUT: actualizar el título
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    const { title } = await request.json();

    if (!title || typeof title !== 'string') {
      return NextResponse.json({ error: 'Título inválido' }, { status: 400 });
    }

    const updated = await prisma.todo.update({
      where: { id },
      data: { title },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ error: 'Error al actualizar el título' }, { status: 500 });
  }
}

// DELETE: eliminar tarea
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);

    await prisma.todo.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Tarea eliminada' });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ error: 'Error al eliminar tarea' }, { status: 404 });
  }
}
