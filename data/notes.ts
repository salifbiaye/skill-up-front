import { Note } from "@/types/notes";

// Export des types pour la réutilisation
export type { Note };

// Export des constantes pour les statuts
export const NOTE_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived'
} as const;

// Export des constantes pour les types de contenu
export const NOTE_CONTENT_TYPES = {
  TEXT: 'text',
  MARKDOWN: 'markdown',
  CODE: 'code'
} as const; 