"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { NoteModalClient } from "@/components/modals/note-modal-client"
import { CreateNoteInput, UpdateNoteInput } from "@/types/notes"
import { useNotes } from "@/hooks/use-notes"

export function NotesHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { createNote } = useNotes()

  const handleCreateNote = async (data: CreateNoteInput | UpdateNoteInput) => {
    if ('id' in data) {
      // C'est une mise à jour, mais ce cas ne devrait pas se produire ici
      return;
    }
    await createNote(data as CreateNoteInput);
  }

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notes</h1>
        <p className="text-muted-foreground">Gérez vos notes et générez des résumés avec l'IA</p>
      </div>
      <Button onClick={() => setIsModalOpen(true)}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Nouvelle note
      </Button>

      <NoteModalClient 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateNote}
        title="Créer une nouvelle note"
      />
    </div>
  )
}
