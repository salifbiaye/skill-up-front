import { NextRequest, NextResponse } from 'next/server';
import { handleApiError, handleGeneralError } from '../../utils/error-handler';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Gestionnaire de requêtes POST pour télécharger une nouvelle image de profil
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
        const backendUrl = `${API_BASE_URL}/profile/avatar`;

        // Récupérer le formData de la requête
        let formData;
        try {
            formData = await request.formData();
            
            // Vérifier que le fichier est présent
            if (!formData.has('avatar')) {
                return NextResponse.json(
                    { error: "Aucun fichier 'avatar' n'a été fourni" },
                    { status: 400 }
                );
            }
            
            // Vérifier le type de fichier
            const file = formData.get('avatar') as File;
            if (!file.type.startsWith('image/')) {
                return NextResponse.json(
                    { error: "Le fichier doit être une image" },
                    { status: 400 }
                );
            }
        } catch (error) {
            return NextResponse.json(
                { error: "Erreur lors de la récupération des données du formulaire" },
                { status: 400 }
            );
        }

        // Appel au backend
        const response = await fetch(backendUrl, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            return handleApiError(response, "Erreur lors du téléchargement de l'avatar");
        }

        return NextResponse.json(await response.json());
    } catch (error) {
        return handleGeneralError(error, "Impossible de contacter le serveur");
    }
}
