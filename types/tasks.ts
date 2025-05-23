export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: "TODO" | "IN_PROGRESS" | "COMPLETED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  goalId:String;
  objectiveTitle?: string;
  tags: string[];
}

export interface CreateTaskInput {
  title: string;
  description: string;
  dueDate: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  goalId: string;
  relatedObjective?: string;
  tags?: string[];
}

export interface UpdateTaskInput extends Partial<CreateTaskInput> {
  id: string;
  status?: "TODO" | "IN_PROGRESS" | "COMPLETED";
}
