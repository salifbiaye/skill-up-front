import { NextRequest, NextResponse } from 'next/server';
import { handleApiError, handleGeneralError } from '../../utils/error-handler';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Définition des interfaces pour les types de données
interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  role: string;
  skills: string[];
  joinedAt: string;
  preferences: any;
}

interface Objective {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  priority: "low" | "medium" | "high";
  progress: number;
  relatedTasks?: string[];
  completedTasks: number;
  totalTasks: number;
}

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: "TODO" | "IN_PROGRESS" | "COMPLETED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  goalId: string;
  objectiveTitle?: string;
  tags: string[];
}

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  hasAiSummary: boolean;
  goalId?: string;
  taskId?: string;
  relatedTaskTitle?: string;
}

/**
 * Gestionnaire de requêtes GET pour récupérer les statistiques de l'utilisateur
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
        const backendUrl = `${API_BASE_URL}/profile/stats`;

        // Appel au backend
        const response = await fetch(backendUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            // Si le backend ne supporte pas encore cette route, générer des statistiques côté client
            if (response.status === 404) {
                // Récupérer les données nécessaires pour calculer les statistiques
                const [profileResponse, objectivesResponse, tasksResponse, notesResponse] = await Promise.all([
                    fetch(`${API_BASE_URL}/profile`, {
                        headers: { "Authorization": `Bearer ${token}` }
                    }),
                    fetch(`${API_BASE_URL}/objectives`, {
                        headers: { "Authorization": `Bearer ${token}` }
                    }),
                    fetch(`${API_BASE_URL}/tasks`, {
                        headers: { "Authorization": `Bearer ${token}` }
                    }),
                    fetch(`${API_BASE_URL}/notes`, {
                        headers: { "Authorization": `Bearer ${token}` }
                    })
                ]);

                // Vérifier si toutes les requêtes ont réussi
                if (!profileResponse.ok || !objectivesResponse.ok || !tasksResponse.ok || !notesResponse.ok) {
                    return handleApiError(response, "Erreur lors de la récupération des données pour les statistiques");
                }

                // Récupérer les données
                const profile = await profileResponse.json() as UserProfile;
                const objectives = await objectivesResponse.json() as Objective[];
                const tasks = await tasksResponse.json() as Task[];
                const notes = await notesResponse.json() as Note[];

                // Calculer les statistiques
                const stats = {
                    totalObjectives: objectives.length,
                    completedObjectives: objectives.filter((obj: Objective) => obj.status === "COMPLETED").length,
                    inProgressObjectives: objectives.filter((obj: Objective) => obj.status === "IN_PROGRESS").length,
                    totalTasks: tasks.length,
                    completedTasks: tasks.filter((task: Task) => task.status === "COMPLETED").length,
                    inProgressTasks: tasks.filter((task: Task) => task.status === "IN_PROGRESS").length,
                    overdueTasks: tasks.filter((task: Task) => {
                        const dueDate = new Date(task.dueDate);
                        const today = new Date();
                        return task.status !== "COMPLETED" && dueDate < today;
                    }).length,
                    totalNotes: notes.length,
                    notesWithAiSummary: notes.filter((note: Note) => note.hasAiSummary).length,
                    joinedDays: Math.floor((new Date().getTime() - new Date(profile.joinedAt).getTime()) / (1000 * 60 * 60 * 24)),
                    lastUpdated: new Date().toISOString()
                };

                return NextResponse.json(stats);
            }

            return handleApiError(response, "Erreur lors de la récupération des statistiques");
        }

        return NextResponse.json(await response.json());
    } catch (error) {
        return handleGeneralError(error, "Impossible de contacter le serveur");
    }
}
