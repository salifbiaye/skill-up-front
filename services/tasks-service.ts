import { Task, CreateTaskInput, UpdateTaskInput } from "@/types/tasks";
import { API_CONFIG } from "@/config/api";
import { TASK_STATUS } from "@/data/tasks";

// Utiliser la configuration centralisée
const config = {
  baseUrl: API_CONFIG.baseUrl,
  endpoints: API_CONFIG.endpoints.tasks
};

/**
 * Service pour gérer les tâches
 */
export const TasksService = {
  /**
   * Récupère toutes les tâches
   */
  async getAllTasks(): Promise<Task[]> {
    try {
      const response = await fetch(`/api/tasks`);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des tâches");
      }
      return await response.json();
    } catch (error) {
      console.error("Erreur API:", error);
      return [];
    }
  },

  /**
   * Récupère une tâche par son ID
   */
  async getTaskById(id: string): Promise<Task | undefined> {
    try {
      const response = await fetch(`/api/tasks/${id}`);
      if (!response.ok) {
        throw new Error("Tâche non trouvée");
      }
      return await response.json();
    } catch (error) {
      console.error("Erreur API:", error);
      return undefined;
    }
  },

  /**
   * Récupère les tâches liées à un objectif
   */
  async getTasksByObjective(objectiveId: string): Promise<Task[]> {
    try {
      const response = await fetch(`/api/tasks/goal/${objectiveId}`);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des tâches liées à l'objectif");
      }
      return await response.json();
    } catch (error) {
      console.error("Erreur API:", error);
      return [];
    }
  },

  /**
   * Vérifie si un objectif existe
   */
  async objectiveExists(goalId: string): Promise<boolean> {
    if (!goalId) return true; // Si pas de goalId, on considère que c'est valide
    
    try {
      const response = await fetch(`/api/goals/${goalId}`);
      return response.ok;
    } catch (error) {
      console.error("Erreur lors de la vérification de l'objectif:", error);
      return false;
    }
  },

  /**
   * Crée une nouvelle tâche
   */
  async createTask(taskData: CreateTaskInput): Promise<{ success: boolean; data?: Task; error?: string }> {
    // Vérifier si le goalId existe si présent
    if (taskData.goalId) {
      const goalExists = await this.objectiveExists(taskData.goalId);
      if (!goalExists) {
        return {
          success: false,
          error: "L'objectif associé n'existe pas. Impossible de créer la tâche."
        };
      }
    }
    
    try {
      const response = await fetch(`/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || "Erreur lors de la création de la tâche";
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
   * Met à jour une tâche existante
   */
  async updateTask(taskData: UpdateTaskInput): Promise<{ success: boolean; data?: Task; error?: string }> {
    // Vérifier si le goalId existe si présent et modifié
    if (taskData.goalId) {
      const goalExists = await this.objectiveExists(taskData.goalId);
      if (!goalExists) {
        return {
          success: false,
          error: "L'objectif associé n'existe pas. Impossible de mettre à jour la tâche."
        };
      }
    }
    
    try {
      const response = await fetch(`/api/tasks/${taskData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || "Erreur lors de la mise à jour de la tâche";
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
   * Met à jour le statut d'une tâche
   */
  async updateStatus(id: string, status: keyof typeof TASK_STATUS): Promise<{ success: boolean; data?: Task; error?: string }> {
    try {
      const response = await fetch(`/api/tasks/${id}/status`, {
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
   * Supprime une tâche
   */
  async deleteTask(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || "Erreur lors de la suppression de la tâche";
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
