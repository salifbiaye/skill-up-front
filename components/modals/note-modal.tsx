// Composant modal pour les notes

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CreateNoteInput, Note, UpdateNoteInput } from "@/types/notes";
import { useTasksStore } from "@/stores";
import { Task } from "@/types/tasks";

// Définition des props pour le composant modal
interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateNoteInput | UpdateNoteInput) => Promise<void>;
  note?: Note; // Si fourni, on est en mode édition
  title: string;
}

export function NoteModal({ isOpen, onClose, onSubmit, note, title }: NoteModalProps) {
  const { tasks, fetchTasks } = useTasksStore();
  
  const [formData, setFormData] = useState<CreateNoteInput>({
    title: note?.title || "",
    content: note?.content || "",
    goalId: note?.goalId || "",
    taskId: note?.taskId || "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Charger les tâches au montage du composant
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Vérifier si un objectif est sélectionné mais pas de tâche
    if (formData.goalId && !formData.taskId) {
      setError("Vous devez sélectionner une tâche lorsqu'un objectif est choisi");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const submitData = note 
        ? { id: note.id, ...formData } as UpdateNoteInput
        : formData as CreateNoteInput;
        
      await onSubmit(submitData);
      onClose();
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Titre de la note"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Contenu</Label>
            <Textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Contenu de la note"
              className="min-h-[150px]"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="goalId">Objectif associé {note ? "" : "(optionnel)"}</Label>
            <Input
              id="goalId"
              name="goalId"
              value={formData.goalId || ""}
              onChange={handleChange}
              placeholder="Objectif associé à cette note"
              disabled={!!note} // Désactiver si c'est une note existante
              readOnly={!!note} // Lecture seule si c'est une note existante
            />
            {note && formData.goalId && (
              <p className="text-xs text-muted-foreground mt-1">L'objectif ne peut pas être modifié pour une note existante</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="taskId">
              Tâche associée {note ? "" : formData.goalId ? "(obligatoire)" : "(optionnel)"}
            </Label>
            <select
              id="taskId"
              name="taskId"
              value={formData.taskId || ""}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              disabled={!!note || !formData.goalId} // Désactiver si c'est une note existante ou pas d'objectif
              required={!note && !!formData.goalId} // Obligatoire seulement pour nouvelle note avec objectif
            >
              <option value="">{!formData.goalId ? "Sélectionnez d'abord un objectif" : "Sélectionner une tâche"}</option>
              {!note && formData.goalId && tasks
                .filter(task => 
                  task.status !== "COMPLETED" && 
                  task.goalId === formData.goalId
                )
                .map((task) => (
                  <option key={task.id} value={task.id}>
                    {task.title}
                  </option>
                ))}
              {!note && formData.goalId && tasks.filter(task =>
                task.status !== "COMPLETED" && 
                task.goalId === formData.goalId
              ).length === 0 && (
                <option value="" disabled>Aucune tâche disponible pour cet objectif</option>
              )}
            </select>
            {!note && !formData.goalId && (
              <p className="text-xs text-muted-foreground mt-1">Vous devez d'abord sélectionner un objectif pour associer une tâche</p>
            )}
            {!note && formData.goalId && !formData.taskId && (
              <p className="text-xs text-red-500 mt-1">Vous devez sélectionner une tâche lorsqu'un objectif est choisi</p>
            )}
            {note && formData.taskId && (
              <p className="text-xs text-muted-foreground mt-1">La tâche ne peut pas être modifiée pour une note existante</p>
            )}
          </div>
          

          
          {error && <p className="text-sm text-red-500">{error}</p>}
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Traitement..." : note ? "Mettre à jour" : "Créer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
