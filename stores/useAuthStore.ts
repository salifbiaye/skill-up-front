import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import Cookies from 'js-cookie'

// Définition des types
interface AuthState {
  token: string | null
  email: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  // Actions
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (email: string, password: string, name: string) => Promise<void>
  refreshToken: () => Promise<void>
  clearError: () => void
}

// Création du store avec persistance
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      email: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      // Connexion utilisateur
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        
        try {
          const response = await fetch(`/api/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          })
          
          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || 'Échec de la connexion')
          }
          
          const data = await response.json()
          
          // Stocker le token dans un cookie pour le middleware
          Cookies.set('auth-token', data.token, { 
            expires: 7, // expire dans 7 jours
            path: '/',
            sameSite: 'strict'
          })
          
          set({
            token: data.token,
            email: email,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Une erreur est survenue lors de la connexion',
          })
          throw error
        }
      },
      
      // Déconnexion utilisateur
      logout: () => {
        // Supprimer le cookie d'authentification
        Cookies.remove('auth-token', { path: '/' })
        
        set({
          token: null,
          email: null,
          isAuthenticated: false,
        })
      },
      
      // Inscription utilisateur
      register: async (email: string, password: string, name: string) => {
        set({ isLoading: true, error: null })
        
        try {
          const response = await fetch(`/api/auth/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, name }),
          })
          
          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || 'Échec de l\'inscription')
          }
          
          const data = await response.json()
          
          // Stocker le token dans un cookie pour le middleware
          Cookies.set('auth-token', data.token, { 
            expires: 7, // expire dans 7 jours
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
          })
          
          set({
            token: data.token,
            email: email,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Une erreur est survenue lors de l\'inscription',
          })
          throw error
        }
      },
      
      // Rafraîchir le token
      refreshToken: async () => {
        const token = get().token
        
        if (!token) {
          return
        }
        
        set({ isLoading: true })
        
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          })
          
          if (!response.ok) {
            // Si le refresh token échoue, on déconnecte l'utilisateur
            get().logout()
            throw new Error('Session expirée, veuillez vous reconnecter')
          }
          
          const data = await response.json()
          
          // Mettre à jour le cookie avec le nouveau token
          Cookies.set('auth-token', data.token, { 
            expires: 7,
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
          })
          
          set({
            token: data.token,
            isLoading: false,
          })
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Une erreur est survenue lors du rafraîchissement du token',
          })
        }
      },
      
      // Effacer les erreurs
      clearError: () => {
        set({ error: null })
      },
    }),
    {
      name: 'auth-storage', // nom utilisé pour le stockage local
      partialize: (state) => ({ 
        token: state.token, 
        email: state.email, 
        isAuthenticated: state.isAuthenticated 
      }), // ne persiste que ces champs
    }
  )
)
