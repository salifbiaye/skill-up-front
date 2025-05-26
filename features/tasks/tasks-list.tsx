"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { TaskModalClient } from "@/components/modals/task-modal-client"
import { Task, CreateTaskInput, UpdateTaskInput } from "@/types/tasks"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner";
import { TaskItem } from "@/features/tasks/task-item";
import { useTasksStore } from "@/stores/useTasksStore";
import { EmptyTasks } from "@/components/empty-states/empty-tasks";
import { Plus } from "lucide-react";

export function TasksList() {
  const { tasks, isLoading, error, fetchTasks, createTask, updateTask, deleteTask, updateStatus } = useTasksStore()
  
  // Charger les tâches au montage du composant
  useEffect(() => {
    fetchTasks().catch(err => {
      console.error("Erreur lors du chargement des tâches:", err);
    });
  }, [fetchTasks])

  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false)
  // Filtrer les tâches
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Réinitialiser l'heure à minuit pour comparer uniquement les dates
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const todayTasks = tasks.filter((task) => {
    const taskDate = new Date(task.dueDate);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate.getTime() === today.getTime() && task.status !== "COMPLETED";
  });
  
  const upcomingTasks = tasks.filter((task) => {
    const taskDate = new Date(task.dueDate);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate.getTime() > today.getTime() && task.status !== "COMPLETED";
  });
  
  const completedTasks = tasks.filter((task) => task.status === "COMPLETED")

  // Gestion des actions
  const handleOpenCreateModal = () => {
    setSelectedTask(null)
    setIsCreateModalOpen(true)
  }
  
  const handleOpenEditModal = (task: Task) => {
    setSelectedTask(task)
    setIsCreateModalOpen(true)
  }
  
  const handleOpenDeleteDialog = (task: Task) => {
    setSelectedTask(task)
    setIsAlertDialogOpen(true)
  }
  
  const handleSubmitTask = async (data: CreateTaskInput | UpdateTaskInput) => {
    try {
      if ('id' in data) {
        const result = await updateTask(data)
        if (result.success) {
          toast("La tâche a été mise à jour avec succès.")
          setIsCreateModalOpen(false)
        } else {
          toast(result.error || "Une erreur est survenue lors de la mise à jour de la tâche.")
          // Ne pas fermer le modal en cas d'erreur
        }
      } else {
        const result = await createTask(data)
        if (result.success) {
          toast("La tâche a été créée avec succès.")
          setIsCreateModalOpen(false)
        } else {
          toast(result.error || "Une erreur est survenue lors de la création de la tâche.")
          // Ne pas fermer le modal en cas d'erreur
        }
      }
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      toast("Une erreur est survenue lors de l'opération.")
      // Ne pas fermer le modal en cas d'erreur
    }
  }
  
  const handleDeleteTask = async () => {
    if (!selectedTask) return
    
    try {
      const result = await deleteTask(selectedTask.id)
      if (result.success) {
        setIsAlertDialogOpen(false)
        toast("La tâche a été supprimée avec succès.")
      } else {
        toast(result.error || "Impossible de supprimer la tâche. Veuillez réessayer.")
        // Ne pas fermer la boîte de dialogue en cas d'échec
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast("Une erreur est survenue lors de la suppression de la tâche.")
      // Ne pas fermer la boîte de dialogue en cas d'erreur
    }
  }
  
  const handleToggleStatus = async (taskId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "COMPLETED" ? "TODO" : "COMPLETED"
      await updateStatus(taskId, newStatus)
      toast( ` ${newStatus === "COMPLETED" ? "Tâche terminée" : "Tâche restaurée" }La tâche a été marquée comme ${newStatus === "COMPLETED" ? "terminée" : "à faire"}.`,
      )
    } catch (error) {
      toast(
   "Impossible de mettre à jour le statut de la tâche."
        )
    }
  }

  // Affichage des états de chargement et d'erreur
  if (isLoading && tasks.length === 0) {
    return (
      <Card className="mt-6">
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-40">
            <p className="text-muted-foreground">Chargement des tâches...</p>
          </div>
        </CardContent>
      </Card>
    )
  }



  if (tasks.length === 0) {
    return (
      <>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Tâches</h2>
          <Button onClick={handleOpenCreateModal}>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle tâche
          </Button>
        </div>
        
        <Card className="mt-6">
          <CardContent className="pt-6">
            <EmptyTasks 
              title="Aucune tâche trouvée" 
              description="Vous n'avez pas encore créé de tâches. Commencez par en créer une !" 
              actionLabel="Créer une tâche"
              onAction={handleOpenCreateModal}
            />
          </CardContent>
        </Card>
        <TaskModalClient
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSubmit={handleSubmitTask}
            task={selectedTask}
            title={selectedTask ? "Modifier la tâche" : "Nouvelle tâche"}
        />
      </>
    )
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Tâches</h2>
        <Button onClick={handleOpenCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle tâche
        </Button>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Liste des tâches</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="today" className="space-y-4">
            <TabsList>
              <TabsTrigger value="today">
                Aujourd'hui <Badge className="ml-2">{todayTasks.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="upcoming">
                À venir <Badge className="ml-2">{upcomingTasks.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="COMPLETED">
                Terminées <Badge className="ml-2">{completedTasks.length}</Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="today" className="space-y-4">
              {todayTasks.length === 0 ? (
                <EmptyTasks 
                  title="Aucune tâche pour aujourd'hui" 
                  description="Vous n'avez pas de tâches prévues pour aujourd'hui."
                  actionLabel="Ajouter une tâche"
                  onAction={handleOpenCreateModal}
                />
              ) : (
                todayTasks.map((task) => (
                  <TaskItem 
                    key={task.id}
                    task={task}
                    onToggleStatus={handleToggleStatus}
                    onEdit={handleOpenEditModal}
                    onDelete={handleOpenDeleteDialog}
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="upcoming" className="space-y-4">
              {upcomingTasks.length === 0 ? (
                <EmptyTasks 
                  title="Aucune tâche à venir" 
                  description="Vous n'avez pas de tâches prévues pour les prochains jours."
                  actionLabel="Planifier une tâche"
                  onAction={handleOpenCreateModal}
                />
              ) : (
                upcomingTasks.map((task) => (
                  <TaskItem 
                    key={task.id}
                    task={task}
                    onToggleStatus={handleToggleStatus}
                    onEdit={handleOpenEditModal}
                    onDelete={handleOpenDeleteDialog}
                    showDate
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="COMPLETED" className="space-y-4">
              {completedTasks.length === 0 ? (
                <EmptyTasks 
                  title="Aucune tâche terminée" 
                  description="Vous n'avez pas encore terminé de tâches."
                  actionLabel="Voir toutes les tâches"
                  onAction={() => {
                    const tabElement = document.querySelector('[data-state="inactive"][value="today"]') as HTMLElement;
                    if (tabElement) tabElement.click();
                  }}
                />
              ) : (
                completedTasks.map((task) => (
                  <TaskItem 
                    key={task.id}
                    task={task}
                    onToggleStatus={handleToggleStatus}
                    onEdit={handleOpenEditModal}
                    onDelete={handleOpenDeleteDialog}
                    isCompleted
                  />
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <TaskModalClient 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSubmit={handleSubmitTask} 
        task={selectedTask} 
        title={selectedTask ? "Modifier la tâche" : "Nouvelle tâche"} 
      />

      <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette tâche ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La tâche sera définitivement supprimée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTask} className="bg-destructive text-destructive-foreground">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

