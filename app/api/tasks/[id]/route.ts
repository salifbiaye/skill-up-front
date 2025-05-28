import { NextRequest, NextResponse } from 'next/server';
import {param} from "ts-interface-checker";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Gestionnaire de requêtes GET pour récupérer une tâche par son ID
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const param = await params
        // Récupération du token
        const token = request.cookies.get('auth-token')?.value;
        if (!token) {
            return NextResponse.json(
                { error: "Authentication token missing" },
                { status: 401 }
            );
        }

        const id = param.id;
        // Construction de l'URL backend
        const backendUrl = `${API_BASE_URL}/tasks/${id}`;

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

/**
 * Gestionnaire de requêtes PUT pour mettre à jour une tâche par son ID
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
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

        const id = param.id;
        // Construction de l'URL backend
        const backendUrl = `${API_BASE_URL}/tasks/${id}`;
        const body = await request.text();
        const parsedbody = JSON.parse(body);
        delete parsedbody.id;
        // Appel au backend
        const response = await fetch(backendUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({...parsedbody}),
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

/**
 * Gestionnaire de requêtes PATCH pour mettre à jour partiellement une tâche par son ID
 */
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
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

        const id = param.id;
        // Construction de l'URL backend
        const backendUrl = `${API_BASE_URL}/tasks/${id}`;

        // Appel au backend
        const response = await fetch(backendUrl, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`,
            },
            body: await request.text(),
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

/**
 * Gestionnaire de requêtes DELETE pour supprimer une tâche par son ID
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
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

        const id = param.id;
        // Construction de l'URL backend
        const backendUrl = `${API_BASE_URL}/tasks/${id}`;

        // Appel au backend
        const response = await fetch(backendUrl, {
            method: 'DELETE',
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

        return NextResponse.json({ message: "Task deleted successfully" });
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json(
            { error: `Backend unreachable: ${error instanceof Error ? error.message : String(error)}` },
            { status: 502 }
        );
    }
}
