export type Todo = {
    id: number;
    title: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'DONE';
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    createdAt: string; // Prisma lo devuelve como ISO string
  };
  