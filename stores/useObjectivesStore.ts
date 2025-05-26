import { create } from 'zustand';
import { Objective, CreateObjectiveInput, UpdateObjectiveInput } from '@/types/objectives';
import { ObjectivesService } from '@/services/objectives-service';

interface ObjectivesState {
  objectives: Objective[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchObjectives: () => Promise<void>;
  createObjective: (objectiveData: CreateObjectiveInput) => Promise<{ success: boolean; data?: Objective; error?: string }>;
  updateObjective: (objectiveData: UpdateObjectiveInput) => Promise<{ success: boolean; data?: Objective; error?: string }>;
  deleteObjective: (id: string) => Promise<{ success: boolean; error?: string }>;
  updateProgress: (id: string, progress: number) => Promise<{ success: boolean; data?: Objective; error?: string }>;
  updateStatus: (id: string, status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED") => Promise<{ success: boolean; data?: Objective; error?: string }>;
}

export const useObjectivesStore = create<ObjectivesState>((set, get) => ({
  objectives: [],
  isLoading: false,
  error: null,

  fetchObjectives: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const data = await ObjectivesService.getAllObjectives();

      set({ objectives: data });
      // Ne pas retourner de données pour correspondre au type Promise<void>
    } catch (err) {
      const errorMessage = "Erreur lors du chargement des objectifs";

      set({ error: errorMessage });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  createObjective: async (objectiveData: CreateObjectiveInput) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await ObjectivesService.createObjective(objectiveData);
      
      if (result.success && result.data) {
        set(state => ({ objectives: [...state.objectives, result.data as Objective] }));
      } else if (result.error) {
        set({ error: result.error });
      }
      
      return result;
    } catch (err) {
      const errorMessage = "Erreur lors de la création de l'objectif";

      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      set({ isLoading: false });
    }
  },

  updateObjective: async (objectiveData: UpdateObjectiveInput) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await ObjectivesService.updateObjective(objectiveData);
      
      if (result.success && result.data) {
        set(state => ({
          objectives: state.objectives.map(objective => 
            objective.id === result.data?.id ? result.data : objective
          )
        }));
      } else if (result.error) {
        set({ error: result.error });
      }
      
      return result;
    } catch (err) {
      const errorMessage = "Erreur lors de la mise à jour de l'objectif";

      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      set({ isLoading: false });
    }
  },

  deleteObjective: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await ObjectivesService.deleteObjective(id);
      
      if (result.success) {
        set(state => ({
          objectives: state.objectives.filter(objective => objective.id !== id)
        }));
        return result;
      } else {
        const errorMessage = result.error || "Erreur lors de la suppression de l'objectif";
        set({ error: errorMessage });
        return result;
      }
    } catch (err) {
      const errorMessage = "Erreur lors de la suppression de l'objectif";

      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      set({ isLoading: false });
    }
  },

  updateProgress: async (id: string, progress: number) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await ObjectivesService.updateProgress(id, progress);
      
      if (result.success && result.data) {
        set(state => ({
          objectives: state.objectives.map(objective => 
            objective.id === id ? (result.data as Objective) : objective
          )
        }));
      } else if (result.error) {
        set({ error: result.error });
      }
      
      return result;
    } catch (err) {
      const errorMessage = "Erreur lors de la mise à jour de la progression";

      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      set({ isLoading: false });
    }
  },

  updateStatus: async (id: string, status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED") => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await ObjectivesService.updateStatus(id, status);
      
      if (result.success && result.data) {
        set(state => ({
          objectives: state.objectives.map(objective => 
            objective.id === id ? (result.data as Objective) : objective
          )
        }));
      } else if (result.error) {
        set({ error: result.error });
      }
      
      return result;
    } catch (err) {
      const errorMessage = "Erreur lors de la mise à jour du statut";

      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      set({ isLoading: false });
    }
  }
}));

