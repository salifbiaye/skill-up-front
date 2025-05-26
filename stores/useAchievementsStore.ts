import { create } from 'zustand';
import { Achievement } from '@/types/achievement';
import { AchievementService } from '@/services/achievement-service';
import { toast } from 'sonner';

interface AchievementsState {
  achievements: Achievement[];
  selectedAchievement: Achievement | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchAchievements: () => Promise<void>;
  fetchAchievement: (id: string) => Promise<Achievement>;
}

export const useAchievementsStore = create<AchievementsState>((set, get) => ({
  achievements: [],
  selectedAchievement: null,
  isLoading: false,
  error: null,

  fetchAchievements: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const data = await AchievementService.getAllAchievements();
      set({ achievements: data });
    } catch (err) {
      const errorMessage = "Erreur lors du chargement des achievements";
      toast.error(errorMessage);
      set({ error: errorMessage });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAchievement: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const achievement = await AchievementService.getAchievement(id);
      set({ selectedAchievement: achievement });
      return achievement;
    } catch (err) {
      const errorMessage = "Erreur lors du chargement de l'achievement";
      toast.error(errorMessage);
      set({ error: errorMessage });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  }
}));
