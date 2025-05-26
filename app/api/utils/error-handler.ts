import { NextResponse } from 'next/server';

/**
 * Gère les erreurs de réponse API de manière cohérente
 * @param response La réponse de l'API backend
 * @param defaultMessage Message d'erreur par défaut
 * @returns NextResponse avec un message d'erreur formaté
 */
export async function handleApiError(response: Response, defaultMessage: string): Promise<NextResponse> {
  let errorMessage = defaultMessage;
  
  try {
    // Essayer de parser la réponse comme JSON
    const errorData = await response.json();
    errorMessage = errorData.message || errorData.error || defaultMessage;
  } catch {
    // Si la réponse n'est pas du JSON, utiliser le texte brut
    try {
      const errorText = await response.text();
      if (errorText) {
        errorMessage = errorText;
      }
    } catch {
      // En cas d'échec, utiliser le statut de la réponse
      errorMessage = `${defaultMessage}: ${response.statusText}`;
    }
  }
  
  return NextResponse.json(
    { error: errorMessage },
    { status: response.status }
  );
}

/**
 * Gère les erreurs générales de manière cohérente
 * @param error L'erreur capturée
 * @param defaultMessage Message d'erreur par défaut
 * @returns NextResponse avec un message d'erreur formaté
 */
export function handleGeneralError(error: unknown, defaultMessage: string): NextResponse {
  console.error("API Error:", error);
  
  const errorMessage = error instanceof Error 
    ? `${defaultMessage}: ${error.message}` 
    : `${defaultMessage}: ${String(error)}`;
  
  return NextResponse.json(
    { error: errorMessage },
    { status: 502 }
  );
}
