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
          throw new Error("Erreur lors de la récupération de la tâche");
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
          throw new Error("Erreur lors de la récupération des tâches liées à l'objectif");
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
   * Crée une nouvelle tâche
   */
  async createTask(taskData: CreateTaskInput): Promise<Task> {
    console.log("Création d'une tâche avec les données:", taskData); // Debugging line
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
          throw new Error("Erreur lors de la création de la tâche");
        }
        
        return await response.json();
      } catch (error) {
        console.error("Erreur API:", error);
        // Créer une tâche fictive avec un ID généré
        const newTask: Task = {
          id: Date.now().toString(),
          ...taskData,
          status: "TODO",
        };
        return newTask;
      }
    }
    
    // Créer une tâche fictive avec un ID généré
    const newTask: Task = {
      id: Date.now().toString(),
      ...taskData,
      status: "TODO",
    };
    
    return Promise.resolve(newTask);
  },

  /**
   * Met à jour une tâche existante
   */
  async updateTask(taskData: UpdateTaskInput): Promise<Task> {
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
          throw new Error("Erreur lors de la mise à jour de la tâche");
        }
        
        return await response.json();
      } catch (error) {
        console.error("Erreur API:", error);
        // Simuler une mise à jour avec les données fictives
        const existingTask = tasksData.find(task => task.id === taskData.id);
        if (!existingTask) {
          throw new Error("Tâche non trouvée");
        }
        
        return {
          ...existingTask,
          ...taskData,
        };
      }
    }
    
    // Simuler une mise à jour avec les données fictives
    const existingTask = tasksData.find(task => task.id === taskData.id);
    if (!existingTask) {
      throw new Error("Tâche non trouvée");
    }
    
    return Promise.resolve({
      ...existingTask,
      ...taskData,
    });
  },

  /**
   * Supprime une tâche
   */
  async deleteTask(id: string): Promise<boolean> {
    if (config.useApi) {
      try {
        const response = await fetch(`/api/tasks/${id}`, {
          method: "DELETE",
        });
        
        if (!response.ok) {
          throw new Error("Erreur lors de la suppression de la tâche");
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
   * Met à jour le statut d'une tâche
   */
  async updateStatus(id: string, status: "TODO" | "IN_PROGRESS" | "COMPLETED"): Promise<Task> {
    if (config.useApi) {
      try {
        const response = await fetch(`/api/tasks/${id}/status?status=${status}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        });
        
        if (!response.ok) {
          throw new Error("Erreur lors de la mise à jour du statut");
        }
        
        return await response.json();
      } catch (error) {
        console.error("Erreur API:", error);

      }
    }
    
    return this.updateTask({ id,});
  },
};
