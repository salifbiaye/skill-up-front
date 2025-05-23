import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, BarChart, MoreHorizontal, Target, Clipboard, Check } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Objective } from "@/types/objectives";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { toast } from "sonner";

export function ObjectiveItem({
  objective,
  onEdit,
  onDelete,
  onUpdateProgress,
  onUpdateStatus,
  showDate = false
}: {
  objective: Objective
  onEdit: (objective: Objective) => void
  onDelete: (objective: Objective) => void
  onUpdateProgress: (id: string, progress: number) => void
  onUpdateStatus: (id: string, status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED") => void
  showDate?: boolean
}) {
  const isCompleted = objective.status === "COMPLETED";
  const [copied, setCopied] = useState(false);
  
  const copyIdToClipboard = () => {
    navigator.clipboard.writeText(objective.id)
      .then(() => {
        setCopied(true);
        toast.success("ID de l'objectif copié dans le presse-papier");
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        toast.error("Impossible de copier l'ID");
        console.error("Erreur lors de la copie:", err);
      });
  };
  
  return (
    <div className="flex flex-col space-y-3 rounded-lg border p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className={`font-medium ${isCompleted ? "line-through text-muted-foreground" : ""}`}>
              {objective.title}
            </h3>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={copyIdToClipboard}
              title="Copier l'ID de l'objectif"
            >
              {copied ? <Check className="h-3 w-3" /> : <Clipboard className="h-3 w-3" />}
            </Button>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            {showDate && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{new Date(objective.dueDate).toLocaleDateString()}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <BarChart className="h-3 w-3" />
              <span>{objective.progress}% complété</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge 
            variant={
              objective.priority === "high" 
                ? "destructive" 
                : objective.priority === "medium" 
                  ? "default" 
                  : "outline"
            } 
            className="text-xs"
          >
            {objective.priority === "high" ? "Haute" : objective.priority === "medium" ? "Moyenne" : "Basse"}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {!isCompleted && (
                <DropdownMenuItem onClick={() => onEdit(objective)}>
                  Modifier
                </DropdownMenuItem>
              )}
              {!isCompleted && (
                <DropdownMenuItem onClick={() => onDelete(objective)}>
                  Supprimer
                </DropdownMenuItem>
              )}
              {isCompleted && (
                <DropdownMenuItem disabled className="opacity-50 cursor-not-allowed">
                  Objectif terminé (verrouillé)
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="space-y-1">
        <div className="text-sm text-muted-foreground">
          {objective.description}
        </div>
        <div className="flex items-center gap-2">
          <Progress value={objective.progress} className="h-2" />
          <span className="text-xs font-medium">{objective.progress}%</span>
        </div>
      </div>
      
      {!isCompleted && (
        <div className="flex justify-end gap-2 mt-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onUpdateProgress(objective.id, Math.min(objective.progress + 10, 100))}
            disabled={objective.progress >= 100}
          >
            +10%
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onUpdateStatus(objective.id, "COMPLETED")}
            className="bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700"
          >
            Marquer comme terminé
          </Button>
        </div>
      )}
    </div>
  );
}
