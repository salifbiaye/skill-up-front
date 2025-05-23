"use client";

import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { Objective, CreateObjectiveInput, UpdateObjectiveInput } from "@/types/objectives";
import { ObjectivesService } from "@/services/objectives-service";

interface ObjectivesContextType {
  objectives: Objective[];
  isLoading: boolean;
  error: string | null;
  fetchObjectives: () => Promise<void>;
  createObjective: (objectiveData: CreateObjectiveInput) => Promise<Objective>;
  updateObjective: (objectiveData: UpdateObjectiveInput) => Promise<Objective>;
  deleteObjective: (id: string) => Promise<boolean>;
  updateProgress: (id: string, progress: number) => Promise<Objective>;
  updateStatus: (id: string, status: "not-started" | "in-progress" | "completed") => Promise<Objective>;
}

const ObjectivesContext = createContext<ObjectivesContextType | undefined>(undefined);

export function ObjectivesProvider({ children }: { children: ReactNode }) {
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les objectifs au montage du composant
  useEffect(() => {
    fetchObjectives();
  }, []);

  // Récupérer tous les objectifs
  const fetchObjectives = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await ObjectivesService.getAllObjectives();
      setObjectives(data);
    } catch (err) {
      setError("Erreur lors du chargement des objectifs");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Créer un nouvel objectif
  const createObjective = async (objectiveData: CreateObjectiveInput) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newObjective = await ObjectivesService.createObjective(objectiveData);
      setObjectives(prevObjectives => [...prevObjectives, newObjective]);
      return newObjective;
    } catch (err) {
      setError("Erreur lors de la création de l'objectif");
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Mettre à jour un objectif existant
  const updateObjective = async (objectiveData: UpdateObjectiveInput) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedObjective = await ObjectivesService.updateObjective(objectiveData);
      setObjectives(prevObjectives => 
        prevObjectives.map(objective => 
          objective.id === updatedObjective.id ? updatedObjective : objective
        )
      );
      return updatedObjective;
    } catch (err) {
      setError("Erreur lors de la mise à jour de l'objectif");
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Supprimer un objectif
  const deleteObjective = async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await ObjectivesService.deleteObjective(id);
      setObjectives(prevObjectives => prevObjectives.filter(objective => objective.id !== id));
      return true;
    } catch (err) {
      setError("Erreur lors de la suppression de l'objectif");
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Mettre à jour la progression d'un objectif
  const updateProgress = async (id: string, progress: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedObjective = await ObjectivesService.updateProgress(id, progress);
      setObjectives(prevObjectives => 
        prevObjectives.map(objective => 
          objective.id === updatedObjective.id ? updatedObjective : objective
        )
      );
      return updatedObjective;
    } catch (err) {
      setError("Erreur lors de la mise à jour de la progression");
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Mettre à jour le statut d'un objectif
  const updateStatus = async (id: string, status: "not-started" | "in-progress" | "completed") => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedObjective = await ObjectivesService.updateStatus(id, status);
      setObjectives(prevObjectives => 
        prevObjectives.map(objective => 
          objective.id === updatedObjective.id ? updatedObjective : objective
        )
      );
      return updatedObjective;
    } catch (err) {
      setError("Erreur lors de la mise à jour du statut");
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    objectives,
    isLoading,
    error,
    fetchObjectives,
    createObjective,
    updateObjective,
    deleteObjective,
    updateProgress,
    updateStatus
  };

  return (
    <ObjectivesContext.Provider value={value}>
      {children}
    </ObjectivesContext.Provider>
  );
}

export function useObjectives() {
  const context = useContext(ObjectivesContext);
  
  if (context === undefined) {
    throw new Error("useObjectives doit être utilisé à l'intérieur d'un ObjectivesProvider");
  }
  
  return context;
}
