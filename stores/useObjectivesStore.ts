import { create } from 'zustand';
import { Objective, CreateObjectiveInput, UpdateObjectiveInput } from '@/types/objectives';
import { ObjectivesService } from '@/services/objectives-service';

interface ObjectivesState {
  objectives: Objective[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchObjectives: () => Promise<void>;
  createObjective: (objectiveData: CreateObjectiveInput) => Promise<Objective>;
  updateObjective: (objectiveData: UpdateObjectiveInput) => Promise<Objective>;
  deleteObjective: (id: string) => Promise<boolean>;
  updateProgress: (id: string, progress: number) => Promise<Objective>;
  updateStatus: (id: string, status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED") => Promise<Objective>;
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
      console.error(errorMessage, err);
      set({ error: errorMessage });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  createObjective: async (objectiveData: CreateObjectiveInput) => {
    set({ isLoading: true, error: null });
    
    try {
      const newObjective = await ObjectivesService.createObjective(objectiveData);
      set(state => ({ objectives: [...state.objectives, newObjective] }));
      return newObjective;
    } catch (err) {
      const errorMessage = "Erreur lors de la création de l'objectif";
      console.error(errorMessage, err);
      set({ error: errorMessage });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  updateObjective: async (objectiveData: UpdateObjectiveInput) => {
    set({ isLoading: true, error: null });
    
    try {
      const updatedObjective = await ObjectivesService.updateObjective(objectiveData);
      set(state => ({
        objectives: state.objectives.map(objective => 
          objective.id === updatedObjective.id ? updatedObjective : objective
        )
      }));
      return updatedObjective;
    } catch (err) {
      const errorMessage = "Erreur lors de la mise à jour de l'objectif";
      console.error(errorMessage, err);
      set({ error: errorMessage });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteObjective: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      await ObjectivesService.deleteObjective(id);
      set(state => ({
        objectives: state.objectives.filter(objective => objective.id !== id)
      }));
      return true;
    } catch (err) {
      const errorMessage = "Erreur lors de la suppression de l'objectif";
      console.error(errorMessage, err);
      set({ error: errorMessage });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  updateProgress: async (id: string, progress: number) => {
    set({ isLoading: true, error: null });
    
    try {
      const updatedObjective = await ObjectivesService.updateProgress(id, progress);
      set(state => ({
        objectives: state.objectives.map(objective => 
          objective.id === updatedObjective.id ? updatedObjective : objective
        )
      }));
      return updatedObjective;
    } catch (err) {
      const errorMessage = "Erreur lors de la mise à jour de la progression";
      console.error(errorMessage, err);
      set({ error: errorMessage });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  updateStatus: async (id: string, status: "not-started" | "in-progress" | "completed") => {
    set({ isLoading: true, error: null });
    
    try {
      const updatedObjective = await ObjectivesService.updateStatus(id, status);
      set(state => ({
        objectives: state.objectives.map(objective => 
          objective.id === updatedObjective.id ? updatedObjective : objective
        )
      }));
      return updatedObjective;
    } catch (err) {
      const errorMessage = "Erreur lors de la mise à jour du statut";
      console.error(errorMessage, err);
      set({ error: errorMessage });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  }
}));
