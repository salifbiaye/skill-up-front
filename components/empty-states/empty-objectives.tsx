"use client";

import { Button } from "@/components/ui/button";
import { Target, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface EmptyObjectivesProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  redirectUrl?: string;
}

export function EmptyObjectives({
  title = "Aucun objectif trouvé",
  description = "Vous n'avez pas encore créé d'objectifs pour suivre votre progression.",
  actionLabel = "Créer votre premier objectif",
  onAction,
  redirectUrl
}: EmptyObjectivesProps) {
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
      <Target className="h-16 w-16 text-muted-foreground mb-4" />
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
