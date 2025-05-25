import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Gestionnaire de requêtes GET pour les routes d'objectifs
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { path?: string[] } } // Rend le path optionnel
) {
  const param = await params
  try {
    // Récupération du token
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
          { error: "Authentication token missing" },
          { status: 401 }
      );
    }

    // Construction de l'URL backend
    let backendUrl = `${API_BASE_URL}/goals`;

    // Ajout du path seulement s'il existe
    if (params.path?.length) {
      console.log("params.path", params.path); // Debugging line
      backendUrl += `/${params.path.join('/')}`;
    }

    // Appel au backend
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text(); // Utilisez text() au lieu de json() au cas où la réponse n'est pas JSON
      return NextResponse.json(
          { error: `Backend error: ${errorText || response.statusText}` },
          { status: response.status }
      );
    }

    return NextResponse.json(await response.json());
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
        { error: `Backend unreachable: ${error instanceof Error ? error.message : String(error)}` },
        { status: 502 }
    );
  }
}
/**
 * Gestionnaire de requêtes POST pour les routes d'objectifs
 */
export async function POST(
    request: NextRequest,
    { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/');
  const backendUrl = `${API_BASE_URL}/goals/${path}`;

  try {

    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: await request.text(),
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
 * Gestionnaire de requêtes PUT pour les routes d'objectifs
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/');
  const backendUrl = `${API_BASE_URL}/goals/${path}`;

  try {
    const response = await fetch(backendUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: await request.text(),
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
 * Gestionnaire de requêtes DELETE pour les routes d'objectifs
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/');
  const backendUrl = `${API_BASE_URL}/goals/${path}`;

  try {
    const response = await fetch(backendUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
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