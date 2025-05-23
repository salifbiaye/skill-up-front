
"use client"
import { useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowRight, Loader2 } from "lucide-react"
import { useTasksStore } from "@/stores"

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
  
  const recentTasks = tasks.slice(0, 5)

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
              <div key={task.id} className="flex items-start gap-2">
                <Checkbox 
                  id={`task-${task.id}`} 
                  checked={task.status === "completed"}
                  onCheckedChange={(checked) => {
                    updateStatus(task.id, checked ? "completed" : "todo");
                  }}
                />
                <div className="grid gap-1">
                  <label
                    htmlFor={`task-${task.id}`}
                    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`}
                  >
                    {task.title}
                  </label>
                  <p className="text-sm text-muted-foreground">
                    {task.objectiveTitle}
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
