"use client";

import { NoteModal } from "./note-modal";
import { CreateNoteInput, Note, UpdateNoteInput } from "@/types/notes";

// Composant client qui encapsule le modal pour gérer les fonctions de callback
interface NoteModalClientProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateNoteInput | UpdateNoteInput) => Promise<void>;
  note?: Note;
  title: string;
}

export function NoteModalClient({ isOpen, onClose, onSubmit, note, title }: NoteModalClientProps) {
  return (
    <NoteModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      note={note}
      title={title}
    />
  );
}
