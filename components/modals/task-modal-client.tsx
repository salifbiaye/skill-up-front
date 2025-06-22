// Ce composant est utilisé uniquement côté client, mais n'est pas exposé directement comme composant de page

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, set } from "date-fns";
import { fr } from "date-fns/locale";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Task, CreateTaskInput, UpdateTaskInput } from "@/types/tasks";

interface TaskModalClientProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTaskInput | UpdateTaskInput) => Promise<void>;
  task?: Task | null;
  title: string;
  objectiveId?: string;
}

export function TaskModalClient({ 
  isOpen, 
  onClose, 
  onSubmit, 
  task, 
  title,
  objectiveId
}: TaskModalClientProps) {
  const [taskTitle, setTaskTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<string>("");
  const [dueTime, setDueTime] = useState<string>("12:00");
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [goalId, setGoalId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const isEditMode = !!task;
  const isCompleted = task?.status === "COMPLETED";

  // Réinitialiser le formulaire lorsque le modal s'ouvre ou que la tâche change
  useEffect(() => {
    if (isOpen) {
      if (task) {
        // Mode édition: remplir avec les données de la tâche
        setTaskTitle(task.title);
        setDescription(task.description);
        
        // Extraire la date et l'heure si disponible
        if (task.dueDate) {
          const dateObj = new Date(task.dueDate);
          setDueDate(format(dateObj, "yyyy-MM-dd"));
          
          // Extraire l'heure au format HH:MM
          const hours = dateObj.getHours().toString().padStart(2, '0');
          const minutes = dateObj.getMinutes().toString().padStart(2, '0');
          setDueTime(`${hours}:${minutes}`);
        } else {
          setDueDate("");
          setDueTime("12:00");
        }
        
        setPriority(task.priority);
        setGoalId(task.goalId);

      } else {
        // Mode création: réinitialiser les champs
        setTaskTitle("");
        setDescription("");
        setDueDate("");
        setDueTime("12:00");
        setPriority("MEDIUM");
        setGoalId(objectiveId || "");
      }

      setError(null);
    }
  }, [isOpen, task, objectiveId]);

  const handleSubmit = async () => {
    // Validation
    if (!taskTitle.trim()) {
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
      // Combiner la date et l'heure
      const dateTimeObj = new Date(`${dueDate}T${dueTime}`);
      const formattedDateTime = format(dateTimeObj, "yyyy-MM-dd'T'HH:mm:ss");
      
      if (isEditMode && task) {
        // Mise à jour d'une tâche existante
        const taskData: UpdateTaskInput = {
          id: task.id,
          title: taskTitle,
          description,
          dueDate: formattedDateTime,
          priority,
          goalId,
        };
        
        await onSubmit(taskData);
      } else {
        // Création d'une nouvelle tâche
        const taskData: CreateTaskInput = {
          title: taskTitle,
          description,
          dueDate: formattedDateTime,
          priority,
          goalId,
        };
        
        await onSubmit(taskData);
      }
      
      onClose();
    } catch (err) {
      console.error("Erreur lors de la soumission:", err);
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
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
              value={taskTitle}
              onChange={e => setTaskTitle(e.target.value)}
              placeholder="Titre de la tâche"
              disabled={isCompleted}
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
              disabled={isCompleted}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="dueDate" className="text-sm font-medium">
              Date d'échéance
            </label>
            <div className="flex space-x-2">
              <input
                type="date"
                id="dueDate"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                min={format(new Date(), "yyyy-MM-dd")}
                disabled={isCompleted}
              />
              <input
                type="time"
                className="flex h-10 w-32 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                disabled={isCompleted}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="priority" className="text-sm font-medium">
              Priorité
            </label>
            <Select value={priority} onValueChange={(value: "LOW" | "MEDIUM" | "HIGH") => setPriority(value)} disabled={isCompleted}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">Basse</SelectItem>
                <SelectItem value="MEDIUM">Moyenne</SelectItem>
                <SelectItem value="HIGH">Haute</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Annuler
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting || isCompleted}>
              {isSubmitting ? "En cours..." : isEditMode ? "Mettre à jour" : "Créer"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
