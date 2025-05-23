export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  role: string;
  skills: string[];
  joinedAt: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: "light" | "dark" | "system";
  notifications: boolean;
  emailNotifications: boolean;
  language: string;
}

export interface UpdateProfileInput {
  name?: string;
  bio?: string;
  avatar?: string;
  skills?: string[];
}

export interface UpdatePreferencesInput {
  theme?: "light" | "dark" | "system";
  notifications?: boolean;
  emailNotifications?: boolean;
  language?: string;
}
