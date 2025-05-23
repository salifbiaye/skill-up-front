"use client";

import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { Note, CreateNoteInput, UpdateNoteInput } from "@/types/notes";
import { NotesService } from "@/services/notes-service";

interface NotesContextType {
  notes: Note[];
  isLoading: boolean;
  error: string | null;
  fetchNotes: () => Promise<void>;
  getNoteById: (id: string) => Promise<Note | undefined>;
  createNote: (noteData: CreateNoteInput) => Promise<Note>;
  updateNote: (noteData: UpdateNoteInput) => Promise<Note>;
  deleteNote: (id: string) => Promise<boolean>;
  generateAiSummary: (id: string) => Promise<Note>;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export function NotesProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les notes au montage du composant
  useEffect(() => {
    fetchNotes();
  }, []);

  // Récupérer toutes les notes
  const fetchNotes = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await NotesService.getAllNotes();
      setNotes(data);
    } catch (err) {
      setError("Erreur lors du chargement des notes");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Récupérer une note par son ID
  const getNoteById = async (id: string) => {
    try {
      // D'abord, vérifier si la note est déjà dans le state
      const noteInState = notes.find(note => note.id === id);
      if (noteInState) {
        return noteInState;
      }
      
      // Sinon, récupérer la note depuis le service
      return await NotesService.getNoteById(id);
    } catch (err) {
      console.error("Erreur lors de la récupération de la note:", err);
      throw err;
    }
  };

  // Créer une nouvelle note
  const createNote = async (noteData: CreateNoteInput) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newNote = await NotesService.createNote(noteData);
      setNotes(prevNotes => [...prevNotes, newNote]);
      return newNote;
    } catch (err) {
      setError("Erreur lors de la création de la note");
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Mettre à jour une note existante
  const updateNote = async (noteData: UpdateNoteInput) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedNote = await NotesService.updateNote(noteData);
      setNotes(prevNotes => 
        prevNotes.map(note => 
          note.id === updatedNote.id ? updatedNote : note
        )
      );
      return updatedNote;
    } catch (err) {
      setError("Erreur lors de la mise à jour de la note");
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Supprimer une note
  const deleteNote = async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await NotesService.deleteNote(id);
      setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
      return true;
    } catch (err) {
      setError("Erreur lors de la suppression de la note");
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Générer un résumé IA pour une note
  const generateAiSummary = async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedNote = await NotesService.generateAiSummary(id);
      setNotes(prevNotes => 
        prevNotes.map(note => 
          note.id === updatedNote.id ? updatedNote : note
        )
      );
      return updatedNote;
    } catch (err) {
      setError("Erreur lors de la génération du résumé IA");
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    notes,
    isLoading,
    error,
    fetchNotes,
    getNoteById,
    createNote,
    updateNote,
    deleteNote,
    generateAiSummary
  };

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NotesContext);
  
  if (context === undefined) {
    throw new Error("useNotes doit être utilisé à l'intérieur d'un NotesProvider");
  }
  
  return context;
}
