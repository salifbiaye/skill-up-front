import { create } from 'zustand';
import { Task, CreateTaskInput, UpdateTaskInput } from '@/types/tasks';
import { TasksService } from '@/services/tasks-service';
import { toast } from 'sonner';

// Type pour les résultats des opérations sur les tâches
interface TaskResult {
  success: boolean;
  data?: Task;
  error?: string;
}

interface TasksState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchTasks: () => Promise<void>;
  getTasksByObjective: (objectiveId: string) => Promise<Task[]>;
  createTask: (taskData: CreateTaskInput) => Promise<TaskResult>;
  updateTask: (taskData: UpdateTaskInput) => Promise<TaskResult>;
  deleteTask: (id: string) => Promise<{ success: boolean; error?: string }>;
  updateStatus: (id: string, status: "TODO" | "IN_PROGRESS" | "COMPLETED") => Promise<TaskResult>;
}

export const useTasksStore = create<TasksState>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const data = await TasksService.getAllTasks();
      
      // Vérifier les tâches expirées (non terminées et date d'échéance dépassée)
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Réinitialiser l'heure à minuit
      
      const expiredTasks = data.filter(task => {
        const taskDate = new Date(task.dueDate);
        taskDate.setHours(0, 0, 0, 0);
        return taskDate < today && task.status !== "COMPLETED";
      });
      
      // Supprimer les tâches expirées
      if (expiredTasks.length > 0) {
        // Supprimer les tâches expirées du tableau de données
        const remainingTasks = data.filter(task => {
          const isExpired = expiredTasks.some(expiredTask => expiredTask.id === task.id);
          return !isExpired;
        });
        
        // Mettre à jour l'état avec les tâches restantes
        set({ tasks: remainingTasks });
        
        // Supprimer les tâches expirées de la base de données
        for (const task of expiredTasks) {
          await TasksService.deleteTask(task.id);
        }
        
        // Afficher une notification toast
        toast(`${expiredTasks.length} tâche(s) expirée(s) ont été supprimée(s)`, {
          description: "Les tâches non terminées dont la date d'échéance est dépassée ont été supprimées",
          duration: 5000
        });
      } else {
        // Pas de tâches expirées, mettre à jour l'état normalement
        set({ tasks: data });
      }
      
      // Ne pas retourner de données pour correspondre au type Promise<void>
    } catch (err) {
      const errorMessage = "Erreur lors du chargement des tâches";
      set({ error: errorMessage });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  getTasksByObjective: async (objectiveId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const data = await TasksService.getTasksByObjective(objectiveId);
      return data;
    } catch (err) {
      const errorMessage = "Erreur lors du chargement des tâches liées à l'objectif";
      set({ error: errorMessage });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  createTask: async (taskData: CreateTaskInput) => {
    set({ isLoading: true, error: null });
    
    const result = await TasksService.createTask(taskData);
    set({ isLoading: false });
    
    if (result.success && result.data) {
      set(state => ({ tasks: [...state.tasks, result.data!] }));
      return result;
    } else {
      const errorMessage = result.error || "Erreur lors de la création de la tâche";

      set({ error: errorMessage });
      return result;
    }
  },

  updateTask: async (taskData: UpdateTaskInput) => {
    set({ isLoading: true, error: null });
    
    const result = await TasksService.updateTask(taskData);
    set({ isLoading: false });
    
    if (result.success && result.data) {
      set(state => ({
        tasks: state.tasks.map(task => 
          task.id === result.data!.id ? result.data! : task
        )
      }));
      return result;
    } else {
      const errorMessage = result.error || "Erreur lors de la mise à jour de la tâche";

      set({ error: errorMessage });
      return result;
    }
  },

  deleteTask: async (id: string) => {
    set({ isLoading: true, error: null });
    
    const result = await TasksService.deleteTask(id);
    set({ isLoading: false });
    
    if (result.success) {
      set(state => ({
        tasks: state.tasks.filter(task => task.id !== id)
      }));
      return result;
    } else {
      const errorMessage = result.error || "Erreur lors de la suppression de la tâche";

      set({ error: errorMessage });
      return result;
    }
  },

  updateStatus: async (id: string, status: "TODO" | "IN_PROGRESS" | "COMPLETED") => {
    set({ isLoading: true, error: null });
    
    const result = await TasksService.updateStatus(id, status);
    set({ isLoading: false });
    
    if (result.success && result.data) {
      set(state => ({
        tasks: state.tasks.map(task => 
          task.id === result.data!.id ? result.data! : task
        )
      }));
      return result;
    } else {
      const errorMessage = result.error || "Erreur lors de la mise à jour du statut";

      set({ error: errorMessage });
      return result;
    }
  }
}));
