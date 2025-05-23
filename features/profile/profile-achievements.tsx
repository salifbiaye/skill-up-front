"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Star, Zap, BookOpen, Target, CheckCircle2 } from "lucide-react"
import { useObjectivesStore, useTasksStore, useNotesStore, useAiChatStore, useProfileStore } from "@/stores"

type Achievement = {
  id: number
  title: string
  description: string
  icon: React.ReactNode
  unlocked: boolean
  date?: string
  progress?: number
  total?: number
}

export function ProfileAchievements() {
  const objectives = useObjectivesStore(state => state.objectives)
  const tasks = useTasksStore(state => state.tasks)
  const notes = useNotesStore(state => state.notes)
  const chatSessions = useAiChatStore(state => state.chatSessions)
  const profile = useProfileStore(state => state.profile)
  
  // Récupérer les fonctions de chargement des données
  const fetchObjectives = useObjectivesStore(state => state.fetchObjectives)
  const fetchTasks = useTasksStore(state => state.fetchTasks)
  const fetchNotes = useNotesStore(state => state.fetchNotes)
  const fetchChatSessions = useAiChatStore(state => state.fetchChatSessions)
  
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Charger les données au montage du composant
  useEffect(() => {
    fetchObjectives()
    fetchTasks()
    fetchNotes()
    fetchChatSessions()
  }, [])

  useEffect(() => {
    const calculateAchievements = () => {
      setIsLoading(true)
      
      try {
        // Définir les achievements avec les données réelles
        const completedObjectives = objectives.filter(obj => obj.status === "completed").length
        const completedTasks = tasks.filter(task => task.status === "completed").length
        const notesWithAiSummary = notes.filter(note => note.hasAiSummary).length
        const aiChatCount = chatSessions.length
        
        // Calcul de la note moyenne des objectifs (simulé pour l'instant)
        // Note: nous simulons la notation car elle n'est pas encore implémentée dans le type Objective
        const objectivesWithRating = objectives.filter(obj => obj.status === "completed")
        const averageRating = objectivesWithRating.length > 0
          ? 16 // Valeur simulée pour l'instant
          : 0
        
        // Calcul des tâches complétées sans retard (simulé pour l'instant)
        const tasksCompletedOnTime = tasks.filter(task => 
          task.status === "completed" && Math.random() > 0.2 // Simulé pour l'instant
        ).length
        
        // Générer la date de déverrouillage (pour les achievements débloqués)
        const generateUnlockDate = () => {
          const date = new Date()
          date.setDate(date.getDate() - Math.floor(Math.random() * 60)) // Date aléatoire dans les 60 derniers jours
          return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
        }
        
        const calculatedAchievements: Achievement[] = [
          {
            id: 1,
            title: "Premier pas",
            description: "Compléter votre premier objectif",
            icon: <Trophy className="h-6 w-6 text-yellow-500" />,
            unlocked: completedObjectives > 0,
            date: completedObjectives > 0 ? generateUnlockDate() : undefined,
          },
          {
            id: 2,
            title: "Étudiant assidu",
            description: "Compléter 10 tâches en une semaine",
            icon: <Star className="h-6 w-6 text-purple-500" />,
            unlocked: completedTasks >= 10,
            date: completedTasks >= 10 ? generateUnlockDate() : undefined,
            progress: completedTasks < 10 ? completedTasks : undefined,
            total: completedTasks < 10 ? 10 : undefined,
          },
          {
            id: 3,
            title: "Expert en IA",
            description: "Utiliser l'assistant IA 20 fois",
            icon: <Zap className="h-6 w-6 text-primary" />,
            unlocked: aiChatCount >= 20,
            date: aiChatCount >= 20 ? generateUnlockDate() : undefined,
            progress: aiChatCount < 20 ? aiChatCount : undefined,
            total: aiChatCount < 20 ? 20 : undefined,
          },
          {
            id: 4,
            title: "Maître des notes",
            description: "Créer 15 notes avec résumés IA",
            icon: <BookOpen className="h-6 w-6 text-green-500" />,
            unlocked: notesWithAiSummary >= 15,
            date: notesWithAiSummary >= 15 ? generateUnlockDate() : undefined,
            progress: notesWithAiSummary < 15 ? notesWithAiSummary : undefined,
            total: 15,
          },
          {
            id: 5,
            title: "Objectifs ambitieux",
            description: "Compléter 5 objectifs avec une note moyenne de 16/20",
            icon: <Target className="h-6 w-6 text-blue-500" />,
            unlocked: objectivesWithRating.length >= 5 && averageRating >= 16,
            progress: objectivesWithRating.length < 5 ? objectivesWithRating.length : undefined,
            total: 5,
          },
          {
            id: 6,
            title: "Perfectionniste",
            description: "Compléter 50 tâches sans en manquer une seule",
            icon: <CheckCircle2 className="h-6 w-6 text-red-500" />,
            unlocked: tasksCompletedOnTime >= 50,
            progress: tasksCompletedOnTime < 50 ? tasksCompletedOnTime : undefined,
            total: 50,
          },
        ]
        
        setAchievements(calculatedAchievements)
      } catch (error) {
        console.error("Erreur lors du calcul des achievements:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    calculateAchievements()
  }, [objectives, tasks, notes, chatSessions, profile])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 w-40 bg-muted animate-pulse rounded mb-2"></div>
          <div className="h-4 w-64 bg-muted animate-pulse rounded"></div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="p-4 rounded-lg border bg-muted/10">
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="h-12 w-12 rounded-full bg-muted animate-pulse"></div>
                  <div className="h-5 w-24 bg-muted animate-pulse rounded mb-1"></div>
                  <div className="h-3 w-32 bg-muted animate-pulse rounded"></div>
                  <div className="h-5 w-20 bg-muted animate-pulse rounded mt-2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Récompenses et badges</CardTitle>
        <CardDescription>Vos accomplissements sur SkillUp</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-4 rounded-lg border ${achievement.unlocked ? "bg-muted/30" : "bg-background opacity-70"}`}
            >
              <div className="flex flex-col items-center text-center gap-2">
                <div className="h-12 w-12 rounded-full bg-background flex items-center justify-center mb-2">
                  {achievement.icon}
                </div>
                <h3 className="font-bold">{achievement.title}</h3>
                <p className="text-xs text-muted-foreground">{achievement.description}</p>
                {achievement.unlocked ? (
                  <Badge variant="outline" className="mt-2">
                    Débloqué le {achievement.date}
                  </Badge>
                ) : (
                  <div className="w-full mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span>{achievement.progress}</span>
                      <span>{achievement.total}</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${((achievement.progress || 0) / (achievement.total || 1)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
