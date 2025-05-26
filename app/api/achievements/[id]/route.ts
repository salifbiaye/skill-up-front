import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Gestionnaire de requêtes GET pour récupérer un achievement spécifique
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Récupération du token
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authentication token missing" },
        { status: 401 }
      );
    }

    const { id } = params;

    // Construction de l'URL backend
    let backendUrl = `${API_BASE_URL}/achievements/${id}`;

    // Appel au backend
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
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
