"use client";

import { useNotesStore } from "@/stores";

// Créer un hook qui expose les mêmes fonctionnalités que le contexte mais en utilisant Zustand
export function useNotes() {
  const notes = useNotesStore(state => state.notes);
  const isLoading = useNotesStore(state => state.isLoading);
  const error = useNotesStore(state => state.error);
  const fetchNotes = useNotesStore(state => state.fetchNotes);
  const createNote = useNotesStore(state => state.createNote);
  const updateNote = useNotesStore(state => state.updateNote);
  const deleteNote = useNotesStore(state => state.deleteNote);
  const generateAiSummary = useNotesStore(state => state.generateAiSummary);
  
  return {
    notes,
    isLoading,
    error,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
    generateAiSummary
  };
}
