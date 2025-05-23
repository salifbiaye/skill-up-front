"use client";

import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { UserProfile, UpdateProfileInput, UpdatePreferencesInput } from "@/types/profile";
import { ProfileService } from "@/services/profile-service";

interface ProfileContextType {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (profileData: UpdateProfileInput) => Promise<UserProfile>;
  updatePreferences: (preferencesData: UpdatePreferencesInput) => Promise<UserProfile>;
  uploadProfileImage: (file: File) => Promise<string>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger le profil au montage du composant
  useEffect(() => {
    fetchProfile();
  }, []);

  // Récupérer le profil de l'utilisateur
  const fetchProfile = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await ProfileService.getCurrentUserProfile();
      setProfile(data);
    } catch (err) {
      setError("Erreur lors du chargement du profil");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Mettre à jour le profil
  const updateProfile = async (profileData: UpdateProfileInput) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedProfile = await ProfileService.updateProfile(profileData);
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (err) {
      setError("Erreur lors de la mise à jour du profil");
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Mettre à jour les préférences
  const updatePreferences = async (preferencesData: UpdatePreferencesInput) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedProfile = await ProfileService.updatePreferences(preferencesData);
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (err) {
      setError("Erreur lors de la mise à jour des préférences");
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Télécharger une image de profil
  const uploadProfileImage = async (file: File) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const avatarUrl = await ProfileService.uploadProfileImage(file);
      
      if (profile) {
        const updatedProfile = await ProfileService.updateProfile({ avatar: avatarUrl });
        setProfile(updatedProfile);
      }
      
      return avatarUrl;
    } catch (err) {
      setError("Erreur lors du téléchargement de l'image");
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    profile,
    isLoading,
    error,
    fetchProfile,
    updateProfile,
    updatePreferences,
    uploadProfileImage
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  
  if (context === undefined) {
    throw new Error("useProfile doit être utilisé à l'intérieur d'un ProfileProvider");
  }
  
  return context;
}
