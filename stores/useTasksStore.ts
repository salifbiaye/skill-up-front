import { create } from 'zustand';
import { Task, CreateTaskInput, UpdateTaskInput } from '@/types/tasks';
import { TasksService } from '@/services/tasks-service';

interface TasksState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchTasks: () => Promise<void>;
  getTasksByObjective: (objectiveId: string) => Promise<Task[]>;
  createTask: (taskData: CreateTaskInput) => Promise<Task>;
  updateTask: (taskData: UpdateTaskInput) => Promise<Task>;
  deleteTask: (id: string) => Promise<boolean>;
  updateStatus: (id: string, status: "TODO" | "IN_PROGRESS" | "COMPLETED") => Promise<Task>;
}

export const useTasksStore = create<TasksState>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const data = await TasksService.getAllTasks();
      set({ tasks: data });
      // Ne pas retourner de données pour correspondre au type Promise<void>
    } catch (err) {
      const errorMessage = "Erreur lors du chargement des tâches";
      console.error(errorMessage, err);
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
      console.error(errorMessage, err);
      set({ error: errorMessage });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  createTask: async (taskData: CreateTaskInput) => {
    set({ isLoading: true, error: null });
    
    try {
      const newTask = await TasksService.createTask(taskData);
      set(state => ({ tasks: [...state.tasks, newTask] }));
      return newTask;
    } catch (err) {
      const errorMessage = "Erreur lors de la création de la tâche";
      console.error(errorMessage, err);
      set({ error: errorMessage });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  updateTask: async (taskData: UpdateTaskInput) => {
    set({ isLoading: true, error: null });
    
    try {
      const updatedTask = await TasksService.updateTask(taskData);
      set(state => ({
        tasks: state.tasks.map(task => 
          task.id === updatedTask.id ? updatedTask : task
        )
      }));
      return updatedTask;
    } catch (err) {
      const errorMessage = "Erreur lors de la mise à jour de la tâche";
      console.error(errorMessage, err);
      set({ error: errorMessage });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteTask: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      await TasksService.deleteTask(id);
      set(state => ({
        tasks: state.tasks.filter(task => task.id !== id)
      }));
      return true;
    } catch (err) {
      const errorMessage = "Erreur lors de la suppression de la tâche";
      console.error(errorMessage, err);
      set({ error: errorMessage });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  updateStatus: async (id: string, status: "TODO" | "IN_PROGRESS" | "COMPLETED") => {
    set({ isLoading: true, error: null });
    
    try {
      const updatedTask = await TasksService.updateStatus(id, status);
      set(state => ({
        tasks: state.tasks.map(task => 
          task.id === updatedTask.id ? updatedTask : task
        )
      }));
      return updatedTask;
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
