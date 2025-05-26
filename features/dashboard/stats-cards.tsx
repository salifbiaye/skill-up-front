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
        // Date de référence pour les calculs
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
        
        // Objectifs actifs (non terminés)
        const activeObjectives = objectives.filter(obj => obj.status !== "COMPLETED").length
        
        // Changement dans les objectifs (basé sur le statut des objectifs)
        // On compte les objectifs en cours (IN_PROGRESS) comme indicateur de changement
        const inProgressObjectives = objectives.filter(obj => obj.status === "IN_PROGRESS").length
        const objectivesChange = inProgressObjectives
        
        // Tâches en cours (inclut les tâches avec statut IN_PROGRESS et les tâches TODO dont la date d'échéance est aujourd'hui ou passée)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        const inProgressTasks = tasks.filter(task => {
          // Inclure les tâches avec statut IN_PROGRESS
          if (task.status === "IN_PROGRESS") return true
          
          // Inclure les tâches TODO dont la date d'échéance est aujourd'hui ou passée
          if (task.status === "TODO") {
            const dueDate = new Date(task.dueDate)
            dueDate.setHours(0, 0, 0, 0)
            return dueDate.getTime() <= today.getTime()
          }
          
          return false
        }).length
        
        // Tâches à faire aujourd'hui (avec date d'échéance aujourd'hui)
        const todayTasks = tasks.filter(task => {
          if (task.status === "COMPLETED") return false
          
          const dueDate = new Date(task.dueDate)
          dueDate.setHours(0, 0, 0, 0)
          return dueDate.getTime() === today.getTime()
        }).length
        
        // Nombre total de notes
        const totalNotes = notes.length
        
        // Changement dans les notes (basé sur le nombre de notes avec des objectifs associés)
        // On compte les notes qui ont un objectif associé comme indicateur de changement
        const notesWithObjectives = notes.filter(note => note.goalId).length
        const notesChange = notesWithObjectives
        
        // Progression moyenne des objectifs
        let totalProgress = 0
        let completedObjectives = 0
        
        objectives.forEach(obj => {
          if (obj.status === "COMPLETED") {
            totalProgress += 100
            completedObjectives++
          } else if (obj.progress !== undefined) {
            totalProgress += obj.progress
          }
        })
        
        const averageProgress = objectives.length > 0 
          ? Math.round(totalProgress / objectives.length) 
          : 0
        
        // Changement dans la progression (basé sur les objectifs complétés)
        // On utilise le pourcentage d'objectifs complétés comme indicateur de changement
        let progressChange = 0
        if (objectives.length > 0) {
          progressChange = Math.round((completedObjectives / objectives.length) * 100)
        }
        
        // progressChange a déjà été défini plus haut
        
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
            {stats.objectivesChange > 0 ? `${stats.objectivesChange} en cours` : 'Aucun en cours'}
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
          <p className="text-xs text-muted-foreground">
            {stats.todayTasks > 0 ? `${stats.todayTasks} pour aujourd'hui` : 'Aucune pour aujourd\'hui'}
          </p>
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
            {stats.notesChange > 0 ? `${stats.notesChange} avec objectifs` : 'Aucune avec objectifs'}
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
            {stats.progressChange > 0 ? `${stats.progressChange}% d'objectifs complétés` : 'Aucun objectif complété'}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
