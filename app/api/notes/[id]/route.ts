import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Gestionnaire de requêtes GET pour récupérer une tâche par son ID
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const param = await params
    try {

        const token = request.cookies.get('auth-token')?.value;
        if (!token) {
            return NextResponse.json(
                { error: "Authentication token missing" },
                { status: 401 }
            );
        }

        const id = param.id;
        // Construction de l'URL backend
        const backendUrl = `${API_BASE_URL}/notes/${id}`;

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

        const idparam = param.id;
        // Construction de l'URL backend
        const backendUrl = `${API_BASE_URL}/notes/${idparam}`;
        const body = await request.text();
        const {id, ...data} = JSON.parse(body);
        
        // Supprimer goalId et taskId s'ils sont vides
        if (data.goalId === "" || data.goalId === undefined || data.goalId === null) {
            delete data.goalId;
        }
        
        if (data.taskId === "" || data.taskId === undefined || data.taskId === null) {
            delete data.taskId;
        }
        delete data.goalTitle;
        delete data.taskTitle;
        delete data.createdAt;
        delete data.updatedAt;
        
        const requestBody = JSON.stringify({
            ...data,
        });

        // Appel au backend
        const response = await fetch(backendUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`,
            },
            body: requestBody,
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
        const backendUrl = `${API_BASE_URL}/notes/${id}`;

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
    const param = await params;
    try {
        const token = request.cookies.get('auth-token')?.value;
        if (!token) {
            return NextResponse.json(
                { error: "Authentication token missing" },
                { status: 401 }
            );
        }

        const id = param.id;
        const backendUrl = `${API_BASE_URL}/notes/${id}`;

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

        // Modification clé : Ne pas parser la réponse si elle est vide (204)
        if (response.status === 204) {
            return new NextResponse(null, { status: 204 });
        } else {
            return NextResponse.json(await response.json());
        }
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json(
            { error: `Backend unreachable: ${error instanceof Error ? error.message : String(error)}` },
            { status: 500 } // 502 → 500 (car 502 est réservé aux erreurs de proxy)
        );
    }
}
