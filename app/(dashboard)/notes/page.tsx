"use client"

import { useEffect } from "react"
import { NotesHeader } from "@/features/notes/notes-header"
import { NotesGrid } from "@/features/notes/notes-grid"
import { useNotesStore } from "@/stores"

export default function NotesPage() {
  const fetchNotes = useNotesStore(state => state.fetchNotes)
  
  // Charger les notes au montage du composant
  useEffect(() => {
    fetchNotes()
  }, [])
  
  return (
    <div className="flex flex-col gap-8 p-8">
      <NotesHeader />
      <NotesGrid />
    </div>
  )
}
