import {NextRequest, NextResponse} from "next/server";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
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
        const body = await request.text();
        const parsed = JSON.parse(body);
        const backendUrl = `${API_BASE_URL}/tasks/${id}/status?status=${parsed.status.toUpperCase()}`;


        // Appel au backend
        const response = await fetch(backendUrl, {
            method: 'PATCH',
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
