export type Todo = {
  id: number;
  title: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: string;      // ISO string
  dueDate?: string | null; // <-- Fecha de vencimiento opcional
};
