import { Objective, CreateObjectiveInput, UpdateObjectiveInput } from "@/types/objectives";
import { objectivesData } from "@/data/objectives-data";
import { API_CONFIG } from "@/config/api";


// Utiliser la configuration centralisée
const config = {
  useApi: API_CONFIG.useApi,
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
    if (config.useApi) {
      try {
        const response = await fetch(`/api/goals`,{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },

        } );

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des objectifs");
        }

        return response.json();
      } catch (error) {
        console.error("Erreur API:", error);
        return objectivesData; // Fallback aux données fictives en cas d'erreur
      }
    }

    // Utiliser les données fictives si l'API n'est pas activée
    return Promise.resolve(objectivesData);
  },

  /**
   * Récupère un objectif par son ID
   */
  async getObjectiveById(id: string): Promise<Objective | undefined> {
    if (config.useApi) {
      try {
        const response = await fetch(`/api/goals/${id}`);
        if (!response.ok) {
          console.error("Erreur lors de la récupération de l'objectif");
          // Fallback aux données fictives en cas d'erreur
          return objectivesData.find(objective => objective.id === id);
        }
        return await response.json();
      } catch (error) {
        console.error("Erreur API:", error);
        // Fallback aux données fictives en cas d'erreur
        return objectivesData.find(objective => objective.id === id);
      }
    }
    
    // Utiliser les données fictives si l'API n'est pas activée
    return Promise.resolve(objectivesData.find(objective => objective.id === id));
  },

  /**
   * Crée un nouvel objectif
   */
  async createObjective(objectiveData: CreateObjectiveInput): Promise<{ success: boolean; data?: Objective; error?: string }> {
    if (config.useApi) {
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
    }
    
    // Créer un objectif fictif avec un ID généré
    const newObjective: Objective = {
      id: Date.now().toString(),
      ...objectiveData,
      status: "NOT_STARTED",
      progress: 0,
      relatedTasks: [],
      completedTasks: 0,
      totalTasks: 0,
    };
    
    return {
      success: true,
      data: newObjective
    };
  },

  /**
   * Met à jour un objectif existant
   */
  async updateObjective(objectiveData: UpdateObjectiveInput): Promise<{ success: boolean; data?: Objective; error?: string }> {
    if (config.useApi) {
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
        // Vérifier si l'objectif existe
        const existingObjective = objectivesData.find(objective => objective.id === objectiveData.id);
        if (!existingObjective) {
          return {
            success: false,
            error: "Objectif non trouvé"
          };
        }
        
        return {
          success: false,
          error: "Erreur lors de la communication avec le serveur"
        };
      }
    }
    
    // Simuler une mise à jour avec les données fictives
    const existingObjective = objectivesData.find(objective => objective.id === objectiveData.id);
    if (!existingObjective) {
      return {
        success: false,
        error: "Objectif non trouvé"
      };
    }
    
    const updatedObjective = {
      ...existingObjective,
      ...objectiveData,
    };
    
    return {
      success: true,
      data: updatedObjective
    };
  },

  /**
   * Supprime un objectif
   */
  async deleteObjective(id: string): Promise<{ success: boolean; error?: string }> {
    // Vérifier si l'objectif est lié à des tâches
    const tasksService = await import('./tasks-service').then(module => module.TasksService);
    const linkedTasks = await tasksService.getTasksByObjective(id);
    
    if (linkedTasks && linkedTasks.length > 0) {
      return {
        success: false,
        error: "Impossible de supprimer cet objectif car il est lié à des tâches. Supprimez d'abord les tâches associées."
      };
    }
    
    if (config.useApi) {
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
    // Supprimer l'objectif des données fictives
    const index = objectivesData.findIndex(obj => obj.id === id);
    if (index !== -1) {
      objectivesData.splice(index, 1);
    }
    
    return { success: true };
  },

  /**
   * Met à jour la progression d'un objectif
   */
  async updateProgress(id: string, progress: number): Promise<{ success: boolean; data?: Objective; error?: string }> {
    if (config.useApi) {
      try {
        const response = await fetch(`/api/goals/${id}/progress?progress=${progress}`, {
          method: "PATCH",
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
        return this.updateObjective({ id, progress });
      }
    }
    
    return this.updateObjective({ id, progress });
  },

  /**
   * Met à jour le statut d'un objectif
   */
  async updateStatus(id: string, status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED"): Promise<{ success: boolean; data?: Objective; error?: string }> {
    if (config.useApi) {
      try {
        const response = await fetch(`/api/goals/${id}`, {
          method: "PATCH",
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
        return this.updateObjective({ id, status });
      }
    }
    
    return this.updateObjective({ id, status });
  },
};
