"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, CheckSquare, FileText, TrendingUp, Loader2 } from "lucide-react"
import { useObjectivesStore, useTasksStore, useNotesStore } from "@/stores"

type StatsData = {
  activeObjectives: number
  objectivesChange: number
  inProgressTasks: number
  todayTasks: number
  totalNotes: number
  notesChange: number
  averageProgress: number
  progressChange: number
}

export function StatsCards() {
  const objectives = useObjectivesStore(state => state.objectives)
  const tasks = useTasksStore(state => state.tasks)
  const notes = useNotesStore(state => state.notes)
  const fetchObjectives = useObjectivesStore(state => state.fetchObjectives)
  const fetchTasks = useTasksStore(state => state.fetchTasks)
  const fetchNotes = useNotesStore(state => state.fetchNotes)
  const [stats, setStats] = useState<StatsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Charger les données au montage du composant
  useEffect(() => {
    fetchObjectives()
    fetchTasks()
    fetchNotes()
  }, [])

  useEffect(() => {
    // Calculer les statistiques à partir des données des stores
    const calculateStats = () => {
      setIsLoading(true)
      
      try {
        // Objectifs actifs (non terminés)
        const activeObjectives = objectives.filter(obj => obj.status !== "completed").length
        
        // Changement dans les objectifs (simulé - dans une vraie API, on aurait des données historiques)
        const objectivesChange = Math.round(Math.random() * 2) // Simulé pour l'instant
        
        // Tâches en cours
        const inProgressTasks = tasks.filter(task => task.status === "in-progress").length
        
        // Tâches à faire aujourd'hui (avec date d'échéance aujourd'hui)
        const today = new Date().toISOString().split('T')[0]
        const todayTasks = tasks.filter(task => {
          // Dans une vraie implémentation, on comparerait les dates correctement
          // Pour l'instant, on prend un sous-ensemble aléatoire des tâches en cours
          return task.status !== "completed" && Math.random() > 0.7
        }).length
        
        // Nombre total de notes
        const totalNotes = notes.length
        
        // Changement dans les notes (simulé)
        const notesChange = Math.round(Math.random() * 5)
        
        // Progression moyenne des objectifs
        let totalProgress = 0
        let completedObjectives = 0
        
        objectives.forEach(obj => {
          if (obj.status === "completed") {
            totalProgress += 100
            completedObjectives++
          } else if (obj.progress !== undefined) {
            totalProgress += obj.progress
          }
        })
        
        const averageProgress = objectives.length > 0 
          ? Math.round(totalProgress / objectives.length) 
          : 0
        
        // Changement dans la progression (simulé)
        const progressChange = Math.round(Math.random() * 15)
        
        setStats({
          activeObjectives,
          objectivesChange,
          inProgressTasks,
          todayTasks,
          totalNotes,
          notesChange,
          averageProgress,
          progressChange
        })
      } catch (error) {
        console.error("Erreur lors du calcul des statistiques:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    calculateStats()
  }, [objectives, tasks, notes])

  if (isLoading || !stats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-5 w-24 bg-muted animate-pulse rounded"></div>
              <div className="h-4 w-4 bg-muted animate-pulse rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2"></div>
              <div className="h-4 w-32 bg-muted animate-pulse rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Objectifs actifs</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeObjectives}</div>
          <p className="text-xs text-muted-foreground">
            {stats.objectivesChange > 0 ? `+${stats.objectivesChange}` : stats.objectivesChange} depuis le mois dernier
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tâches en cours</CardTitle>
          <CheckSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.inProgressTasks}</div>
          <p className="text-xs text-muted-foreground">{stats.todayTasks} tâches à faire aujourd'hui</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Notes créées</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalNotes}</div>
          <p className="text-xs text-muted-foreground">
            +{stats.notesChange} depuis la semaine dernière
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Progression moyenne</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.averageProgress}%</div>
          <p className="text-xs text-muted-foreground">
            +{stats.progressChange}% depuis le mois dernier
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
