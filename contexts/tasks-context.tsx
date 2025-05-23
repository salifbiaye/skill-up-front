"use client";

import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { Task, CreateTaskInput, UpdateTaskInput } from "@/types/tasks";
import { TasksService } from "@/services/tasks-service";

interface TasksContextType {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  getTasksByObjective: (objectiveId: string) => Promise<Task[]>;
  createTask: (taskData: CreateTaskInput) => Promise<Task>;
  updateTask: (taskData: UpdateTaskInput) => Promise<Task>;
  deleteTask: (id: string) => Promise<boolean>;
  updateStatus: (id: string, status: "todo" | "in-progress" | "completed") => Promise<Task>;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les tâches au montage du composant
  useEffect(() => {
    fetchTasks();
  }, []);

  // Récupérer toutes les tâches
  const fetchTasks = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await TasksService.getAllTasks();
      setTasks(data);
    } catch (err) {
      setError("Erreur lors du chargement des tâches");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Récupérer les tâches liées à un objectif
  const getTasksByObjective = async (objectiveId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await TasksService.getTasksByObjective(objectiveId);
      return data;
    } catch (err) {
      setError("Erreur lors du chargement des tâches liées à l'objectif");
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Créer une nouvelle tâche
  const createTask = async (taskData: CreateTaskInput) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newTask = await TasksService.createTask(taskData);
      setTasks(prevTasks => [...prevTasks, newTask]);
      return newTask;
    } catch (err) {
      setError("Erreur lors de la création de la tâche");
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Mettre à jour une tâche existante
  const updateTask = async (taskData: UpdateTaskInput) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedTask = await TasksService.updateTask(taskData);
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === updatedTask.id ? updatedTask : task
        )
      );
      return updatedTask;
    } catch (err) {
      setError("Erreur lors de la mise à jour de la tâche");
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Supprimer une tâche
  const deleteTask = async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await TasksService.deleteTask(id);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
      return true;
    } catch (err) {
      setError("Erreur lors de la suppression de la tâche");
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Mettre à jour le statut d'une tâche
  const updateStatus = async (id: string, status: "todo" | "in-progress" | "completed") => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedTask = await TasksService.updateStatus(id, status);
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === updatedTask.id ? updatedTask : task
        )
      );
      return updatedTask;
    } catch (err) {
      setError("Erreur lors de la mise à jour du statut");
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    tasks,
    isLoading,
    error,
    fetchTasks,
    getTasksByObjective,
    createTask,
    updateTask,
    deleteTask,
    updateStatus
  };

  return (
    <TasksContext.Provider value={value}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TasksContext);
  
  if (context === undefined) {
    throw new Error("useTasks doit être utilisé à l'intérieur d'un TasksProvider");
  }
  
  return context;
}
