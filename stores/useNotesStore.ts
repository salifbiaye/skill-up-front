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
      const note = await NotesService.getNoteById(id);
      if (!note) {
        throw new Error("Note non trouvée");
      }
      return note;
    } catch (err) {
      console.error("Erreur lors de la récupération de la note:", err);
      // Utiliser les données fictives comme fallback
      const mockNotes = await NotesService.getAllNotes();
      const fallbackNote = mockNotes.find(note => note.id === id);
      if (fallbackNote) {
        return fallbackNote;
      }
      throw err;
    }
  },

  createNote: async (noteData: CreateNoteInput) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await NotesService.createNote(noteData);
      
      if (!response.success || !response.data) {
        throw new Error(response.error || "Erreur lors de la création de la note");
      }
      
      const newNote = response.data;
      
      set((state: NotesState) => ({
        notes: [...state.notes, newNote]
      }));
      
      return newNote;
    } catch (err) {
      const errorMessage = "Erreur lors de la création de la note";
      set({ error: errorMessage });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  updateNote: async (noteData: UpdateNoteInput) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await NotesService.updateNote(noteData);
      
      if (!response.success || !response.data) {
        throw new Error(response.error || "Erreur lors de la mise à jour de la note");
      }
      
      const updatedNote = response.data;
      
      set((state: NotesState) => ({
        notes: state.notes.map(note => 
          note.id === updatedNote.id ? updatedNote : note
        )
      }));
      
      return updatedNote;
    } catch (err) {
      const errorMessage = "Erreur lors de la mise à jour de la note";
      set({ error: errorMessage });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteNote: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await NotesService.deleteNote(id);
      
      if (!response.success) {
        throw new Error(response.error || "Erreur lors de la suppression de la note");
      }
      
      set((state: NotesState) => ({
        notes: state.notes.filter(note => note.id !== id)
      }));
      
      return true;
    } catch (err) {
      const errorMessage = "Erreur lors de la suppression de la note";
      set({ error: errorMessage });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  generateAiSummary: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await NotesService.generateAiSummary(id);
      
      // Define a type guard function to check if an object is a Note
      const isNote = (obj: any): obj is Note => {
        return obj && 
          typeof obj.id === 'string' &&
          typeof obj.title === 'string' &&
          typeof obj.content === 'string' &&
          typeof obj.createdAt === 'string' &&
          typeof obj.hasAiSummary === 'boolean';
      };
      
      // Extract the Note data from the response
      let noteData: Note;
      
      if ('success' in response && response.data && isNote(response.data)) {
        // If it's a response object with data property that is a Note
        noteData = response.data;
      } else if (isNote(response)) {
        // If the response itself is a Note
        noteData = response;
      } else {
        throw new Error('Invalid response format from generateAiSummary');
      }
      
      set((state: NotesState) => {
        return {
          notes: state.notes.map(note => 
            note.id === noteData.id ? { ...note, ...noteData } : note
          )
        };
      });
      return noteData;
    } catch (err) {
      const errorMessage = "Erreur lors de la génération du résumé IA";

      set({ error: errorMessage });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  }
}));
