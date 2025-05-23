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
          throw new Error("Erreur lors de la récupération de l'objectif");
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
  async createObjective(objectiveData: CreateObjectiveInput): Promise<Objective> {
    if (config.useApi) {
      console.log("Création d'un objectif avec les données:", objectiveData); // Debugging line
      try {
        const response = await fetch(`/api/goals`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(objectiveData),
        });
        
        if (!response.ok) {
          throw new Error("Erreur lors de la création de l'objectif");
        }
        
        return await response.json();
      } catch (error) {
        console.error("Erreur API:", error);
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
        return newObjective;
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
    
    return Promise.resolve(newObjective);
  },

  /**
   * Met à jour un objectif existant
   */
  async updateObjective(objectiveData: UpdateObjectiveInput): Promise<Objective> {
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
          throw new Error("Erreur lors de la mise à jour de l'objectif");
        }
        
        return await response.json();
      } catch (error) {
        console.error("Erreur API:", error);
        // Simuler une mise à jour avec les données fictives
        const existingObjective = objectivesData.find(objective => objective.id === objectiveData.id);
        if (!existingObjective) {
          throw new Error("Objectif non trouvé");
        }
        
        return {
          ...existingObjective,
          ...objectiveData,
        };
      }
    }
    
    // Simuler une mise à jour avec les données fictives
    const existingObjective = objectivesData.find(objective => objective.id === objectiveData.id);
    if (!existingObjective) {
      throw new Error("Objectif non trouvé");
    }
    
    return Promise.resolve({
      ...existingObjective,
      ...objectiveData,
    });
  },

  /**
   * Supprime un objectif
   */
  async deleteObjective(id: string): Promise<boolean> {
    if (config.useApi) {
      try {
        const response = await fetch(`/api/goals/${id}`, {
          method: "DELETE",
        });
        
        if (!response.ok) {
          throw new Error("Erreur lors de la suppression de l'objectif");
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
   * Met à jour la progression d'un objectif
   */
  async updateProgress(id: string, progress: number): Promise<Objective> {
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
          throw new Error("Erreur lors de la mise à jour de la progression");
        }
        
        return await response.json();
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
  async updateStatus(id: string, status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED"): Promise<Objective> {
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
          throw new Error("Erreur lors de la mise à jour du statut");
        }
        
        return await response.json();
      } catch (error) {
        console.error("Erreur API:", error);
        return this.updateObjective({ id, status });
      }
    }
    
    return this.updateObjective({ id, status });
  },
};
