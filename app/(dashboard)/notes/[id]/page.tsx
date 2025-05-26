"use client"

import { NoteDetail } from "@/features/notes/note-detail"
import { useParams } from "next/navigation"

export default function NotePage() {
  const params = useParams()
  const noteId = params.id as string
  
  return <NoteDetail noteId={noteId} />
}