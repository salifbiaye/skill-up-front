export interface Objective {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  priority: "low" | "medium" | "high";
  progress: number;
  relatedTasks?: string[];
  completedTasks: number;
  totalTasks: number;
}

export interface CreateObjectiveInput {
  title: string;
  description: string;
  dueDate: string;
}

export interface UpdateObjectiveInput extends Partial<CreateObjectiveInput> {
  id: string;
  status?: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  progress?: number;
  relatedTasks?: string[];
}
