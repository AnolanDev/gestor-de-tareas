import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { Status, Priority } from '@prisma/client'; // 👈 Asegúrate de importar los enums

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as Status | 'ALL' | null;
    const priority = searchParams.get('priority') as Priority | 'ALL' | null;
    const search = searchParams.get('search');

    const where: any = {}; // Usamos 'any' para construir el objeto dinámicamente

    if (status && status !== 'ALL') {
      where.status = status as Status;
    }

    if (priority && priority !== 'ALL') {
      where.priority = priority as Priority;
    }

    if (search) {
      where.title = {
        contains: search,
        mode: 'insensitive',
      };
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


// POST: crear nueva tarea
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
      },
    });

    return NextResponse.json(newTodo);
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: 'Error al crear tarea' }, { status: 500 });
  }
}
