import { UserProfile, UpdateProfileInput, UpdatePreferencesInput } from "@/types/profile";
import { API_CONFIG } from "@/config/api";

// Utiliser la configuration centralisée
const config = {
  useApi: API_CONFIG.useApi,
  baseUrl: API_CONFIG.baseUrl,
  endpoints: API_CONFIG.endpoints.profile
};

// Données fictives pour le profil utilisateur
const mockUserProfile: UserProfile = {
  id: "1",
  userId: "user-123",
  fullName: "Jean Dupont",
  email: "jean.dupont@example.com",
  bio: "Étudiant en informatique passionné par le développement web et l'intelligence artificielle.",
  location: "Paris, France",
  occupation: "Étudiant en informatique",
  avatarUrl: "", // Vide pour afficher les initiales
  createdAt: "2025-01-15T10:00:00",
  updatedAt: "2025-05-20T14:30:00",
  
  // Champs additionnels pour l'interface utilisateur
  role: "Étudiant",
  skills: ["JavaScript", "React", "Node.js", "Python", "Machine Learning"],
  joinedAt: "2025-01-15",
  preferences: {
    theme: "system" as const,
    notifications: true,
    emailNotifications: false,
    language: "fr",
  },
};

/**
 * Service pour gérer le profil utilisateur
 * Permet de basculer facilement entre les données fictives et l'API
 */
export const ProfileService = {
  /**
   * Récupère le profil de l'utilisateur actuel
   */
  async getCurrentUserProfile(): Promise<UserProfile> {
    if (config.useApi) {
      try {
        const response = await fetch(`/api/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération du profil utilisateur");
        }
        return await response.json();
      } catch (error) {
        return mockUserProfile; // Fallback aux données fictives en cas d'erreur
      }
    }
    
    // Utiliser les données fictives si l'API n'est pas activée
    return Promise.resolve(mockUserProfile);
  },

  /**
   * Met à jour le profil de l'utilisateur
   */
  async updateProfile(profileData: UpdateProfileInput): Promise<UserProfile> {
    if (config.useApi) {
      try {
        const response = await fetch(`/api/profile`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(profileData),
        });
        
        if (!response.ok) {
          throw new Error("Erreur lors de la mise à jour du profil");
        }
        
        return await response.json();
      } catch (error) {
        console.error("Erreur API:", error);
        // Simuler une mise à jour avec les données fictives
        return {
          ...mockUserProfile,
          ...profileData,
        };
      }
    }
    
    // Simuler une mise à jour avec les données fictives
    return Promise.resolve({
      ...mockUserProfile,
      ...profileData,
    });
  },

  /**
   * Met à jour les préférences de l'utilisateur
   */
  async updatePreferences(preferencesData: UpdatePreferencesInput): Promise<UserProfile> {
    if (config.useApi) {
      try {
        const response = await fetch(`/api/profile/preferences`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(preferencesData),
        });
        
        if (!response.ok) {
          throw new Error("Erreur lors de la mise à jour des préférences");
        }
        
        return await response.json();
      } catch (error) {
        console.error("Erreur API:", error);
        // Simuler une mise à jour avec les données fictives
        return {
          ...mockUserProfile,
          preferences: {
            ...mockUserProfile.preferences,
            ...preferencesData,
          },
        };
      }
    }
    
    // Simuler une mise à jour avec les données fictives
    return Promise.resolve({
      ...mockUserProfile,
      preferences: {
        ...mockUserProfile.preferences,
        ...preferencesData,
      },
    });
  },

  /**
   * Télécharge une nouvelle image de profil
   */
  async uploadProfileImage(file: File): Promise<string> {
    if (config.useApi) {
      try {
        const formData = new FormData();
        formData.append("avatar", file);
        
        const response = await fetch(`/api/profile/avatar`, {
          method: "POST",
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error("Erreur lors du téléchargement de l'image de profil");
        }
        
        const data = await response.json();
        return data.avatarUrl;
      } catch (error) {
        console.error("Erreur API:", error);
        // Retourner une URL fictive
        return `/avatars/user-${Date.now()}.png`;
      }
    }
    
    // Retourner une URL fictive
    return Promise.resolve(`/avatars/user-${Date.now()}.png`);
  },

  /**
   * Change le mot de passe de l'utilisateur
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<boolean> {
    if (config.useApi) {
      try {
        const response = await fetch(`/api/profile/password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ currentPassword, newPassword }),
        });
        
        if (!response.ok) {
          throw new Error("Erreur lors du changement de mot de passe");
        }
        
        return true;
      } catch (error) {
        console.error("Erreur API:", error);
        throw error;
      }
    }
    
    // Simuler un changement de mot de passe réussi
    return Promise.resolve(true);
  },

  /**
   * Récupère les statistiques de l'utilisateur
   */
  async getUserStats(): Promise<any> {
    if (config.useApi) {
      try {
        const response = await fetch(`/api/profile/stats`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des statistiques");
        }
        
        return await response.json();
      } catch (error) {
        console.error("Erreur API:", error);
        // Retourner des statistiques fictives en cas d'erreur
        return {
          totalObjectives: 5,
          completedObjectives: 2,
          inProgressObjectives: 3,
          totalTasks: 12,
          completedTasks: 8,
          inProgressTasks: 3,
          overdueTasks: 1,
          totalNotes: 7,
          notesWithAiSummary: 3,
          joinedDays: 30,
          lastUpdated: new Date().toISOString()
        };
      }
    }
    
    // Retourner des statistiques fictives si l'API n'est pas activée
    return Promise.resolve({
      totalObjectives: 5,
      completedObjectives: 2,
      inProgressObjectives: 3,
      totalTasks: 12,
      completedTasks: 8,
      inProgressTasks: 3,
      overdueTasks: 1,
      totalNotes: 7,
      notesWithAiSummary: 3,
      joinedDays: 30,
      lastUpdated: new Date().toISOString()
    });
  },
};
