import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export function ObjectivesHeader() {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Objectifs</h1>
        <p className="text-muted-foreground">Gérez vos objectifs d'apprentissage et suivez votre progression</p>
      </div>
      <Button>
        <PlusCircle className="mr-2 h-4 w-4" />
        Nouvel objectif
      </Button>
    </div>
  )
}
