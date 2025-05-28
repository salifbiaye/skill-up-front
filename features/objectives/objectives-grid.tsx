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
import {ObjectivesHeader} from "@/features/objectives/objectives-header";

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
        const result = await updateObjective(data);
        if (result.success) {
          toast("L'objectif a été mis à jour avec succès.");
          setIsCreateModalOpen(false);
        } else {
          toast(result.error || "Une erreur est survenue lors de la mise à jour de l'objectif.");
        }
      } else {
        const result = await createObjective(data);
        if (result.success) {
          toast("L'objectif a été créé avec succès.");
          setIsCreateModalOpen(false);
        } else {
          toast(result.error || "Une erreur est survenue lors de la création de l'objectif.");
        }
      }
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
      const result = await updateProgress(id, progress);
      if (result.success) {
        toast(`Progression mise à jour: ${progress}%`);
      } else {
        toast(result.error || "Impossible de mettre à jour la progression.");
      }
    } catch (error) {
      toast("Impossible de mettre à jour la progression.");
    }
  };
  
  const handleUpdateStatus = async (id: string, status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED") => {
    try {
      const result = await updateStatus(id, status);
      if (result.success) {
        toast(`Statut mis à jour: ${status === "COMPLETED" ? "Terminé" : status === "IN_PROGRESS" ? "En cours" : "Non commencé"}`);
      } else {
        toast(result.error || "Impossible de mettre à jour le statut.");
      }
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
  

  
  return (
    <>
      <ObjectivesHeader handleOpenCreateModal={handleOpenCreateModal}/>
      
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
