"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { EmptyObjectives } from "@/components/empty-states/empty-objectives"
import { useObjectivesStore } from "@/stores"
import { Objective, CreateObjectiveInput, UpdateObjectiveInput } from "@/types/objectives"
import { ObjectiveItem } from "./objective-item"
import { ObjectiveModalClient } from "@/components/modals/objective-modal-client"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Link from "next/link";

export function ObjectivesList() {
  const objectives = useObjectivesStore(state => state.objectives);
  const isLoading = useObjectivesStore(state => state.isLoading);
  const error = useObjectivesStore(state => state.error);
  const createObjective = useObjectivesStore(state => state.createObjective);
  const updateObjective = useObjectivesStore(state => state.updateObjective);
  const deleteObjective = useObjectivesStore(state => state.deleteObjective);
  const updateProgress = useObjectivesStore(state => state.updateProgress);
  const updateStatus = useObjectivesStore(state => state.updateStatus);
  const fetchObjectives = useObjectivesStore(state => state.fetchObjectives);
  
  // Charger les objectifs au montage du composant
  useEffect(() => {
    fetchObjectives();
  }, []);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedObjective, setSelectedObjective] = useState<Objective | null>(null);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  // Filtrer les objectifs par statut
  const notStartedObjectives = objectives.filter(obj => obj.status === "NOT_STARTED");
  const inProgressObjectives = objectives.filter(obj => obj.status === "IN_PROGRESS");
  const completedObjectives = objectives.filter(obj => obj.status === "COMPLETED");
  
  // Gestion des actions
  const handleOpenCreateModal = () => {
    setSelectedObjective(null);
    setIsCreateModalOpen(true);
  };

  const handleOpenEditModal = (objective: Objective) => {
    setSelectedObjective(objective);
    setIsCreateModalOpen(true);
  };

  const handleOpenDeleteDialog = (objective: Objective) => {
    setSelectedObjective(objective);
    setIsAlertDialogOpen(true);
  };
  
  const handleSubmitObjective = async (data: CreateObjectiveInput | UpdateObjectiveInput) => {
    try {
      if ('id' in data) {
        await updateObjective(data);
        toast("L'objectif a été mis à jour avec succès.");
      } else {
        await createObjective(data);
        toast("L'objectif a été créé avec succès.");
      }
      setIsCreateModalOpen(false);
    } catch (error) {
      toast("Une erreur est survenue lors de l'opération.");
    }
  };
  
  const handleDeleteObjective = async () => {
    if (!selectedObjective) return;
    
    try {
      const result = await deleteObjective(selectedObjective.id);
      
      if (result.success) {
        setIsAlertDialogOpen(false);
        toast("L'objectif a été supprimé avec succès.");
      } else {
        toast(result.error || "Impossible de supprimer l'objectif.");
      }
    } catch (error) {
      toast("Impossible de supprimer l'objectif.");
    }
  };
  
  const handleUpdateProgress = async (id: string, progress: number) => {
    try {
      await updateProgress(id, progress);
      toast(`Progression mise à jour: ${progress}%`);
    } catch (error) {
      toast("Impossible de mettre à jour la progression.");
    }
  };
  
  const handleUpdateStatus = async (id: string, status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED") => {
    try {
      await updateStatus(id, status);
      toast(`Statut mis à jour: ${status === "COMPLETED" ? "Terminé" : status === "IN_PROGRESS" ? "En cours" : "Non commencé"}`);
    } catch (error) {
      toast("Impossible de mettre à jour le statut.");
    }
  };
  
  // Affichage des états de chargement et d'erreur
  if (isLoading && objectives.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-40">
            <p className="text-muted-foreground">Chargement des objectifs...</p>
          </div>
        </CardContent>
      </Card>
    );
  }


  
  // Affichage d'un message quand il n'y a aucun objectif
  if (objectives.length === 0) {
    return (
      <>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Objectifs</h2>
          <Link
              href="/goals"
              className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nouvel objectif
          </Link>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <EmptyObjectives redirectUrl="/goals" actionLabel="Voir tous les objectifs" />
          </CardContent>
        </Card>
      </>
    );
  }
  
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Objectifs</h2>
        <Button onClick={handleOpenCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvel objectif
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Liste des objectifs</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="IN_PROGRESS" className="space-y-4">
            <TabsList>
              <TabsTrigger value="NOT_STARTED">
                Non commencés <Badge className="ml-2">{notStartedObjectives.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="IN_PROGRESS">
                En cours <Badge className="ml-2">{inProgressObjectives.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="COMPLETED">
                Terminés <Badge className="ml-2">{completedObjectives.length}</Badge>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="NOT_STARTED" className="space-y-4">
              {notStartedObjectives.length === 0 ? (
                <EmptyObjectives 
                  title="Aucun objectif non commencé" 
                  description="Vous n'avez pas d'objectifs dans cette catégorie."
                  actionLabel="Voir tous les objectifs"
                  redirectUrl="/goals"
                />
              ) : (
                notStartedObjectives.map((objective) => (
                  <ObjectiveItem
                    key={objective.id}
                    objective={objective}
                    onEdit={handleOpenEditModal}
                    onDelete={handleOpenDeleteDialog}
                    onUpdateProgress={handleUpdateProgress}
                    onUpdateStatus={handleUpdateStatus}
                    showDate
                  />
                ))
              )}
            </TabsContent>
            
            <TabsContent value="IN_PROGRESS" className="space-y-4">
              {inProgressObjectives.length === 0 ? (
                <EmptyObjectives 
                  title="Aucun objectif en cours" 
                  description="Vous n'avez pas d'objectifs en cours de réalisation."
                  actionLabel="Voir tous les objectifs"
                  redirectUrl="/goals"
                />
              ) : (
                inProgressObjectives.map((objective) => (
                  <ObjectiveItem
                    key={objective.id}
                    objective={objective}
                    onEdit={handleOpenEditModal}
                    onDelete={handleOpenDeleteDialog}
                    onUpdateProgress={handleUpdateProgress}
                    onUpdateStatus={handleUpdateStatus}
                    showDate
                  />
                ))
              )}
            </TabsContent>
            
            <TabsContent value="COMPLETED" className="space-y-4">
              {completedObjectives.length === 0 ? (
                <EmptyObjectives 
                  title="Aucun objectif terminé" 
                  description="Vous n'avez pas encore terminé d'objectifs."
                  actionLabel="Voir tous les objectifs"
                  redirectUrl="/goals"
                />
              ) : (
                completedObjectives.map((objective) => (
                  <ObjectiveItem
                    key={objective.id}
                    objective={objective}
                    onEdit={handleOpenEditModal}
                    onDelete={handleOpenDeleteDialog}
                    onUpdateProgress={handleUpdateProgress}
                    onUpdateStatus={handleUpdateStatus}
                    showDate
                  />
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <ObjectiveModalClient
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleSubmitObjective}
        objective={selectedObjective}
        title={selectedObjective ? "Modifier l'objectif" : "Nouvel objectif"}
      />
      
      <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cet objectif ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. L'objectif sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteObjective} className="bg-red-500 hover:bg-red-600">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
