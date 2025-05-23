import { Note, CreateNoteInput, UpdateNoteInput } from "@/types/notes";
import { notesData } from "@/data/notes-data";
import { API_CONFIG } from "@/config/api";

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
          throw new Error("Erreur lors de la récupération des notes");
        }
        return await response.json();
      } catch (error) {
        console.error("Erreur API:", error);
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
          throw new Error("Erreur lors de la récupération de la note");
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
  async createNote(noteData: CreateNoteInput): Promise<Note> {
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
          throw new Error("Erreur lors de la création de la note");
        }
        
        return await response.json();
      } catch (error) {
        console.error("Erreur API:", error);
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
        return newNote;
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
    
    return Promise.resolve(newNote);
  },

  /**
   * Met à jour une note existante
   */
  async updateNote(noteData: UpdateNoteInput): Promise<Note> {
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
          throw new Error("Erreur lors de la mise à jour de la note");
        }
        
        return await response.json();
      } catch (error) {
        console.error("Erreur API:", error);
        // Simuler une mise à jour avec les données fictives
        const existingNote = notesData.find(note => note.id === noteData.id);
        if (!existingNote) {
          throw new Error("Note non trouvée");
        }
        
        return {
          ...existingNote,
          ...noteData,
        };
      }
    }
    
    // Simuler une mise à jour avec les données fictives
    const existingNote = notesData.find(note => note.id === noteData.id);
    if (!existingNote) {
      throw new Error("Note non trouvée");
    }
    
    return Promise.resolve({
      ...existingNote,
      ...noteData,
    });
  },

  /**
   * Supprime une note
   */
  async deleteNote(id: string): Promise<boolean> {
    if (config.useApi) {
      try {
        const response = await fetch(`/api/notes/${id}`, {
          method: "DELETE",
        });
        
        if (!response.ok) {
          throw new Error("Erreur lors de la suppression de la note");
        }
        
        return true;
      } catch (error) {
        console.error("Erreur API:", error);
        return true; // Simuler une suppression réussie
      }
    }
    
    // Simuler une suppression réussie
    return Promise.resolve(true);
  },

  /**
   * Génère un résumé IA pour une note
   */
  async generateAiSummary(id: string): Promise<Note> {
    if (config.useApi) {
      try {
        const response = await fetch(`${config.baseUrl}${config.endpoints.aiSummary(id)}`, {
          method: "POST",
        });
        
        if (!response.ok) {
          throw new Error("Erreur lors de la génération du résumé IA");
        }
        
        return await response.json();
      } catch (error) {
        console.error("Erreur API:", error);
        // Simuler une mise à jour avec les données fictives
        const existingNote = notesData.find(note => note.id === id);
        if (!existingNote) {
          throw new Error("Note non trouvée");
        }
        
        return {
          ...existingNote,
          hasAiSummary: true,
        };
      }
    }
    
    // Simuler une mise à jour avec les données fictives
    const existingNote = notesData.find(note => note.id === id);
    if (!existingNote) {
      throw new Error("Note non trouvée");
    }
    
    return Promise.resolve({
      ...existingNote,
      hasAiSummary: true,
    });
  },
};
