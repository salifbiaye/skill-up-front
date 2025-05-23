import { useAuthStore } from '@/stores/useAuthStore';
import { API_CONFIG } from '@/config/api';

// Utiliser la configuration centralisée
const API_URL = API_CONFIG.baseUrl;

/**
 * Service pour effectuer des requêtes API authentifiées
 */
class ApiService {
  /**
   * Effectue une requête GET authentifiée
   * @param endpoint Point d'accès API
   * @returns Données de la réponse
   */
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>('GET', endpoint);
  }

  /**
   * Effectue une requête POST authentifiée
   * @param endpoint Point d'accès API
   * @param data Données à envoyer
   * @returns Données de la réponse
   */
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>('POST', endpoint, data);
  }

  /**
   * Effectue une requête PUT authentifiée
   * @param endpoint Point d'accès API
   * @param data Données à envoyer
   * @returns Données de la réponse
   */
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>('PUT', endpoint, data);
  }

  /**
   * Effectue une requête DELETE authentifiée
   * @param endpoint Point d'accès API
   * @returns Données de la réponse
   */
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>('DELETE', endpoint);
  }

  /**
   * Effectue une requête HTTP authentifiée
   * @param method Méthode HTTP
   * @param endpoint Point d'accès API
   * @param data Données à envoyer (optionnel)
   * @returns Données de la réponse
   */
  private async request<T>(method: string, endpoint: string, data?: any): Promise<T> {
    // S'assurer que l'endpoint ne commence pas par un slash si l'URL de base se termine par un slash
    const url = `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    
    // Récupérer le token d'authentification du store
    const token = useAuthStore.getState().token;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    // Ajouter le token d'authentification s'il existe
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const config: RequestInit = {
      method,
      headers,
      credentials: 'include', // Inclure les cookies dans les requêtes
    };
    
    // Ajouter le corps de la requête pour les méthodes POST, PUT, etc.
    if (data) {
      config.body = JSON.stringify(data);
    }
    
    const response = await fetch(url, config);
    
    // Vérifier si la réponse est OK (statut 2xx)
    if (!response.ok) {
      // Si le statut est 401 (Non autorisé), essayer de rafraîchir le token
      if (response.status === 401) {
        try {
          // Essayer de rafraîchir le token
          await useAuthStore.getState().refreshToken();
          
          // Si le rafraîchissement a réussi, réessayer la requête avec le nouveau token
          const newToken = useAuthStore.getState().token;
          
          if (newToken) {
            headers['Authorization'] = `Bearer ${newToken}`;
            const retryResponse = await fetch(url, {
              ...config,
              headers,
            });
            
            if (retryResponse.ok) {
              return retryResponse.json();
            }
          }
        } catch (error) {
          // Si le rafraîchissement échoue, déconnecter l'utilisateur
          useAuthStore.getState().logout();
          throw new Error('Session expirée, veuillez vous reconnecter');
        }
      }
      
      // Gérer les autres erreurs
      const errorData = await response.json().catch(() => ({ message: 'Une erreur est survenue' }));
      throw new Error(errorData.message || `Erreur ${response.status}`);
    }
    
    // Retourner les données de la réponse
    return response.json();
  }
}

// Exporter une instance unique du service
export const apiService = new ApiService();
