import { Objective } from "@/types/objectives";

// Export des types pour la réutilisation
export type { Objective };

// Export des constantes pour les priorités
export const OBJECTIVE_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
} as const;

// Export des constantes pour les statuts
export const OBJECTIVE_STATUS = {
  NOT_STARTED: 'not-started',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed'
} as const; 