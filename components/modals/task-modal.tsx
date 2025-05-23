"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Task, CreateTaskInput, UpdateTaskInput } from "@/types/tasks";
import { useTasksStore } from "@/stores";
import { useRouter } from "next/navigation";

interface TaskModalProps {
  task?: Task | null;
  objectiveId?: string;
}

export function TaskModal({ task, objectiveId }: TaskModalProps) {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();
  const { createTask, updateTask } = useTasksStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditMode = !!task;

  // Réinitialiser le formulaire lorsque le composant est monté ou que la tâche change
  useEffect(() => {
    if (task) {
      // Mode édition: remplir avec les données de la tâche
      setTitle(task.title);
      setDescription(task.description);
      setDueDate(task.dueDate ? new Date(task.dueDate) : undefined);
      setPriority(task.priority);
      setTags(task.tags || []);
    } else {
      // Mode création: réinitialiser les champs
      setTitle("");
      setDescription("");
      setDueDate(undefined);
      setPriority("MEDIUM");
      setTags([]);
    }
    setTag("");
    setError(null);
  }, [task]);
  
  const handleClose = () => {
    setIsOpen(false);
    // Utiliser setTimeout pour permettre à l'animation de fermeture de se terminer
    setTimeout(() => {
      router.refresh(); // Rafraîchir la page pour mettre à jour la liste des tâches
    }, 300);
  };

  const handleAddTag = () => {
    if (tag.trim() && !tags.includes(tag.trim())) {
      setTags([...tags, tag.trim()]);
      setTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSubmit = async () => {
    // Validation
    if (!title.trim()) {
      setError("Le titre est requis");
      return;
    }

    if (!dueDate) {
      setError("La date d'échéance est requise");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const formattedDate = format(dueDate, "yyyy-MM-dd");
      
      if (isEditMode && task) {
        // Mise à jour d'une tâche existante
        const taskData: UpdateTaskInput = {
          id: task.id,
          title,
          description,
          dueDate: formattedDate,
          priority,
          tags,
        };
        
        await updateTask(taskData);
      } else {
        // Création d'une nouvelle tâche
        const taskData: CreateTaskInput = {
          title,
          description,
          dueDate: formattedDate,
          priority,
          tags,
          goalId: objectiveId || "", // Utiliser objectiveId comme goalId ou une chaîne vide si non défini
          relatedObjective: objectiveId,
        };
        
        await createTask(taskData);
      }
      
      handleClose();
    } catch (err) {
      console.error("Erreur lors de la soumission:", err);
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && handleClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Modifier la tâche" : "Créer une nouvelle tâche"}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-2 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Titre
            </label>
            <Input
              id="title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Titre de la tâche"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Description de la tâche"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="dueDate" className="text-sm font-medium">
              Date d'échéance
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? (
                    format(dueDate, "PPP", { locale: fr })
                  ) : (
                    <span>Sélectionner une date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  locale={fr}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="priority" className="text-sm font-medium">
              Priorité
            </label>
            <Select value={priority} onValueChange={value => setPriority(value as "LOW" | "MEDIUM" | "HIGH")}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une priorité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">Basse</SelectItem>
                <SelectItem value="MEDIUM">Moyenne</SelectItem>
                <SelectItem value="HIGH">Haute</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="tags" className="text-sm font-medium">
              Tags
            </label>
            <div className="flex space-x-2">
              <Input
                id="tags"
                value={tag}
                onChange={e => setTag(e.target.value)}
                placeholder="Ajouter un tag"
                onKeyDown={e => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
              />
              <Button type="button" onClick={handleAddTag} variant="secondary">
                Ajouter
              </Button>
            </div>
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleRemoveTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Enregistrement..." : isEditMode ? "Mettre à jour" : "Créer"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
