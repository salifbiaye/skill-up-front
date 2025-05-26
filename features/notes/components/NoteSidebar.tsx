"use client"

import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Note } from "@/types/notes"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock } from "lucide-react"

interface NoteSidebarProps {
  note: Note
}

export function NoteSidebar({ note }: NoteSidebarProps) {
  return (
    <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
      <div>
        <h3 className="text-sm font-medium mb-2 text-muted-foreground">Informations</h3>
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>Créée le {format(new Date(note.createdAt), "d MMMM yyyy", { locale: fr })}</span>
          </div>
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>Modifiée le {note.updatedAt ? format(new Date(note.updatedAt), "d MMMM yyyy 'à' HH:mm", { locale: fr }) : format(new Date(note.createdAt), "d MMMM yyyy 'à' HH:mm", { locale: fr })}</span>
          </div>
        </div>
      </div>

      {note.tags && note.tags.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-2 text-muted-foreground">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {note.tags?.map((tag: string) => (
              <Badge key={tag} variant="outline" className="bg-background">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {note.category && (
        <div>
          <h3 className="text-sm font-medium mb-2 text-muted-foreground">Catégorie</h3>
          <Badge className="bg-primary/10 text-primary border-primary/20">
            {note.category}
          </Badge>
        </div>
      )}
    </div>
  )
}
