import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface TasksHeaderProps {
  onCreateTask: () => void;
}

export function TasksHeader({ onCreateTask }: TasksHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tâches</h1>
        <p className="text-muted-foreground">Gérez vos tâches et suivez votre progression</p>
      </div>
      <Button onClick={onCreateTask}>
        <Plus className="mr-2 h-4 w-4" />
        Nouvelle tâche
      </Button>
    </div>
  )
}
