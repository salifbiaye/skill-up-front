
"use client"
import { useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowRight, Loader2 } from "lucide-react"
import { useTasksStore } from "@/stores"

// Fonction pour formater la date
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fr-FR', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  }).format(date)
}

// Fonction pour obtenir la couleur en fonction de la priorité
function getPriorityColor(priority: string): string {
  switch(priority) {
    case 'HIGH':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    case 'MEDIUM':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
    case 'LOW':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400'
  }
}

export function RecentTasks() {
  const tasks = useTasksStore(state => state.tasks)
  const isLoading = useTasksStore(state => state.isLoading)
  const error = useTasksStore(state => state.error)
  const updateStatus = useTasksStore(state => state.updateStatus)
  const fetchTasks = useTasksStore(state => state.fetchTasks)
  
  // Charger les tâches au montage du composant
  useEffect(() => {
    fetchTasks()
  }, [])
  
  // Trier les tâches par statut (non complétées d'abord) puis par date d'échéance
  const sortedTasks = [...tasks].sort((a, b) => {
    // D'abord trier par statut (non complétées en premier)
    if (a.status === "COMPLETED" && b.status !== "COMPLETED") return 1
    if (a.status !== "COMPLETED" && b.status === "COMPLETED") return -1
    
    // Ensuite trier par date d'échéance (les plus proches en premier)
    const dateA = new Date(a.dueDate)
    const dateB = new Date(b.dueDate)
    return dateA.getTime() - dateB.getTime()
  })
  
  const recentTasks = sortedTasks.slice(0, 5)

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Tâches récentes</CardTitle>
          <Link href="/tasks">
            <Button variant="ghost" size="sm" className="gap-1">
              Voir toutes <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <CardDescription>Vos tâches les plus récentes à compléter</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="text-center py-6 text-destructive">
            <p>Une erreur est survenue lors du chargement des tâches</p>
          </div>
        ) : recentTasks.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <p>Aucune tâche récente</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentTasks.map((task) => (
              <div key={task.id} className="flex items-start gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                {task.status === "COMPLETED" ? (
                  <Checkbox 
                    id={`task-${task.id}`} 
                    checked={true}
                    disabled={true}
                    className="opacity-70"
                  />
                ) : (
                  <Checkbox 
                    id={`task-${task.id}`} 
                    checked={false}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        updateStatus(task.id, "COMPLETED")
                      }
                    }}
                  />
                )}
                <div className="grid gap-1 flex-1">
                  <div className="flex justify-between items-start">
                    <label
                      htmlFor={`task-${task.id}`}
                      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${task.status === "COMPLETED" ? "line-through text-muted-foreground" : ""}`}
                    >
                      {task.title}
                    </label>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  {task.objectiveTitle && (
                    <p className="text-xs text-muted-foreground">
                      {task.objectiveTitle}
                    </p>
                  )}
                  <p className="text-xs font-medium mt-1">
                    Échéance: {formatDate(task.dueDate)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
