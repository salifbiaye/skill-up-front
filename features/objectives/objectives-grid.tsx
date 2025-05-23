"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useObjectivesStore } from "@/stores"
import { EmptyObjectives } from "@/components/empty-states/empty-objectives"
import { Objective, CreateObjectiveInput, UpdateObjectiveInput } from "@/types/objectives"
import { ObjectiveItem } from "./objective-item"
import { ObjectiveModalClient } from "@/components/modals/objective-modal-client"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { toast } from "sonner";

export function ObjectivesGrid() {
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
  }, [fetchObjectives]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedObjective, setSelectedObjective] = useState<Objective | null>(null);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  
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
      await deleteObjective(selectedObjective.id);
      setIsAlertDialogOpen(false);
      toast("L'objectif a été supprimé avec succès.");
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
  
  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-40">
            <p className="text-red-500">{error}</p>
          </div>
        </CardContent>
      </Card>
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
      
      {objectives.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <EmptyObjectives 
              title="Aucun objectif disponible" 
              description="Vous n'avez pas encore créé d'objectifs pour suivre votre progression." 
              actionLabel="Créer votre premier objectif"
              onAction={handleOpenCreateModal}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {objectives.map((objective) => (
            <ObjectiveItem
              key={objective.id}
              objective={objective}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteDialog}
              onUpdateProgress={handleUpdateProgress}
              onUpdateStatus={handleUpdateStatus}
              showDate
            />
          ))}
        </div>
      )}
      
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
