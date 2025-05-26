import { Achievement } from "@/types/achievement";
import { API_CONFIG } from "@/config/api";

// Utiliser la configuration centralisée
const config = {
  useApi: API_CONFIG.useApi,
  baseUrl: API_CONFIG.baseUrl,
  endpoints: {
    achievements: "/achievements"
  }
};

// Données fictives pour les achievements
const mockAchievements: Achievement[] = [
  {
    id: "1",
    title: "Premier pas",
    description: "Compléter votre premier objectif",
    icon: "trophy",
    unlocked: true,
    date: "2025-02-15T10:30:00",
    progress: 1,
    total: 1
  },
  {
    id: "2",
    title: "Apprenti",
    description: "Compléter 5 objectifs",
    icon: "award",
    unlocked: false,
    progress: 3,
    total: 5
  },
  {
    id: "3",
    title: "Expert",
    description: "Compléter 10 objectifs",
    icon: "medal",
    unlocked: false,
    progress: 3,
    total: 10
  },
  {
    id: "4",
    title: "Maître du temps",
    description: "Compléter 5 tâches avant leur date d'échéance",
    icon: "clock",
    unlocked: true,
    date: "2025-03-10T14:20:00",
    progress: 5,
    total: 5
  },
  {
    id: "5",
    title: "Explorateur",
    description: "Visiter toutes les sections de l'application",
    icon: "map",
    unlocked: false,
    progress: 4,
    total: 6
  }
];

/**
 * Service pour gérer les achievements
 * Permet de basculer facilement entre les données fictives et l'API
 */
export const AchievementService = {
  /**
   * Récupère tous les achievements de l'utilisateur
   */
  async getAllAchievements(): Promise<Achievement[]> {
    if (config.useApi) {
      try {
        const response = await fetch(`/api/achievements`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des achievements");
        }
        
        return await response.json();
      } catch (error) {
        console.error("Erreur API:", error);
        return mockAchievements; // Fallback aux données fictives en cas d'erreur
      }
    }
    
    // Utiliser les données fictives si l'API n'est pas activée
    return Promise.resolve(mockAchievements);
  },

  /**
   * Récupère un achievement spécifique par son ID
   */
  async getAchievement(id: string): Promise<Achievement> {
    if (config.useApi) {
      try {
        const response = await fetch(`/api/achievements/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération de l'achievement");
        }
        
        return await response.json();
      } catch (error) {
        console.error("Erreur API:", error);
        // Trouver l'achievement dans les données fictives
        const achievement = mockAchievements.find(a => a.id === id);
        if (!achievement) {
          throw new Error("Achievement non trouvé");
        }
        return achievement;
      }
    }
    
    // Trouver l'achievement dans les données fictives
    const achievement = mockAchievements.find(a => a.id === id);
    if (!achievement) {
      throw new Error("Achievement non trouvé");
    }
    return Promise.resolve(achievement);
  }
};
