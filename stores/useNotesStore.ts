import { create } from 'zustand';
import { Note, CreateNoteInput, UpdateNoteInput } from '@/types/notes';
import { NotesService } from '@/services/notes-service';

interface NotesState {
  notes: Note[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchNotes: () => Promise<void>;
  getNoteById: (id: string) => Promise<Note | undefined>;
  createNote: (noteData: CreateNoteInput) => Promise<Note>;
  updateNote: (noteData: UpdateNoteInput) => Promise<Note>;
  deleteNote: (id: string) => Promise<boolean>;
  generateAiSummary: (id: string) => Promise<Note>;
}

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  isLoading: false,
  error: null,

  fetchNotes: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const data = await NotesService.getAllNotes();
      set({ notes: data });
      // Ne pas retourner de données pour correspondre au type Promise<void>
    } catch (err) {
      const errorMessage = "Erreur lors du chargement des notes";
      console.error(errorMessage, err);
      set({ error: errorMessage });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  getNoteById: async (id: string) => {
    try {
      // D'abord, vérifier si la note est déjà dans le state
      const noteInState = get().notes.find(note => note.id === id);
      if (noteInState) {
        return noteInState;
      }
      
      // Sinon, récupérer la note depuis le service
      return await NotesService.getNoteById(id);
    } catch (err) {
      console.error("Erreur lors de la récupération de la note:", err);
      throw err;
    }
  },

  createNote: async (noteData: CreateNoteInput) => {
    set({ isLoading: true, error: null });
    
    try {
      const newNote = await NotesService.createNote(noteData);
      set(state => ({ notes: [...state.notes, newNote] }));
      return newNote;
    } catch (err) {
      const errorMessage = "Erreur lors de la création de la note";
      console.error(errorMessage, err);
      set({ error: errorMessage });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  updateNote: async (noteData: UpdateNoteInput) => {
    set({ isLoading: true, error: null });
    
    try {
      const updatedNote = await NotesService.updateNote(noteData);
      set(state => ({
        notes: state.notes.map(note => 
          note.id === updatedNote.id ? updatedNote : note
        )
      }));
      return updatedNote;
    } catch (err) {
      const errorMessage = "Erreur lors de la mise à jour de la note";
      console.error(errorMessage, err);
      set({ error: errorMessage });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteNote: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      await NotesService.deleteNote(id);
      set(state => ({
        notes: state.notes.filter(note => note.id !== id)
      }));
      return true;
    } catch (err) {
      const errorMessage = "Erreur lors de la suppression de la note";
      console.error(errorMessage, err);
      set({ error: errorMessage });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  generateAiSummary: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const updatedNote = await NotesService.generateAiSummary(id);
      set(state => ({
        notes: state.notes.map(note => 
          note.id === updatedNote.id ? updatedNote : note
        )
      }));
      return updatedNote;
    } catch (err) {
      const errorMessage = "Erreur lors de la génération du résumé IA";
      console.error(errorMessage, err);
      set({ error: errorMessage });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  }
}));
