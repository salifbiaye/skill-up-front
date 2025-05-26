
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MoreHorizontal, Target, Edit, Trash2, Copy, Check } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Task } from "@/types/tasks";
import { useState } from "react";
import { toast } from "sonner";




export function TaskItem({
                           task,
                           onToggleStatus,
                           onEdit,
                           onDelete,
                           isCompleted = false,
                           showDate = false
                         }: {
  task: Task
  onToggleStatus: (taskId: string, currentStatus: string) => void
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
  isCompleted?: boolean
  showDate?: boolean
}) {
  const [copied, setCopied] = useState(false);
  
  const copyTaskId = () => {
    navigator.clipboard.writeText(task.id);
    setCopied(true);
    toast("ID de la tâche copié dans le presse-papiers");
    setTimeout(() => setCopied(false), 2000);
  };
  const isTaskCompleted = isCompleted || task.status === "COMPLETED";

  return (
      <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
        <div className="flex items-start gap-3">
          <Checkbox
              id={`task-${task.id}`}
              checked={isTaskCompleted}
              onCheckedChange={() => !isTaskCompleted && onToggleStatus(task.id, task.status)}
              disabled={isTaskCompleted}
              className={isTaskCompleted ? "opacity-70 cursor-not-allowed" : ""}
          />
          <div>
            <label
                htmlFor={`task-${task.id}`}
                className={`font-medium ${isTaskCompleted ? "line-through text-muted-foreground" : ""}`}
            >
              {task.title}
            </label>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {showDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
              )}
              <div className="flex items-center gap-1">
                <Target className="h-3 w-3" />
                <span>{task.goalId || "Sans objectif"}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {task.priority}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={copyTaskId}>
                {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                Copier l'ID
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(task)}>
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(task)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
  )
}