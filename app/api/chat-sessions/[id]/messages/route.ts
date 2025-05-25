import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Gestionnaire de requêtes GET pour les routes de sessions de chat IA
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
  const param = await params
const id = param.id;
  const backendUrl = `${API_BASE_URL}/chat-sessions/${id}/messages`;
  const token = request.cookies.get('auth-token')?.value;
  if (!token) {
    return NextResponse.json(
        { error: "Authentication token missing" },
        { status: 401 }
    );
  }
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
    { params }: { params: { id: string } }
) {
  const param = await params
  const id = param.id;
  const backendUrl = `${API_BASE_URL}/chat-sessions/${id}/messages`;
  const token = request.cookies.get('auth-token')?.value;
  if (!token) {
    return NextResponse.json(
        { error: "Authentication token missing" },
        { status: 401 }
    );
  }
  try {
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
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

