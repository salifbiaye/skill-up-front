import { Note, CreateNoteInput, UpdateNoteInput } from "@/types/notes";
import { API_CONFIG } from "@/config/api";
import { NOTE_STATUS } from "@/data/notes";

// Utiliser la configuration centralisée
const config = {
  baseUrl: API_CONFIG.baseUrl,
  endpoints: API_CONFIG.endpoints.notes
};

/**
 * Service pour gérer les notes
 */
export const NotesService = {
  /**
   * Récupère toutes les notes
   */
  async getAllNotes(): Promise<Note[]> {
    try {
      const response = await fetch(`/api/notes`);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des notes");
      }
      return await response.json();
    } catch (error) {
      console.error("Erreur API:", error);
      return [];
    }
  },

  /**
   * Récupère une note par son ID
   */
  async getNoteById(id: string): Promise<Note | undefined> {
    try {
      const response = await fetch(`/api/notes/${id}`);
      if (!response.ok) {
        throw new Error("Note non trouvée");
      }
      return await response.json();
    } catch (error) {
      console.error("Erreur API:", error);
      return undefined;
    }
  },

  /**
   * Crée une nouvelle note
   */
  async createNote(noteData: CreateNoteInput): Promise<{ success: boolean; data?: Note; error?: string }> {
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
  },

  /**
   * Met à jour une note existante
   */
  async updateNote(noteData: UpdateNoteInput): Promise<{ success: boolean; data?: Note; error?: string }> {
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
      return {
        success: false,
        error: "Erreur lors de la communication avec le serveur"
      };
    }
  },

  /**
   * Met à jour le statut d'une note
   */
  async updateStatus(id: string, status: keyof typeof NOTE_STATUS): Promise<{ success: boolean; data?: Note; error?: string }> {
    try {
      const response = await fetch(`/api/notes/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || "Erreur lors de la mise à jour du statut";
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
  },

  /**
   * Supprime une note
   */
  async deleteNote(id: string): Promise<{ success: boolean; error?: string }> {
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
      
      return {
        success: true
      };
    } catch (error) {
      console.error("Erreur API:", error);
      return {
        success: false,
        error: "Erreur lors de la communication avec le serveur"
      };
    }
  }
};
