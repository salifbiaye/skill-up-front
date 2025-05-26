import { Task, CreateTaskInput, UpdateTaskInput } from "@/types/tasks";
import { tasksData } from "@/data/tasks-data";
import { API_CONFIG } from "@/config/api";

// Utiliser la configuration centralisée
const config = {
  useApi: API_CONFIG.useApi,
  baseUrl: API_CONFIG.baseUrl,
  endpoints: API_CONFIG.endpoints.tasks
};

/**
 * Service pour gérer les tâches
 * Permet de basculer facilement entre les données fictives et l'API
 */
export const TasksService = {
  /**
   * Récupère toutes les tâches
   */
  async getAllTasks(): Promise<Task[]> {
    if (config.useApi) {
      try {
        const response = await fetch(`/api/tasks`);
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des tâches");
        }
        return await response.json();
      } catch (error) {
        console.error("Erreur API:", error);
        return tasksData; // Fallback aux données fictives en cas d'erreur
      }
    }
    
    // Utiliser les données fictives si l'API n'est pas activée
    return Promise.resolve(tasksData);
  },

  /**
   * Récupère une tâche par son ID
   */
  async getTaskById(id: string): Promise<Task | undefined> {
    if (config.useApi) {
      try {
        const response = await fetch(`/api/tasks/${id}`);
        if (!response.ok) {
          console.error("Erreur lors de la récupération de la tâche");
          // Fallback aux données fictives en cas d'erreur
          return tasksData.find(task => task.id === id);
        }
        return await response.json();
      } catch (error) {
        console.error("Erreur API:", error);
        // Fallback aux données fictives en cas d'erreur
        return tasksData.find(task => task.id === id);
      }
    }
    
    // Utiliser les données fictives si l'API n'est pas activée
    return Promise.resolve(tasksData.find(task => task.id === id));
  },

  /**
   * Récupère les tâches liées à un objectif
   */
  async getTasksByObjective(objectiveId: string): Promise<Task[]> {
    if (config.useApi) {
      try {
        const response = await fetch(`/api/tasks?objectiveId=${objectiveId}`);
        if (!response.ok) {
          console.error("Erreur lors de la récupération des tâches liées à l'objectif");
          // Fallback aux données fictives en cas d'erreur
          return tasksData.filter(task => task.goalId === objectiveId);
        }
        return await response.json();
      } catch (error) {
        console.error("Erreur API:", error);
        // Fallback aux données fictives en cas d'erreur
        return tasksData.filter(task => task.objectiveTitle === objectiveId);
      }
    }
    
    // Utiliser les données fictives si l'API n'est pas activée
    return Promise.resolve(tasksData.filter(task => task.objectiveTitle === objectiveId));
  },

  /**
   * Vérifie si un objectif existe
   */
  async objectiveExists(goalId: string): Promise<boolean> {
    if (!goalId) return true; // Si pas de goalId, on considère que c'est valide
    
    try {
      // Utiliser le service des objectifs pour vérifier si l'objectif existe
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
    
    if (config.useApi) {
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
    }
    
    // Créer une tâche fictive avec un ID généré
    const newTask: Task = {
      id: Date.now().toString(),
      title: taskData.title,
      description: taskData.description,
      dueDate: taskData.dueDate,
      priority: taskData.priority,
      goalId: taskData.goalId || "",
      objectiveTitle: taskData.relatedObjective, // Utiliser objectiveTitle au lieu de relatedObjective
      tags: taskData.tags || [],
      status: "TODO",
    };
    
    return {
      success: true,
      data: newTask
    };
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
    
    if (config.useApi) {
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
    }
    
    // Simuler une mise à jour avec les données fictives
    const existingTask = tasksData.find(task => task.id === taskData.id);
    if (!existingTask) {
      return {
        success: false,
        error: "Tâche non trouvée"
      };
    }
    
    const updatedTask = {
      ...existingTask,
      ...taskData,
    };
    
    return {
      success: true,
      data: updatedTask
    };
  },

  /**
   * Met à jour le statut d'une tâche
   */
  async updateStatus(id: string, status: "TODO" | "IN_PROGRESS" | "COMPLETED"): Promise<{ success: boolean; data?: Task; error?: string }> {
    if (config.useApi) {
      try {
        const response = await fetch(`/api/tasks/${id}/status`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage = errorData.message || "Erreur lors de la mise à jour du statut de la tâche";
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

    // Simuler une mise à jour de statut avec les données fictives
    const existingTask = tasksData.find(task => task.id === id);
    if (!existingTask) {
      return {
        success: false,
        error: "Tâche non trouvée"
      };
    }

    const updatedTask = {
      ...existingTask,
      status,
    };

    return {
      success: true,
      data: updatedTask
    };
  },

  /**
   * Supprime une tâche
   */
  async deleteTask(id: string): Promise<{ success: boolean; error?: string }> {
    
    if (config.useApi) {
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


};
