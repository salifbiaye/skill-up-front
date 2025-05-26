export interface UserProfile {
  id: string;
  userId?: string; // From backend ProfileResponse
  email: string;
  fullName: string; // From backend ProfileResponse
  bio?: string;
  location?: string;
  occupation?: string;
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  
  // Additional fields for frontend use
  role?: string;
  skills?: string[];
  joinedAt?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme?: "light" | "dark" | "system";
  notifications?: boolean;
  emailNotifications?: boolean;
  language?: string;
}

export interface UpdateProfileInput {
  name?: string;
  bio?: string;
  location?: string;
  occupation?: string;
  avatarUrl?: string;
}

export interface UpdatePreferencesInput {
  theme?: "light" | "dark" | "system";
  notifications?: boolean;
  emailNotifications?: boolean;
  language?: string;
}
