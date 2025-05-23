import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Gestionnaire de requêtes GET pour les routes de tâches
 */
export async function GET(
    request: NextRequest,

) {

  const backendUrl = `${API_BASE_URL}/tasks`;
  const token = request.cookies.get('auth-token')?.value;

  try {
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
       "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

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
 * Gestionnaire de requêtes POST pour les routes de tâches
 */
export async function POST(
    request: NextRequest,

) {

  const backendUrl = `${API_BASE_URL}/tasks`;
  const token = request.cookies.get('auth-token')?.value;

  try {
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
       "Authorization": `Bearer ${token}`,
      },
      body: await request.text(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

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

