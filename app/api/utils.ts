import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/config/api';

/**
 * Vérifie si le serveur backend est disponible
 * @returns true si le serveur est disponible, false sinon
 */
let serverAvailable: boolean | null = null;
let lastCheck: number = 0;

async function checkServerAvailability(): Promise<boolean> {
  const now = Date.now();
  
  // Vérifier au maximum une fois toutes les 10 secondes
  if (serverAvailable !== null && now - lastCheck < 10000) {
    return serverAvailable;
  }
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.healthEndpoint}`, {
      method: 'GET',
      signal: controller.signal
    }).catch(() => null);
    
    clearTimeout(timeoutId);
    
    serverAvailable = response !== null && response.ok;
    lastCheck = now;
    
    return serverAvailable;
  } catch (error) {
    console.error('Erreur lors de la vérification de la disponibilité du serveur:', error);
    serverAvailable = false;
    lastCheck = now;
    return false;
  }
}

/**
 * Fonction utilitaire pour transférer les requêtes HTTP vers le backend
 * @param request Requête entrante
 * @param apiPath Chemin de l'API backend
 * @param method Méthode HTTP
 * @returns Réponse du backend
 */
export async function proxyRequest(
  request: NextRequest,
  apiPath: string,
  method: string
) {
  // Vérifier si le serveur est disponible
  const isServerAvailable = await checkServerAvailability();
  
  if (!isServerAvailable) {
    console.error(`Serveur backend non disponible: ${API_CONFIG.baseUrl}`);
    return NextResponse.json(
      { 
        message: "Le serveur backend n'est pas disponible. Veuillez réessayer plus tard.", 
        error: 'SERVER_UNAVAILABLE' 
      },
      { status: 503 }
    );
  }
  try {
    const url = new URL(request.url);
    const queryString = url.search;
    const fullUrl = `${API_CONFIG.baseUrl}${apiPath}${queryString}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    // Récupérer le token d'authentification des cookies
    const authToken = request.cookies.get('auth-token')?.value;
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const options: RequestInit = {
      method,
      headers,
    };
    
    // Ajouter le corps de la requête pour les méthodes POST, PUT, etc.
    if (method !== 'GET' && method !== 'DELETE' && request.body) {
      const body = await request.json().catch(() => ({}));
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(fullUrl, options);
    
    // Gérer les réponses non-JSON
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
      } else {
        // Si le serveur renvoie du HTML ou un autre format, créer une réponse JSON avec un message d'erreur
        const text = await response.text();
        console.error(`Réponse non-JSON reçue: ${text.substring(0, 100)}...`);
        
        return NextResponse.json(
          { 
            message: 'Le serveur a renvoyé une réponse dans un format inattendu', 
            error: 'FORMAT_ERROR',
            status: response.status 
          }, 
          { status: 500 }
        );
      }
    } catch (parseError) {
      console.error('Erreur lors du traitement de la réponse:', parseError);
      return NextResponse.json(
        { message: 'Erreur lors du traitement de la réponse du serveur', error: 'PARSE_ERROR' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error(`Erreur API ${method} ${apiPath}:`, error);
    return NextResponse.json(
      { message: 'Erreur lors de la communication avec le serveur' },
      { status: 500 }
    );
  }
}
