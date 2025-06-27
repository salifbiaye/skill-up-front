import { Objective, CreateObjectiveInput, UpdateObjectiveInput } from "@/types/objectives";
import { API_CONFIG } from "@/config/api";
import { OBJECTIVE_STATUS } from "@/data/objectives";
import {toast} from "sonner";

// Utiliser la configuration centralisée
const config = {
  baseUrl: API_CONFIG.baseUrl,
  endpoints: API_CONFIG.endpoints.objectives
};

/**
 * Service pour gérer les objectifs
 * Permet de basculer facilement entre les données fictives et l'API
 */
export const ObjectivesService = {
  /**
   * Récupère tous les objectifs
   */
  async getAllObjectives(): Promise<Objective[]> {
    try {
      const response = await fetch(`/api/goals`);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des objectifs");
      }
      return await response.json();
    } catch (error) {
      console.error("Erreur API:", error);
      return [];
    }
  },

  /**
   * Récupère un objectif par son ID
   */
  async getObjectiveById(id: string): Promise<Objective | undefined> {
    try {
      const response = await fetch(`/api/goals/${id}`);
      if (!response.ok) {
        throw new Error("Objectif non trouvé");
      }
      return await response.json();
    } catch (error) {
      console.error("Erreur API:", error);
      return undefined;
    }
  },

  /**
   * Crée un nouvel objectif
   */
  async createObjective(objectiveData: CreateObjectiveInput): Promise<{ success: boolean; data?: Objective; error?: string }> {
    try {
      const response = await fetch(`/api/goals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(objectiveData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || "Erreur lors de la création de l'objectif";
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
   * Met à jour un objectif existant
   */
  async updateObjective(objectiveData: UpdateObjectiveInput): Promise<{ success: boolean; data?: Objective; error?: string }> {
    try {
      const response = await fetch(`/api/goals/${objectiveData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(objectiveData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || "Erreur lors de la mise à jour de l'objectif";
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
   * Met à jour le statut d'un objectif
   */
  async updateStatus(id: string, status: keyof typeof OBJECTIVE_STATUS): Promise<{ success: boolean; data?: Objective; error?: string }> {
    try {
      const response = await fetch(`/api/goals/${id}/status`, {
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
   * Met à jour la progression d'un objectif
   */
  async updateProgress(id: string, progress: number): Promise<{ success: boolean; data?: Objective; error?: string }> {
    try {
      const response = await fetch(`/api/goals/${id}/progress`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ progress }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || "Erreur lors de la mise à jour de la progression";
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
   * Supprime un objectif
   */
  async deleteObjective(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`/api/goals/${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || "Erreur lors de la suppression de l'objectif";
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
