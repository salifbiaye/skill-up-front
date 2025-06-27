import { Task } from "@/types/tasks";

// Export des types pour la réutilisation
export type { Task };

// Export des constantes pour les priorités
export const TASK_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
} as const;

// Export des constantes pour les statuts
export const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed'
} as const; 