import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { Status, Priority } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as Status | 'ALL' | null;
    const priority = searchParams.get('priority') as Priority | 'ALL' | null;
    const query = searchParams.get('query');

    const where: any = {};
    if (status && status !== 'ALL')    where.status   = status;
    if (priority && priority !== 'ALL') where.priority = priority;
    if (query) {
      where.title = { contains: query, mode: 'insensitive' };
    }

    const todos = await prisma.todo.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(todos);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Error al obtener tareas' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title } = await request.json();
    if (!title || typeof title !== 'string') {
      return NextResponse.json({ error: 'Título inválido' }, { status: 400 });
    }

    const newTodo = await prisma.todo.create({
      data: {
        title,
        status: 'PENDING',
        priority: 'MEDIUM',
        // dueDate se añadirá más adelante en otra ruta PATCH
      },
    });

    return NextResponse.json(newTodo);
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: 'Error al crear tarea' }, { status: 500 });
  }
}
