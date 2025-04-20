import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  const { dueDate } = await request.json();

  if (!dueDate || isNaN(Date.parse(dueDate))) {
    return NextResponse.json({ error: 'Fecha inválida' }, { status: 400 });
  }

  try {
    const updated = await prisma.todo.update({
      where: { id },
      data: {
        dueDate: new Date(dueDate), // ← aquí sí existe dueDate
      },
    });
    return NextResponse.json(updated);
  } catch (e) {
    console.error('PATCH dueDate error:', e);
    return NextResponse.json({ error: 'No se pudo actualizar la fecha' }, { status: 500 });
  }
}
