import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Gestionnaire de requêtes GET pour les routes de sessions de chat IA
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/');
  const backendUrl = `${API_BASE_URL}/chat-sessions/${path}`;

  try {
    const response = await fetch(backendUrl, {
      method: 'GET',
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

/**
 * Gestionnaire de requêtes POST pour les routes de sessions de chat IA
 */
export async function POST(
    request: NextRequest,
    { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/');
  const backendUrl = `${API_BASE_URL}/chat-sessions/${path}`;

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
 * Gestionnaire de requêtes PUT pour les routes de sessions de chat IA
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/');
  const backendUrl = `${API_BASE_URL}/chat-sessions/${path}`;

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
 * Gestionnaire de requêtes DELETE pour les routes de sessions de chat IA
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/');
  const backendUrl = `${API_BASE_URL}/chat-sessions/${path}`;

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