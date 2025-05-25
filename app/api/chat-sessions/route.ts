import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Gestionnaire de requêtes GET pour les routes de sessions de chat IA
 */
export async function GET(
    request: NextRequest,
) {
  const token = request.cookies.get('auth-token')?.value;
  if (!token) {
    return NextResponse.json(
        { error: "Authentication token missing" },
        { status: 401 }
    );
  }
  const backendUrl = `${API_BASE_URL}/chat-sessions`;

  try {
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
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
 * Gestionnaire de requêtes POST pour les routes de sessions de chat IA
 */
export async function POST(
    request: NextRequest,
) {
  const backendUrl = `${API_BASE_URL}/chat-sessions`;
  const token = request.cookies.get('auth-token')?.value;
  if (!token) {
    return NextResponse.json(
        { error: "Authentication token missing" },
        { status: 401 }
    );
  }
  try {
    const body = await request.text();
    const parsedBody = JSON.parse(body);
    console.log('Request body:', body)
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ title: parsedBody.title }),
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

