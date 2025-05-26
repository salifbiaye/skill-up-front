export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  hasAiSummary: boolean;
  goalId?: string;
  taskId?: string;
  relatedTaskTitle?: string;
  tags?: string[];
  category?: string;
}

export interface CreateNoteInput {
  title: string;
  content: string;
  goalId?: string;
  taskId?: string;
}

export interface UpdateNoteInput extends Partial<CreateNoteInput> {
  id: string;
}
