import { Task } from "@/types/tasks";

export const tasksData: Task[] = [
  {
    id: "1",
    title: "Lire le chapitre 1",
    description: "Lecture du premier chapitre du cours d'algorithmique",
    dueDate: "2025-05-21", // Hier
    priority: "high",
    objectiveTitle: "Algorithmique",
    status: "completed",
    tags: ["lecture", "algorithmique"],
  },
  {
    id: "2",
    title: "Résumer le chapitre 1",
    description: "Faire un résumé des points clés du chapitre 1",
    dueDate: "2025-05-21", // Hier
    priority: "medium",
    objectiveTitle: "Algorithmique",
    status: "completed",
    tags: ["résumé", "algorithmique"],
  },
  {
    id: "3",
    title: "Faire les exercices du chapitre",
    description: "Résoudre tous les exercices du chapitre 1",
    dueDate: "2025-05-22", // Aujourd'hui
    priority: "high",
    objectiveTitle: "Algorithmique",
    status: "completed",
    tags: ["exercices", "pratique", "algorithmique"],
  },
  {
    id: "4",
    title: "Réviser avec des questions IA",
    description: "Utiliser l'IA pour générer des questions de révision",
    dueDate: "2025-05-22", // Aujourd'hui
    priority: "medium",
    objectiveTitle: "Algorithmique",
    status: "completed",
    tags: ["révision", "IA", "algorithmique"],
  },
  {
    id: "5",
    title: "Lire le chapitre 2",
    description: "Lecture du chapitre 2 du cours de mathématiques",
    dueDate: "2025-05-23", // Demain
    priority: "medium",
    objectiveTitle: "Mathématiques",
    status: "todo",
    tags: ["lecture", "mathématiques"],
  },
  {
    id: "6",
    title: "Faire les exercices 1-10",
    description: "Résoudre les exercices 1 à 10 du chapitre 2",
    dueDate: "2025-05-23", // Demain
    priority: "high",
    objectiveTitle: "Mathématiques",
    status: "todo",
    tags: ["exercices", "pratique", "mathématiques"],
  },
  {
    id: "7",
    title: "Réviser les formules clés",
    description: "Mémoriser les formules importantes pour l'examen",
    dueDate: "2025-05-25", // Dans 3 jours
    priority: "high",
    objectiveTitle: "Mathématiques",
    status: "todo",
    tags: ["révision", "formules", "mathématiques"],
  },
  {
    id: "8",
    title: "Pratiquer la compréhension orale",
    description: "Faire des exercices d'écoute en anglais",
    dueDate: "2025-05-24", // Dans 2 jours
    priority: "low",
    objectiveTitle: "Anglais",
    status: "todo",
    tags: ["compréhension", "oral", "anglais"],
  },
  {
    id: "9",
    title: "Apprendre 20 nouveaux mots",
    description: "Enrichir mon vocabulaire avec 20 nouveaux mots",
    dueDate: "2025-05-26", // Dans 4 jours
    priority: "medium",
    objectiveTitle: "Anglais",
    status: "todo",
    tags: ["vocabulaire", "mémorisation", "anglais"],
  },
  {
    id: "10",
    title: "Mettre à jour mon CV",
    description: "Actualiser mon CV avec mes nouvelles compétences",
    dueDate: "2025-05-17", // Il y a 5 jours
    priority: "high",
    objectiveTitle: "Préparation au stage",
    status: "completed",
    tags: ["CV", "professionnel", "stage"],
  },
]
