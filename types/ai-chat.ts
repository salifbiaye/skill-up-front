export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  type?: "text" | "note" | "note-list";
  metadata?: {
    noteId?: string;
    noteTitle?: string;
    noteContent?: string;
    notes?: Array<{ id: string; title: string; content?: string }>;
    action?: "summarize" | "review" | "list";
  };
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateChatSessionInput {
  title: string;
  initialMessage?: string;
}

export interface UpdateChatSessionInput {
  id: string;
  title?: string;
}

export interface SendMessageInput {
  sessionId: string;
  content: string;
  type?: "text" | "note" | "note-list";
  metadata?: {
    noteId?: string;
    noteTitle?: string;
    noteContent?: string;
    notes?: Array<{ id: string; title: string; content?: string }>;
    action?: "summarize" | "review" | "list";
  };
}
