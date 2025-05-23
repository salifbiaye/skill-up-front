import { create } from 'zustand';
import { UserProfile, UpdateProfileInput, UpdatePreferencesInput } from '@/types/profile';
import { ProfileService } from '@/services/profile-service';

interface ProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchProfile: () => Promise<void>;
  updateProfile: (profileData: UpdateProfileInput) => Promise<UserProfile>;
  updatePreferences: (preferencesData: UpdatePreferencesInput) => Promise<UserProfile>;
  uploadProfileImage: (file: File) => Promise<string>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  isLoading: false,
  error: null,

  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const data = await ProfileService.getCurrentUserProfile();
      set({ profile: data });
      // Ne pas retourner de données pour correspondre au type Promise<void>
    } catch (err) {
      const errorMessage = "Erreur lors du chargement du profil";
      console.error(errorMessage, err);
      set({ error: errorMessage });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  updateProfile: async (profileData: UpdateProfileInput) => {
    set({ isLoading: true, error: null });
    
    try {
      const updatedProfile = await ProfileService.updateProfile(profileData);
      set({ profile: updatedProfile });
      return updatedProfile;
    } catch (err) {
      const errorMessage = "Erreur lors de la mise à jour du profil";
      console.error(errorMessage, err);
      set({ error: errorMessage });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  updatePreferences: async (preferencesData: UpdatePreferencesInput) => {
    set({ isLoading: true, error: null });
    
    try {
      const updatedProfile = await ProfileService.updatePreferences(preferencesData);
      set({ profile: updatedProfile });
      return updatedProfile;
    } catch (err) {
      const errorMessage = "Erreur lors de la mise à jour des préférences";
      console.error(errorMessage, err);
      set({ error: errorMessage });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  uploadProfileImage: async (file: File) => {
    set({ isLoading: true, error: null });
    
    try {
      const avatarUrl = await ProfileService.uploadProfileImage(file);
      
      if (get().profile) {
        const updatedProfile = await ProfileService.updateProfile({ avatar: avatarUrl });
        set({ profile: updatedProfile });
      }
      
      return avatarUrl;
    } catch (err) {
      const errorMessage = "Erreur lors du téléchargement de l'image";
      console.error(errorMessage, err);
      set({ error: errorMessage });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const success = await ProfileService.changePassword(currentPassword, newPassword);
      return success;
    } catch (err) {
      const errorMessage = "Erreur lors du changement de mot de passe";
      console.error(errorMessage, err);
      set({ error: errorMessage });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  }
}));
