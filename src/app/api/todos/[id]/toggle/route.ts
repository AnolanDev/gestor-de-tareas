import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// PATCH: cambiar el estado de completado de la tarea
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const { completed } = await request.json();

    const updated = await prisma.todo.update({
      where: { id },
      data: {
        status: completed ? 'DONE' : 'PENDING',
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error al cambiar completado:', error);
    return NextResponse.json({ error: 'Error al actualizar tarea' }, { status: 500 });
  }
}
