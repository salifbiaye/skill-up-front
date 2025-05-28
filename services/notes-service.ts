import { Note, CreateNoteInput, UpdateNoteInput } from "@/types/notes";
import { notesData } from "@/data/notes-data";
import { API_CONFIG } from "@/config/api";
import {toast} from "sonner";

// Utiliser la configuration centralisée
const config = {
  useApi: API_CONFIG.useApi,
  baseUrl: API_CONFIG.baseUrl,
  endpoints: API_CONFIG.endpoints.notes
};

/**
 * Service pour gérer les notes
 * Permet de basculer facilement entre les données fictives et l'API
 */
export const NotesService = {
  /**
   * Récupère toutes les notes
   */
  async getAllNotes(): Promise<Note[]> {
    if (config.useApi) {
      try {
        const response = await fetch(`/api/notes`,{
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
         toast.error("Erreur lors de la récupération des notes");
        }
        return await response.json();
      } catch (error) {
        return notesData; // Fallback aux données fictives en cas d'erreur
      }
    }
    
    // Utiliser les données fictives si l'API n'est pas activée
    return Promise.resolve(notesData);
  },

  /**
   * Récupère une note par son ID
   */
  async getNoteById(id: string): Promise<Note | undefined> {
    if (config.useApi) {
      try {
        const response = await fetch(`/api/notes/${id}`,{
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          toast.error("Erreur lors de la récupération de la note");
          // Fallback aux données fictives en cas d'erreur
          return notesData.find(note => note.id === id);
        }
        return await response.json();
      } catch (error) {
        console.error("Erreur API:", error);
        // Fallback aux données fictives en cas d'erreur
        return notesData.find(note => note.id === id);
      }
    }
    
    // Utiliser les données fictives si l'API n'est pas activée
    return Promise.resolve(notesData.find(note => note.id === id));
  },

  /**
   * Crée une nouvelle note
   */
  async createNote(noteData: CreateNoteInput): Promise<{ success: boolean; data?: Note; error?: string }> {
    if (config.useApi) {
      try {
        const response = await fetch(`/api/notes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(noteData),
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage = errorData.message || "Erreur lors de la création de la note";
          return {
            success: false,
            error: errorMessage
          };
        }
        
        const data = await response.json();
        return {
          success: true,
          data
        };
      } catch (error) {
        console.error("Erreur API:", error);
        return {
          success: false,
          error: "Erreur lors de la communication avec le serveur"
        };
      }
    }
    
    // Créer une note fictive avec un ID généré
    const newNote: Note = {
      id: Date.now().toString(),
      ...noteData,
      createdAt: new Date().toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      hasAiSummary: false,
    };
    
    return {
      success: true,
      data: newNote
    };
  },

  /**
   * Met à jour une note existante
   */
  async updateNote(noteData: UpdateNoteInput): Promise<{ success: boolean; data?: Note; error?: string }> {
    if (config.useApi) {
      try {
        const response = await fetch(`/api/notes/${noteData.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(noteData),
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage = errorData.message || "Erreur lors de la mise à jour de la note";
          return {
            success: false,
            error: errorMessage
          };
        }
        
        const data = await response.json();
        return {
          success: true,
          data
        };
      } catch (error) {
        console.error("Erreur API:", error);
        // Vérifier si la note existe
        const existingNote = notesData.find(note => note.id === noteData.id);
        if (!existingNote) {
          return {
            success: false,
            error: "Note non trouvée"
          };
        }
        
        return {
          success: false,
          error: "Erreur lors de la communication avec le serveur"
        };
      }
    }
    
    // Simuler une mise à jour avec les données fictives
    const existingNote = notesData.find(note => note.id === noteData.id);
    if (!existingNote) {
      return {
        success: false,
        error: "Note non trouvée"
      };
    }
    
    const updatedNote = {
      ...existingNote,
      ...noteData,
    };
    
    return {
      success: true,
      data: updatedNote
    };
  },

  /**
   * Supprime une note
   */
  async deleteNote(id: string): Promise<{ success: boolean; error?: string }> {
    
    if (config.useApi) {
      try {
        const response = await fetch(`/api/notes/${id}`, {
          method: "DELETE",
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage = errorData.message || "Erreur lors de la suppression de la note";
          return {
            success: false,
            error: errorMessage
          };
        }
        
        return { success: true };
      } catch (error) {
        console.error("Erreur API:", error);
        return {
          success: false,
          error: "Erreur lors de la communication avec le serveur"
        };
      }
    }
    
    // Simuler une suppression réussie avec les données fictives
    return { success: true };
  },

  /**
   * Génère un résumé IA pour une note
   */
  async generateAiSummary(id: string): Promise<{ success: boolean; data?: Note; error?: string }> {
    
    if (config.useApi) {
      try {
        const response = await fetch(`${config.baseUrl}${config.endpoints.aiSummary(id)}`, {
          method: "POST",
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage = errorData.message || "Erreur lors de la génération du résumé IA";
          return {
            success: false,
            error: errorMessage
          };
        }
        
        const data = await response.json();
        return {
          success: true,
          data
        };
      } catch (error) {
        console.error("Erreur API:", error);
        return {
          success: false,
          error: "Erreur lors de la communication avec le serveur"
        };
      }
    }
    
    // Simuler une mise à jour avec les données fictives
    const existingNote = notesData.find(note => note.id === id);
    if (!existingNote) {
      return {
        success: false,
        error: "Note non trouvée"
      };
    }
    
    const updatedNote = {
      ...existingNote,
      hasAiSummary: true,
    };
    
    return {
      success: true,
      data: updatedNote
    };
  },
};
