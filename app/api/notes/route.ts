import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Gestionnaire de requêtes GET pour les routes de notes
 */
export async function GET(
    request: NextRequest,

) {

  const backendUrl = `${API_BASE_URL}/notes`;
  const token = request.cookies.get('auth-token')?.value;
  try {
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Backend error:', error);
    return NextResponse.json(
        { error: 'Le serveur backend n\'est pas disponible' },
        { status: 502 }
    );
  }
}

/**
 * Gestionnaire de requêtes POST pour les routes de notes
 */
export async function POST(
    request: NextRequest,

) {

  const backendUrl = `${API_BASE_URL}/notes`;
  const token = request.cookies.get('auth-token')?.value;
  
  // Récupérer le corps de la requête
  const bodyText = await request.text();
  let bodyData = JSON.parse(bodyText);
  
  // Supprimer goalId et taskId s'ils sont vides
  if (bodyData.goalId === "") {
    delete bodyData.goalId;
  }
  
  if (bodyData.taskId === "") {
    delete bodyData.taskId;
  }
  
  try {
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(bodyData),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Backend error:', error);
    return NextResponse.json(
        { error: 'Le serveur backend n\'est pas disponible' },
        { status: 502 }
    );
  }
}
