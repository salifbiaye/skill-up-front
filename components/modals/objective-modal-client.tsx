// Ce composant est utilisé uniquement côté client, mais n'est pas exposé directement comme composant de page

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format, set } from "date-fns";
import { fr } from "date-fns/locale";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { Objective, CreateObjectiveInput, UpdateObjectiveInput } from "@/types/objectives";

interface ObjectiveModalClientProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateObjectiveInput | UpdateObjectiveInput) => Promise<void>;
  objective?: Objective | null;
  title: string;
}

export function ObjectiveModalClient({ 
  isOpen, 
  onClose, 
  onSubmit, 
  objective, 
  title 
}: ObjectiveModalClientProps) {
  const [objectiveTitle, setObjectiveTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setdueDate] = useState<string>("");
  const [dueTime, setDueTime] = useState<string>("12:00");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditMode = !!objective;
  const isCompleted = objective?.status === "COMPLETED";

  // Réinitialiser le formulaire lorsque le modal s'ouvre ou que l'objectif change
  useEffect(() => {
    if (isOpen) {
      if (objective) {
        // Mode édition: remplir avec les données de l'objectif
        setObjectiveTitle(objective.title);
        setDescription(objective.description);
        
        // Extraire la date et l'heure si disponible
        if (objective.dueDate) {
          const dateObj = new Date(objective.dueDate);
          setdueDate(format(dateObj, "yyyy-MM-dd"));
          
          // Extraire l'heure au format HH:MM
          const hours = dateObj.getHours().toString().padStart(2, '0');
          const minutes = dateObj.getMinutes().toString().padStart(2, '0');
          setDueTime(`${hours}:${minutes}`);
        } else {
          setdueDate("");
          setDueTime("12:00");
        }

      } else {
        // Mode création: réinitialiser les champs
        setObjectiveTitle("");
        setDescription("");
        setdueDate("");
        setDueTime("12:00");
      }
      setError(null);
    }
  }, [isOpen, objective]);

  const handleSubmit = async () => {
    // Validation
    if (!objectiveTitle.trim()) {
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
      const [hours, minutes] = dueTime.split(':').map(Number);
      const dateTimeObj = new Date(`${dueDate}T${dueTime}`);
      const formattedDateTime = format(dateTimeObj, "yyyy-MM-dd'T'HH:mm:ss");
      
      if (isEditMode && objective) {
        // Mise à jour d'un objectif existant
        const objectiveData: UpdateObjectiveInput = {
          id: objective.id,
          title: objectiveTitle,
          description,
          dueDate: formattedDateTime,
        };
        
        await onSubmit(objectiveData);
      } else {
        // Création d'un nouvel objectif
        const objectiveData: CreateObjectiveInput = {
          title: objectiveTitle,
          description,
          dueDate: formattedDateTime,
        };
        
        await onSubmit(objectiveData);
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
            <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Titre
            </label>
            <Input
              id="title"
              value={objectiveTitle}
              onChange={e => setObjectiveTitle(e.target.value)}
              placeholder="Titre de l'objectif"
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
              placeholder="Description de l'objectif"
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
                onChange={(e) => setdueDate(e.target.value)}
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
