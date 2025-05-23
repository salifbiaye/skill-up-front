"use client";

import { Button } from "@/components/ui/button";
import { CheckSquare, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface EmptyTasksProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  redirectUrl?: string;
}

export function EmptyTasks({
  title = "Aucune tâche trouvée",
  description = "Vous n'avez pas encore créé de tâches pour aujourd'hui.",
  actionLabel = "Créer une tâche",
  onAction,
  redirectUrl
}: EmptyTasksProps) {
  const router = useRouter();
  
  const handleAction = () => {
    if (redirectUrl) {
      router.push(redirectUrl);
    } else if (onAction) {
      onAction();
    }
  };
  
  return (
    <div className="flex flex-col justify-center items-center h-[300px] text-center">
      <CheckSquare className="h-16 w-16 text-muted-foreground mb-4" />
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6">{description}</p>
      {(onAction || redirectUrl) && (
        <Button onClick={handleAction}>
          <Plus className="mr-2 h-4 w-4" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
