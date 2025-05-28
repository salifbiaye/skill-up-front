"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, FileText, Calendar, Target, Sparkles, Trash2, Edit, Eye, CheckSquare, BookOpen } from "lucide-react"
import { EmptyObjectives } from "@/components/empty-states/empty-objectives"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useNotes } from "@/hooks/use-notes"
import { NoteModalClient } from "@/components/modals/note-modal-client"
import { Note, UpdateNoteInput, CreateNoteInput } from "@/types/notes"
import { useTasksStore, useAiChatStore, useObjectivesStore } from "@/stores"
import { useRouter } from "next/navigation"

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import {toast} from "sonner";

export function NotesGrid() {
  const { notes, isLoading, error, deleteNote, updateNote, generateAiSummary } = useNotes()
  
  // Utiliser des sélecteurs individuels pour éviter les boucles infinies
  const tasks = useTasksStore(state => state.tasks)
  const fetchTasks = useTasksStore(state => state.fetchTasks)
  
  // Récupérer les objectifs pour afficher leurs titres
  const objectives = useObjectivesStore(state => state.objectives)
  const fetchObjectives = useObjectivesStore(state => state.fetchObjectives)
  
  const router = useRouter()
  
  // Utiliser des sélecteurs individuels pour éviter les boucles infinies
  const createChatSession = useAiChatStore(state => state.createChatSession)
  const sendMessage = useAiChatStore(state => state.sendMessage)
  
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [deleteConfirmNote, setDeleteConfirmNote] = useState<Note | null>(null)
  
  // Charger les tâches et les objectifs au montage du composant
  useEffect(() => {
    fetchTasks();
    fetchObjectives();
  }, [fetchTasks, fetchObjectives]);
  
  // Fonction pour obtenir le titre d'une tâche à partir de son ID
  const getTaskTitle = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    return task ? task.title : "Tâche inconnue";
  }
  
  // Fonction pour obtenir le titre d'un objectif à partir de son ID
  const getObjectiveTitle = (objectiveId: string) => {
    const objective = objectives.find(obj => obj.id === objectiveId);
    return objective ? objective.title : "Objectif inconnue";
  }
  
  // Gérer la modification d'une note
  const handleEditNote = (note: Note) => {
    setEditingNote(note)
    setIsEditModalOpen(true)
  }
  
  // Soumettre les modifications d'une note
  const handleUpdateNote = async (data: UpdateNoteInput) => {
    try {
      await updateNote(data)
      toast("La note a été mise à jour avec succès.",)
    } catch (error) {
      toast( "Impossible de mettre à jour la note.")
    }
  }
  
  // Gérer la suppression d'une note
  const handleDeleteNote = async (id: string) => {
    try {
      await deleteNote(id)
      setDeleteConfirmNote(null)
      toast( "La note a été supprimée avec succès.")
    } catch (error) {
      toast("Impossible de supprimer la note.")
    }
  }
  
  // Gérer la génération d'un résumé IA
  const handleGenerateAiSummary = async (id: string) => {
    try {
      await generateAiSummary(id)
      toast("Le résumé IA a été généré avec succès.")
    } catch (error) {
      toast( "Impossible de générer le résumé IA.")
    }
  }
  
  // Créer une session de chat au nom de la note et rediriger vers la page AI Chat
  const handleGenerateAiResumeAndRedirect = async (note: Note) => {
    try {
      // Créer une nouvelle session avec le titre de la note
      const sessionTitle = note.title
      
      // Créer une nouvelle session de chat
      const newSession = await createChatSession({
        title: sessionTitle,
      })
      
      // Forcer la mise à jour des sessions de chat avant de rediriger
      await useAiChatStore.getState().fetchChatSessions()
      
      // Rediriger vers la page de chat avec la nouvelle session
      router.push(`/ai-chat`)
      
      toast.success("Nouvelle session de chat créée")
    } catch (error) {
      toast.error("Erreur lors de la création de la session de chat")
    }
  }

  if (isLoading && notes.length === 0) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-muted-foreground">Chargement des notes...</p>
      </div>
    )
  }


  if (notes.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <EmptyObjectives 
            title="Aucune note trouvée"
            description="Créez un objectif pour commencer à prendre des notes associées."
            actionLabel="Voir les objectifs"
            redirectUrl="/goals"
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => (
          <Card key={note.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <FileText className="h-4 w-4 text-primary" />
                <div className="flex items-center gap-2">
                  {note.hasAiSummary && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      Résumé IA
                    </Badge>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditNote(note)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </DropdownMenuItem>
                    
                      <DropdownMenuItem onClick={() => handleGenerateAiResumeAndRedirect(note)}>
                        <BookOpen className="h-4 w-4 mr-2" />
                        Générer un résumé IA
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setDeleteConfirmNote(note)} className="text-red-500">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <CardTitle className="mt-2">{note.title}</CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm text-muted-foreground line-clamp-3">{note.content}</p>
            </CardContent>
            <CardFooter className="pt-2 flex flex-col items-start gap-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>Créée le {note.createdAt}</span>
              </div>
              {note.goalId && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Target className="h-3 w-3" />
                  <span>Objectif: {getObjectiveTitle(note.goalId)}</span>
                </div>
              )}
              {note.taskId && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckSquare className="h-3 w-3" />
                  <span>Tâche: {getTaskTitle(note.taskId)}</span>
                </div>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-2"
                onClick={() => window.location.href = `/notes/${note.id}`}
              >
                <Eye className="h-3 w-3 mr-2" />
                Ouvrir la note
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {/* Modal d'édition */}
      {editingNote && (
        <NoteModalClient 
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingNote(null);
          }}
          onSubmit={async (data: CreateNoteInput | UpdateNoteInput) => {
            // Vérifier si c'est une mise à jour (avec id)
            if ('id' in data) {
              await handleUpdateNote(data);
            }
          }}
          note={editingNote}
          title="Modifier la note"
        />
      )}
      
      {/* Dialogue de confirmation de suppression */}
      <AlertDialog open={!!deleteConfirmNote} onOpenChange={(open) => !open && setDeleteConfirmNote(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cette note ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La note sera définitivement supprimée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteConfirmNote && handleDeleteNote(deleteConfirmNote.id)} className="bg-red-500 hover:bg-red-600">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
