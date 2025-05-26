import { NextRequest, NextResponse } from 'next/server';
import { handleApiError, handleGeneralError } from '../../utils/error-handler';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Gestionnaire de requêtes POST pour changer le mot de passe de l'utilisateur
 */
export async function POST(
    request: NextRequest,
) {
    try {
        const token = request.cookies.get('auth-token')?.value;
        if (!token) {
            return NextResponse.json(
                { error: "Authentication token missing" },
                { status: 401 }
            );
        }

        // Construction de l'URL backend
        const backendUrl = `${API_BASE_URL}/profile/password`;

        // Validation des données
        let requestData;
        try {
            requestData = await request.json();
        } catch (error) {
            return NextResponse.json(
                { error: "Format de données invalide" },
                { status: 400 }
            );
        }

        // Vérifier que les champs requis sont présents
        if (!requestData.currentPassword || !requestData.newPassword) {
            return NextResponse.json(
                { error: "Les champs 'currentPassword' et 'newPassword' sont requis" },
                { status: 400 }
            );
        }

        const response = await fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(requestData),
        });

        if (!response.ok) {
            return handleApiError(response, "Erreur lors du changement de mot de passe");
        }

        return NextResponse.json(await response.json());
    } catch (error) {
        return handleGeneralError(error, "Impossible de contacter le serveur");
    }
}
