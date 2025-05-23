export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  hasAiSummary: boolean;
  relatedObjective?: string;
  relatedTaskId?: string;
  relatedTaskTitle?: string;
}

export interface CreateNoteInput {
  title: string;
  content: string;
  relatedObjective?: string;
  relatedTaskId?: string;
}

export interface UpdateNoteInput extends Partial<CreateNoteInput> {
  id: string;
}
