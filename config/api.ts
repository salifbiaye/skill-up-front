/**
 * Configuration de l'API
 */
export const API_CONFIG = {
  /**
   * URL de base de l'API
   */
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  
  /**
   * Indique si l'application doit utiliser l'API réelle ou les données fictives
   */
  useApi: true,
  
  /**
   * Délai de timeout pour les requêtes API (en ms)
   */
  timeout: 10000,
  
  /**
   * Endpoint de santé pour vérifier la disponibilité du serveur
   */
  healthEndpoint: '/health',
  
  
  /**
   * Endpoints de l'API
   */
  endpoints: {
    // Authentification
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      refreshToken: '/auth/refresh-token',
    },
    
    // Notes
    notes: {
      base: '/notes',
      detail: (id: string) => `/notes/${id}`,
      aiSummary: (id: string) => `/notes/${id}/ai-summary`,
    },
    
    // Objectifs
    objectives: {
      base: '/goals',
      detail: (id: string) => `/goals/${id}`,
      progress: (id: string) => `/goals/${id}/progress`,
      status: (id: string) => `/goals/${id}/status`,
    },
    
    // Tâches
    tasks: {
      base: '/tasks',
      detail: (id: string) => `/tasks/${id}`,
      status: (id: string) => `/tasks/${id}/status`,
    },
    
    // Chat IA
    chatSessions: {
      base: '/chat-sessions',
      detail: (id: string) => `/chat-sessions/${id}`,
      messages: (id: string) => `/chat-sessions/${id}/messages`,
      aiResponse: (id: string) => `/chat-sessions/${id}/ai-response`,
    },
    
    // Profil
    profile: {
      base: '/profile',
      changePassword: '/profile/change-password',
      achievements: '/profile/achievements',
    },
  },
};
