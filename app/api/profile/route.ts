import { NextRequest, NextResponse } from 'next/server';
import { handleApiError, handleGeneralError } from '../utils/error-handler';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Gestionnaire de requêtes GET pour récupérer le profil utilisateur
 */
export async function GET(
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
        const backendUrl = `${API_BASE_URL}/profile`;

        // Appel au backend
        const response = await fetch(backendUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            return handleApiError(response, "Erreur lors de la récupération du profil");
        }

        return NextResponse.json(await response.json());
    } catch (error) {
        return handleGeneralError(error, "Impossible de contacter le serveur");
    }
}

/**
 * Gestionnaire de requêtes PUT pour mettre à jour le profil utilisateur
 */
export async function PUT(
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
        const backendUrl = `${API_BASE_URL}/profile`;
        const bodytext= await request.text();
        let userData = JSON.parse(bodytext);

        userData.fullName = userData.name;
        delete userData.name;

        const modifiedBodyText = JSON.stringify(userData);

        // Appel au backend
        const response = await fetch(backendUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`,
            },
            body: modifiedBodyText,
        });

        if (!response.ok) {
            return handleApiError(response, "Erreur lors de la mise à jour du profil");
        }

        return NextResponse.json(await response.json());
    } catch (error) {
        return handleGeneralError(error, "Impossible de contacter le serveur");
    }
}
