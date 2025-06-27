import { ChatSession, ChatMessage } from "@/types/ai-chat";

// Export des types pour la réutilisation
export type { ChatSession, ChatMessage };

// Export des constantes pour les rôles
export const CHAT_ROLES = {
  ASSISTANT: 'assistant',
  USER: 'user'
} as const;

// Export des constantes pour les statuts
export const CHAT_STATUS = {
  ACTIVE: 'active',
  ARCHIVED: 'archived',
  DELETED: 'deleted'
} as const; 